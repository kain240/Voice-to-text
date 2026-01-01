# 🎙️ Voice to Text Desktop Application

This project is a Voice-to-Text desktop application built using **React** for the frontend and **Tauri** for desktop packaging.  
It captures microphone audio from the user and converts speech into text in real time using the **Deepgram Speech-to-Text WebSocket API**.

---

## ✨ Features

- 🎤 Microphone audio capture using the MediaRecorder API
- 🔁 Real-time speech-to-text via Deepgram WebSocket
- 🖥️ Desktop application powered by Tauri
- 🧠 Displays only final, accurate transcripts
- 🎯 Simple and minimal user interface

---

## 🛠️ Tech Stack

- **Frontend:** React + Vite
- **Desktop Framework:** Tauri
- **Speech API:** Deepgram (WebSocket-based STT)
- **Audio Handling:** MediaRecorder API
- **Styling:** CSS

---

## 🚀 How It Works

1. User starts recording from the desktop app
2. Microphone audio is captured in the browser context
3. Audio chunks are streamed to Deepgram using WebSockets
4. Deepgram processes the audio and returns transcripts
5. Final speech text is displayed in the UI

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js
- Rust & Tauri CLI
- Deepgram API Key

### 1️⃣ Clone the repository
```bash
git clone https://github.com/kain240/Voice-to-text.git
cd voice-to-text
```

### 2️⃣ Install dependencies
```bash
npm install
```

### 3️⃣ Add Deepgram API key
```env
VITE_DEEPGRAM_API_KEY=your_deepgram_api_key_here
```

### 4️⃣ Run in development
```bash
# Run as web app
npm run dev

# Run as desktop app
tauri dev
```

## 📝 Notes

### Why WebSocket instead of REST API?

This project uses the **Deepgram WebSocket API** instead of a REST-based speech-to-text API for the following reasons:

- **Real-time transcription:** WebSockets allow audio to be streamed continuously and transcription results to be received while the user is speaking.
- **Low latency:** Audio chunks are sent immediately as they are recorded, reducing delay compared to uploading a complete audio file.
- **Better user experience:** Enables interactive voice input, making the application more responsive.
- **Designed for streaming:** WebSockets are well suited for long-running, bidirectional communication such as live speech recognition.

REST APIs are more suitable for **batch processing of pre-recorded audio files**, whereas WebSockets are ideal for **live speech-to-text applications**, which is why they were chosen for this project.

## 🧠 Design Decisions

- **Final-only transcripts:** The application displays only final speech recognition results to avoid duplicate or unstable text caused by interim predictions.
- **Client-side audio streaming:** Audio is captured and streamed directly from the frontend to reduce architectural complexity for this assignment.
- **Minimal UI:** The interface is kept simple to focus on core functionality rather than visual complexity.

## ⚠️ Limitations

- Speech recognition accuracy depends on microphone quality, background noise, and network conditions.
- Very short or unclear speech may not produce a transcript.
- The application does not store transcript history; only the latest transcription is displayed.



