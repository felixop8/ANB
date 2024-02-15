'use client';
import React, { useRef, useState } from 'react';
import generateTextFromAudio from '@/app/code/generateTextFromAudio';
import textFileChunkerToSupabase from '@/app/code/textFileChunkerToSupabase';

const AudioTranscriber = () => {

    const mediaRecorderRef = useRef(null);
    const [audioUrl, setAudioUrl] = useState(null);
    const [recording, setRecording] = useState(false);
    const [transcript, setTranscript] = useState('');

    const handleDataAvailable = async (e, rec) => {
        if (rec.state == "inactive") {
            const blob = new Blob([e.data], { type: "audio/webm" });
            setAudioUrl(URL.createObjectURL(blob));

            // Create a new FormData object
            const formData = new FormData();
            // Create a blob file object from the blob
            const file = new File([blob], "user_audio.webm", { type: "audio/webm" });
            // Append the audio file to the form data
            formData.append('audio', file);
            // Send audio file to the server
            const response  = await generateTextFromAudio(formData);
            setTranscript(response);
        }
    }

    const startRecording = async () => {
        setRecording(true);
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const rec = new MediaRecorder(stream);
        rec.ondataavailable = (e) => handleDataAvailable(e, rec)
        mediaRecorderRef.current = rec
        rec.start();
    }

    const stopRecording = () => {
        mediaRecorderRef.current.stop();
        setRecording(false);
    };

    const handleStoringTranscript = async (transcript) => {
        await textFileChunkerToSupabase(transcript);
        setTranscript('')

    }
    return (
        <div>
            {!recording && <button id="start-recording" onClick={() => startRecording()}>Start</button>}
            {recording && <button id="stop-recording" onClick={() => stopRecording()}>Stop</button>}
            <br />
            <audio src={audioUrl} id="audio-element" controls></audio>
            <input type="text" id="transcript" name="transcript"  value={transcript} onChange={(e) => setTranscript(e.target.value)} />
            <button onClick={() => handleStoringTranscript(transcript)} id="submit-transcript">Submit Transcript</button>
        </div>
    )
}

export default AudioTranscriber;