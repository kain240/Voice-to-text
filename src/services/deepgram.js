let socket = null;

export function startDeepgram(onTranscript) {
    const apiKey = import.meta.env.VITE_DEEPGRAM_API_KEY;

    if (!apiKey) {
        console.error("Missing VITE_DEEPGRAM_API_KEY in .env file");
        return null;
    }

    socket = new WebSocket(
        "wss://api.deepgram.com/v1/listen?encoding=opus&punctuate=true&interim_results=false&model=nova-2&language=en",
        ["token", apiKey]
    );

    socket.onopen = () => {
        console.log("✅ Deepgram connected");
    };

    socket.onmessage = (message) => {
        try {
            const data = JSON.parse(message.data);
            const transcript = data.channel?.alternatives?.[0]?.transcript;

            if (transcript && data.is_final) {
                console.log("Transcript:", transcript);
                onTranscript(transcript);
            }
        } catch (err) {
            console.error("Parse error:", err);
        }
    };

    socket.onerror = (e) => {
        console.error("❌ Deepgram error:", e);
    };

    socket.onclose = () => {
        console.log("Deepgram closed");
    };

    return socket;
}

export function stopDeepgram(socketToClose) {
    const ws = socketToClose || socket;

    if (!ws || ws.readyState !== 1) return;

    try {
        ws.send(JSON.stringify({ type: "CloseStream" }));
    } catch (err) {
        console.error("Close error:", err);
    }

    setTimeout(() => {
        if (ws.readyState === 1) {
            ws.close();
        }
        socket = null;
    }, 300);
}