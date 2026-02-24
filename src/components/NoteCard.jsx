    import { FaDownload, FaStar } from "react-icons/fa";
    import StarRating from "./StarRating";

    const styles = {
      downloadButton: {
        width: "100%",
        padding: "12px",
        borderRadius: "8px",
        background: "var(--accent-purple)",
        color: "var(--text-primary)",
        fontWeight: 600,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        transition: "opacity 0.2s",
        cursor: "pointer",
        border: "none",
      },
    };

    const NoteCard = ({ note }) => {
      return (
        <div
          className="card"
          style={{
            padding: 0,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            borderRadius: "10px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            background: "var(--card-bg, #fff)",
          }}
        >
          {/* 🔹 Thumbnail (click to open PDF) */}
          <a href={note.fileUrl} target="_blank" rel="noopener noreferrer">
            <img
              src={note.thumbnail}
              alt={note.title}
              style={{ width: "100%", height: "150px", objectFit: "cover", cursor: "pointer" }}
            />
          </a>

          <div style={{ padding: "16px", display: "flex", flexDirection: "column", flexGrow: 1 }}>
            {/* Title */}
            <h3 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "8px" }}>
              {note.title}
            </h3>

            {/* Rating (average + count) */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "var(--accent-orange)" }}>
                <FaStar />
                <span style={{ fontWeight: 600 }}>{note.rating ? note.rating.toFixed(1) : "0.0"}</span>
              </div>
              <span style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
                ({note.count} ratings)
              </span>
            </div>

            {/* Submitter */}
            <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginBottom: "16px" }}>
              Submitted by: {note.submitter}
            </p>

            {/* Interactive Star Rating */}
            <div style={{ marginBottom: "16px" }}>
              <StarRating
                isInteractive={true}
                subject="notes"
                topic={note.id}
              />
            </div>

            {/* Download button */}
            <a
              href={note.fileUrl}
              download
              style={{ ...styles.downloadButton, marginTop: "auto" }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              <FaDownload /> Download Notes
            </a>
          </div>
        </div>
      );
    };

    export default NoteCard;
