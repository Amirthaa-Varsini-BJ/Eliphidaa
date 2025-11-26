// src/components/StudyRooms.jsx
import React, { useEffect, useRef, useState } from "react";
import { FaExpand } from "react-icons/fa";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

// ======= FIREBASE CONFIG (fill these) =======
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};
// ===========================================

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const firestore = firebase.firestore();

// Public STUN
const rtcConfig = {
  iceServers: [{ urls: ["stun:stun.l.google.com:19302"] }],
};

const StudyRooms = () => {
  // UI state
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [roomId, setRoomId] = useState("ALPHA123");

  // Chat state
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const chatUnsubRef = useRef(null);

  // WebRTC / media refs
  const pcRef = useRef(null);
  const isCallerRef = useRef(false);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const localStreamRef = useRef(null);

  // Firestore signaling listeners
  const roomUnsubRef = useRef(null);
  const callerCandUnsubRef = useRef(null);
  const calleeCandUnsubRef = useRef(null);

  // ---- CHAT LISTENER (works in both modes) ----
  useEffect(() => {
    if (!roomId) return;
    if (chatUnsubRef.current) chatUnsubRef.current(); // re-subscribe on room change
    chatUnsubRef.current = firestore
      .collection("rooms")
      .doc(roomId)
      .collection("messages")
      .orderBy("createdAt")
      .onSnapshot((snap) => {
        const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setMessages(data);
      });
    return () => {
      if (chatUnsubRef.current) chatUnsubRef.current();
      chatUnsubRef.current = null;
    };
  }, [roomId]);

  const sendMessage = async (e) => {
    e?.preventDefault();
    if (!newMsg.trim()) return;
    try {
      await firestore
        .collection("rooms")
        .doc(roomId)
        .collection("messages")
        .add({
          text: newMsg.trim(),
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        });
      setNewMsg("");
    } catch (err) {
      console.error("sendMessage error:", err);
    }
  };

  // ---- JOIN ROOM (start WebRTC) ----
  const joinRoom = async () => {
    if (pcRef.current) return; // already connected
    try {
      // PeerConnection
      const pc = new RTCPeerConnection(rtcConfig);
      pcRef.current = pc;

      // Local media
      const localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      localStreamRef.current = localStream;
      localStream.getTracks().forEach((t) => pc.addTrack(t, localStream));
      if (localVideoRef.current) localVideoRef.current.srcObject = localStream;

      // Remote media
      const remoteStream = new MediaStream();
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream;
      pc.ontrack = (e) => {
        e.streams[0].getTracks().forEach((track) => remoteStream.addTrack(track));
      };

      const roomRef = firestore.collection("rooms").doc(roomId);
      const roomSnap = await roomRef.get();

      if (!roomSnap.exists) {
        // Create room (caller)
        isCallerRef.current = true;
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        await roomRef.set({ offer: { type: offer.type, sdp: offer.sdp } });

        // onicecandidate -> callerCandidates
        const callerCandidates = roomRef.collection("callerCandidates");
        pc.onicecandidate = (event) => {
          if (event.candidate) callerCandidates.add(event.candidate.toJSON());
        };

        // listen for answer
        roomUnsubRef.current = roomRef.onSnapshot(async (snapshot) => {
          const data = snapshot.data();
          if (data?.answer && !pc.currentRemoteDescription) {
            await pc.setRemoteDescription(new RTCSessionDescription(data.answer));
          }
        });

        // listen for callee ICE
        calleeCandUnsubRef.current = roomRef.collection("calleeCandidates").onSnapshot((snap) => {
          snap.docChanges().forEach(async (change) => {
            if (change.type === "added") {
              try {
                const candidate = new RTCIceCandidate(change.doc.data());
                await pc.addIceCandidate(candidate);
              } catch (e) {
                console.warn("addIceCandidate (callee) failed:", e);
              }
            }
          });
        });
      } else {
        // Join room (callee)
        isCallerRef.current = false;

        const roomData = roomSnap.data();
        if (!roomData?.offer) {
          console.warn("Room exists but has no offer yet.");
          return;
        }

        await pc.setRemoteDescription(new RTCSessionDescription(roomData.offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        await roomRef.update({ answer: { type: answer.type, sdp: answer.sdp } });

        // onicecandidate -> calleeCandidates
        const calleeCandidates = roomRef.collection("calleeCandidates");
        pc.onicecandidate = (event) => {
          if (event.candidate) calleeCandidates.add(event.candidate.toJSON());
        };

        // listen for caller ICE
        callerCandUnsubRef.current = roomRef.collection("callerCandidates").onSnapshot((snap) => {
          snap.docChanges().forEach(async (change) => {
            if (change.type === "added") {
              try {
                const candidate = new RTCIceCandidate(change.doc.data());
                await pc.addIceCandidate(candidate);
              } catch (e) {
                console.warn("addIceCandidate (caller) failed:", e);
              }
            }
          });
        });
      }
    } catch (err) {
      console.error("joinRoom error:", err);
    }
  };

  // ---- LEAVE ROOM (cleanup everything) ----
  const leaveRoom = async () => {
    try {
      const roomRef = firestore.collection("rooms").doc(roomId);

      // Stop local tracks
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((t) => {
          try {
            t.stop();
          } catch {}
        });
      }
      if (localVideoRef.current) localVideoRef.current.srcObject = null;
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;

      // Close peer connection
      if (pcRef.current) {
        try {
          pcRef.current.getSenders().forEach((s) => s.track && s.track.stop?.());
        } catch {}
        try {
          pcRef.current.close();
        } catch {}
        pcRef.current = null;
      }

      // Unsubscribe Firestore listeners
      [roomUnsubRef, callerCandUnsubRef, calleeCandUnsubRef].forEach((ref) => {
        if (ref.current) {
          try {
            ref.current();
          } catch {}
          ref.current = null;
        }
      });

      // Try to clean signaling data
      const deleteSubcollection = async (sub) => {
        try {
          const snap = await roomRef.collection(sub).get();
          const batch = firestore.batch();
          snap.docs.forEach((d) => batch.delete(d.ref));
          await batch.commit();
        } catch (e) {
          console.warn(`Failed to delete ${sub}:`, e.message);
        }
      };

      if (isCallerRef.current) {
        // Caller cleans up both candidate sets and the room doc
        await deleteSubcollection("callerCandidates");
        await deleteSubcollection("calleeCandidates");
        try {
          await roomRef.delete();
        } catch (e) {
          console.warn("Failed to delete room doc:", e.message);
        }
      } else {
        // Callee cleans only their candidates (optional)
        await deleteSubcollection("calleeCandidates");
      }
    } catch (err) {
      console.error("leaveRoom error:", err);
    } finally {
      // reset flags/refs
      isCallerRef.current = false;
      localStreamRef.current = null;
    }
  };

  // Cleanup on unmount or when leaving fullscreen
  useEffect(() => {
    const onBeforeUnload = () => leaveRoom();
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload);
      // If component unmounts while connected
      leaveRoom();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ------------- UI -------------
  const MiniMode = () => (
    <>
      <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12, color: "var(--accent-blue)" }}>
        Study Rooms
      </h2>

      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        <input
          type="text"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          placeholder="Enter Room ID (e.g., ALPHA123)"
          style={{
            flexGrow: 1,
            padding: 10,
            borderRadius: 8,
            border: "1px solid var(--border-color)",
            background: "var(--bg-primary)",
            color: "var(--text-primary)",
          }}
        />
      </div>

      {/* Mini chat only */}
      <div
        style={{
          background: "var(--bg-primary)",
          borderRadius: 8,
          padding: 10,
          height: 200,
          overflowY: "auto",
          marginBottom: 8,
        }}
      >
        {messages.length === 0 ? (
          <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>No messages yet. Say hi 👋</p>
        ) : (
          messages.map((m) => (
            <p key={m.id} style={{ marginBottom: 6, fontSize: 14 }}>
              {m.text}
            </p>
          ))
        )}
      </div>

      <form onSubmit={sendMessage} style={{ display: "flex", gap: 8 }}>
        <input
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          placeholder="Type a message..."
          style={{
            flexGrow: 1,
            padding: 10,
            borderRadius: 8,
            border: "1px solid var(--border-color)",
            background: "var(--bg-primary)",
            color: "var(--text-primary)",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "0 14px",
            borderRadius: 8,
            background: "var(--accent-blue)",
            color: "var(--text-primary)",
            fontWeight: 600,
          }}
        >
          Send
        </button>
      </form>

      {/* Open fullscreen (video+chat) */}
      <button
        onClick={async () => {
          setIsFullscreen(true);
          await joinRoom(); // start WebRTC when opening
        }}
        className="absolute top-2 right-2 p-2 bg-gray-200 rounded-full shadow hover:bg-gray-300"
        title="Open Fullscreen Study Room"
      >
        <FaExpand size={14} />
      </button>
    </>
  );

  const FullscreenMode = () => (
    <div className="fixed inset-0 z-50 bg-white flex">
      {/* Exit / Leave Room */}
      <button
        onClick={async () => {
          await leaveRoom();
          setIsFullscreen(false);
        }}
        className="absolute top-4 right-4 p-3 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600"
      >
        ✕
      </button>

      {/* Video Area */}
      <div style={{ flex: 2, display: "flex", flexDirection: "column" }}>
        <video
          ref={localVideoRef}
          autoPlay
          playsInline
          muted
          style={{ flex: 1, width: "100%", background: "#000" }}
        />
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          style={{ flex: 1, width: "100%", background: "#000" }}
        />
      </div>

      {/* Chat Area */}
      <div style={{ flex: 1, borderLeft: "1px solid #e5e7eb", padding: 12, display: "flex", flexDirection: "column" }}>
        <h3 style={{ marginBottom: 8 }}>Room: {roomId}</h3>
        <div style={{ flex: 1, overflowY: "auto", marginBottom: 8 }}>
          {messages.map((m) => (
            <p key={m.id} style={{ marginBottom: 6 }}>
              {m.text}
            </p>
          ))}
        </div>
        <form onSubmit={sendMessage} style={{ display: "flex", gap: 8 }}>
          <input
            value={newMsg}
            onChange={(e) => setNewMsg(e.target.value)}
            placeholder="Type..."
            style={{ flexGrow: 1, padding: 10, borderRadius: 8, border: "1px solid #e5e7eb" }}
          />
          <button type="submit" style={{ padding: "0 14px", borderRadius: 8, background: "var(--accent-blue)", color: "#fff" }}>
            Send
          </button>
        </form>
      </div>
    </div>
  );

  return <div className="card relative">{isFullscreen ? <FullscreenMode /> : <MiniMode />}</div>;
};

export default StudyRooms;
