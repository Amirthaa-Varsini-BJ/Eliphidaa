import React, { useState, useEffect, useRef } from "react";
import { FaExpand } from "react-icons/fa";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

// 🔑 Your Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyBmWTkPntFxMqb11_CJ2O5tMJPgMt_UMY8",
  authDomain: "elphidaa-6651f.firebaseapp.com",
  databaseURL: "https://elphidaa-6651f-default-rtdb.firebaseio.com",
  projectId: "elphidaa-6651f",
  storageBucket: "elphidaa-6651f.firebasestorage.app",
  messagingSenderId: "361610666174",
  appId: "1:361610666174:web:e7e07accfc09f88842feef",
  measurementId: "G-5JD796KE23"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const firestore = firebase.firestore();

const servers = {
  iceServers: [
    { urls: ["stun:stun.l.google.com:19302"] }, // Free STUN server
  ],
};

const StudyRooms = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [roomId, setRoomId] = useState("default-room");
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const pcRef = useRef(null);

  // 🔹 CHAT LISTENER
  useEffect(() => {
    if (!roomId) return;
    const unsub = firestore
      .collection("rooms")
      .doc(roomId)
      .collection("messages")
      .orderBy("createdAt")
      .onSnapshot((snap) => {
        const msgs = snap.docs.map((doc) => doc.data());
        setMessages(msgs);
      });
    return () => unsub();
  }, [roomId]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMsg.trim()) return;

    await firestore.collection("rooms").doc(roomId).collection("messages").add({
      text: newMsg,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setNewMsg("");
  };

  // 🔹 VIDEO CALL LOGIC
  const joinRoom = async () => {
    pcRef.current = new RTCPeerConnection(servers);

    // local media
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    stream.getTracks().forEach((track) => pcRef.current.addTrack(track, stream));
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
    }

    // remote stream
    const remoteStream = new MediaStream();
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
    pcRef.current.ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => {
        remoteStream.addTrack(track);
      });
    };

    // Firestore room doc
    const roomRef = firestore.collection("rooms").doc(roomId);
    const roomSnapshot = await roomRef.get();

    if (!roomSnapshot.exists) {
      // --- Create Offer ---
      const offer = await pcRef.current.createOffer();
      await pcRef.current.setLocalDescription(offer);

      const roomWithOffer = { offer: { type: offer.type, sdp: offer.sdp } };
      await roomRef.set(roomWithOffer);

      // listen for answer
      roomRef.onSnapshot(async (snapshot) => {
        const data = snapshot.data();
        if (!pcRef.current.currentRemoteDescription && data?.answer) {
          const answerDesc = new RTCSessionDescription(data.answer);
          await pcRef.current.setRemoteDescription(answerDesc);
        }
      });

      // ICE candidates
      const callerCandidates = roomRef.collection("callerCandidates");
      pcRef.current.onicecandidate = (event) => {
        if (event.candidate) {
          callerCandidates.add(event.candidate.toJSON());
        }
      };
    } else {
      // --- Join as Answerer ---
      const data = roomSnapshot.data();
      const offerDesc = new RTCSessionDescription(data.offer);
      await pcRef.current.setRemoteDescription(offerDesc);

      const answer = await pcRef.current.createAnswer();
      await pcRef.current.setLocalDescription(answer);

      const roomWithAnswer = {
        answer: { type: answer.type, sdp: answer.sdp },
      };
      await roomRef.update(roomWithAnswer);

      // ICE candidates
      const calleeCandidates = roomRef.collection("calleeCandidates");
      pcRef.current.onicecandidate = (event) => {
        if (event.candidate) {
          calleeCandidates.add(event.candidate.toJSON());
        }
      };

      // Listen for caller candidates
      roomRef.collection("callerCandidates").onSnapshot((snapshot) => {
        snapshot.docChanges().forEach(async (change) => {
          if (change.type === "added") {
            const candidate = new RTCIceCandidate(change.doc.data());
            await pcRef.current.addIceCandidate(candidate);
          }
        });
      });
    }

    // Listen for callee candidates
    roomRef.collection("calleeCandidates").onSnapshot((snapshot) => {
      snapshot.docChanges().forEach(async (change) => {
        if (change.type === "added") {
          const candidate = new RTCIceCandidate(change.doc.data());
          await pcRef.current.addIceCandidate(candidate);
        }
      });
    });
  };

  // ✅ Small Card UI
  const MiniChat = () => (
    <>
      <h2 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "12px", color: "var(--accent-blue)" }}>
        Study Rooms
      </h2>
      <input
        type="text"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        placeholder="Enter Room ID"
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "12px",
          borderRadius: "8px",
          border: "1px solid var(--border-color)",
        }}
      />

      <div style={{ background: "#111", color: "#fff", padding: "8px", height: "180px", overflowY: "auto" }}>
        {messages.map((msg, i) => (
          <p key={i}>{msg.text}</p>
        ))}
      </div>

      <form onSubmit={sendMessage} style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
        <input
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          placeholder="Type message..."
          style={{ flexGrow: 1, borderRadius: "8px", padding: "8px" }}
        />
        <button type="submit" style={{ background: "var(--accent-blue)", color: "#fff", borderRadius: "8px", padding: "0 12px" }}>
          Send
        </button>
      </form>

      <button
        onClick={() => {
          setIsFullscreen(true);
          joinRoom(); // start WebRTC
        }}
        className="absolute top-2 right-2 p-2 bg-gray-200 rounded-full shadow hover:bg-gray-300"
        title="Open Fullscreen Study Room"
      >
        <FaExpand size={14} />
      </button>
    </>
  );

  // ✅ Fullscreen UI
  const FullscreenRoom = () => (
    <div className="fixed inset-0 z-50 bg-white flex">
      {/* Exit */}
      <button
        onClick={() => setIsFullscreen(false)}
        className="absolute top-4 right-4 p-3 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600"
      >
        ✕
      </button>

      {/* Video */}
      <div style={{ flex: 2, display: "flex", flexDirection: "column" }}>
        <video ref={localVideoRef} autoPlay playsInline muted style={{ flex: 1, background: "#000" }} />
        <video ref={remoteVideoRef} autoPlay playsInline style={{ flex: 1, background: "#000" }} />
      </div>

      {/* Chat */}
      <div style={{ flex: 1, borderLeft: "1px solid #ccc", padding: "12px", display: "flex", flexDirection: "column" }}>
        <h3>Room: {roomId}</h3>
        <div style={{ flex: 1, overflowY: "auto" }}>
          {messages.map((msg, i) => (
            <p key={i}>{msg.text}</p>
          ))}
        </div>
        <form onSubmit={sendMessage} style={{ display: "flex", gap: "8px" }}>
          <input
            value={newMsg}
            onChange={(e) => setNewMsg(e.target.value)}
            placeholder="Type..."
            style={{ flexGrow: 1, borderRadius: "8px", padding: "8px" }}
          />
          <button type="submit" style={{ background: "var(--accent-blue)", color: "#fff", borderRadius: "8px", padding: "0 12px" }}>
            Send
          </button>
        </form>
      </div>
    </div>
  );

  return <div className="card relative">{!isFullscreen ? <MiniChat /> : <FullscreenRoom />}</div>;
};

export default StudyRooms;
