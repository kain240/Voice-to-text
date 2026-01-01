import { useRef, useState } from "react";
import "./App.css";
import { startDeepgram, stopDeepgram } from "./services/deepgram";

function App() {
    const recorderRef = useRef(null);
    const socketRef = useRef(null);
    const recordingRef = useRef(false);

    const [text, setText] = useState("");
    const [listening, setListening] = useState(false);

    const startRecording = async () => {
        if (recordingRef.current) return;
        recordingRef.current = true;

        setListening(true);

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
            });

            socketRef.current = startDeepgram((t) => {
                setText(prev => prev + (prev ? " " : "") + t);
            });

            const recorder = new MediaRecorder(stream, {
                mimeType: "audio/webm;codecs=opus",
            });

            recorderRef.current = recorder;

            recorder.ondataavailable = (e) => {
                if (socketRef.current?.readyState === 1 && e.data.size > 0) {
                    socketRef.current.send(e.data);
                }
            };

            const wait = setInterval(() => {
                if (socketRef.current?.readyState === 1) {
                    recorder.start(250);
                    clearInterval(wait);
                }
            }, 50);

            setTimeout(() => clearInterval(wait), 5000);

        } catch (err) {
            console.error("Recording failed:", err);
            setListening(false);
            recordingRef.current = false;
        }
    };

    const stopRecording = () => {
        if (!recordingRef.current) return;
        recordingRef.current = false;

        setListening(false);

        if (recorderRef.current) {
            recorderRef.current.stop();
            recorderRef.current.stream.getTracks().forEach(track => track.stop());
            recorderRef.current = null;
        }

        stopDeepgram(socketRef.current);
        socketRef.current = null;
    };

    return (
        <div className="app-container">
            <div className="app-card">
                <h1 className="app-title">🎙️ Voice to Text</h1>

                <button
                    className={`record-btn ${listening ? "recording" : "idle"}`}
                    onPointerDown={startRecording}
                    onPointerUp={stopRecording}
                    onPointerLeave={stopRecording}
                >
                    {listening ? "Listening..." : "Hold to Speak"}
                </button>

                <div className="transcript-box">
                    {text || <span className="placeholder">Transcript will appear here…</span>}
                </div>

                <button
                    className="clear-btn"
                    onClick={() => setText("")}
                >
                    Clear
                </button>
            </div>
        </div>
    );
}

export default App;