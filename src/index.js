import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ThemeProvider } from "./context/ThemeContext";

// Error boundary component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("❌ React Error:", error);
    console.error("Error Info:", errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "20px", textAlign: "center", color: "red" }}>
          <h2>App Error</h2>
          <p>{this.state.error?.message}</p>
          <details style={{ whiteSpace: "pre-wrap", textAlign: "left", color: "#666" }}>
            {this.state.error?.stack}
          </details>
        </div>
      );
    }
    return this.props.children;
  }
}

console.log("✅ Index.js loading...");
const root = ReactDOM.createRoot(document.getElementById("root"));
console.log("✅ Root element found");

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </ErrorBoundary>
  </React.StrictMode>
);

console.log("✅ App rendered");