import { h } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';
import ffmpegService from './ffmpeg-service';
import './app.css';

export function App() {
    const audioRef = useRef<HTMLAudioElement>(null);
    const messageRef = useRef<HTMLParagraphElement>(null);
    const [ready, setReady] = useState<boolean>(false);
    const [audioFile, setAudioFile] = useState<File | null>(null);
    const [startTime, setStartTime] = useState<number>(0);
    const [duration, setDuration] = useState<number>(10);
    const [processing, setProcessing] = useState<boolean>(false);

    useEffect(() => {
        ffmpegService.load().then(() => {
            setReady(true);
            if (messageRef.current) {
                messageRef.current.textContent = "Audio Snipper is ready!";
            }
        }).catch((error: Error) => {
            console.error("Error loading FFmpeg:", error);
            if (messageRef.current) {
                messageRef.current.textContent = "Failed to load Audio Snipper.";
            }
        });
    }, []);

    const handleFileUpload = (e: h.JSX.TargetedEvent<HTMLInputElement, Event>) => {
        const file = e.currentTarget.files?.[0];
        if (!file) return;

        setAudioFile(file);

        if (audioRef.current) {
            audioRef.current.src = URL.createObjectURL(file);
        }

        if (messageRef.current) {
            messageRef.current.textContent = `File "${file.name}" loaded successfully.`;
        }
    };

    const snipAudio = async () => {
        if (!audioFile) {
            if (messageRef.current) {
                messageRef.current.textContent = "Please upload an audio file first.";
            }
            return;
        }

        if (!ready) {
            if (messageRef.current) {
                messageRef.current.textContent = "Audio Snipper isn't ready yet. Please wait.";
            }
            return;
        }

        setProcessing(true);

        try {
            if (messageRef.current) {
                messageRef.current.textContent = "Processing...";
            }

            // Use the FFmpeg service to snip the audio
            const outputBlob = await ffmpegService.cropAudio(
                audioFile,
                startTime,
                duration
            );

            // Create a URL for the output blob
            const url = URL.createObjectURL(outputBlob);

            // Update the audio player with the new file
            if (audioRef.current) {
                audioRef.current.src = url;
            }

            // Create a download link
            const a = document.createElement("a");
            a.href = url;
            a.download = "snipped_audio.mp3";
            a.click();

            if (messageRef.current) {
                messageRef.current.textContent = "Audio snipped successfully!";
            }
        } catch (error) {
            console.error("Error processing audio:", error);
            if (messageRef.current && error instanceof Error) {
                messageRef.current.textContent = `Error: ${error.message}`;
            }
        } finally {
            setProcessing(false);
        }
    };

    return (
        <>
            <h1>Audio Snipper</h1>

            {!ready && <p aria-live="polite" role="status" className="message">Loading Audio Snipper...</p>}

            <div className="control-group">
                <label htmlFor="audio-upload">Upload Audio</label>
                <input
                    id="audio-upload"
                    type="file"
                    accept="audio/*"
                    onChange={handleFileUpload}
                    aria-describedby="upload-description"
                />
                <p id="upload-description" className="helper-text">Select an audio file to snip</p>
            </div>

            <audio
                ref={audioRef}
                controls
                aria-label="Audio player"
                className={audioFile ? "" : "hidden"}
            ></audio>

            <div className="control-group">
                <label htmlFor="start-time">
                    Start Time (seconds):
                </label>
                <input
                    id="start-time"
                    type="number"
                    min="0"
                    value={startTime}
                    onChange={(e) => setStartTime(parseFloat((e.target as HTMLInputElement).value))}
                    aria-describedby="start-time-description"
                />
                <p id="start-time-description" className="helper-text">Where to begin the audio snippet</p>
            </div>

            <div className="control-group">
                <label htmlFor="duration">
                    Duration (seconds):
                </label>
                <input
                    id="duration"
                    type="number"
                    min="0.1"
                    value={duration}
                    onChange={(e) => setDuration(parseFloat((e.target as HTMLInputElement).value))}
                    aria-describedby="duration-description"
                />
                <p id="duration-description" className="helper-text">Length of the audio snippet</p>
            </div>

            <button
                onClick={snipAudio}
                disabled={!ready || processing}
                aria-busy={processing}
            >
                {processing ? "Processing..." : "Snip"}
            </button>

            <p
                ref={messageRef}
                aria-live="polite"
                className="message"
                role="status"
            ></p>
        </>
    );
}
