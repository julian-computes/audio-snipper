import {useEffect, useState} from 'preact/hooks';
import ffmpegService from './ffmpeg-service';
import './app.css';

import {FileUploader} from './components/file-uploader';
import {AudioPlayer} from './components/audio-player';
import {SnippingControls} from './components/snipping-controls';
import {ProcessingButton} from './components/processing-button';
import {StatusMessage} from './components/status-message';

export function App() {
    const [ready, setReady] = useState<boolean>(false);
    const [audioFile, setAudioFile] = useState<File | null>(null);
    const [startTime, setStartTime] = useState<number>(0);
    const [duration, setDuration] = useState<number>(10);
    const [outputFileName, setOutputFileName] = useState<string>("");
    const [processing, setProcessing] = useState<boolean>(false);
    const [statusMessage, setStatusMessage] = useState<string>("Loading Audio Snipper...");
    const isProcessingButtonDisabled = !ready || processing || !outputFileName.trim() || !audioFile;

    useEffect(() => {
        ffmpegService.load().then(() => {
            setReady(true);
            setStatusMessage("Audio Snipper is ready!");
        }).catch((error: Error) => {
            console.error("Error loading FFmpeg:", error);
            setStatusMessage("Failed to load Audio Snipper.");
        });
    }, []);

    const handleFileSelect = (file: File) => {
        setAudioFile(file);
        setStatusMessage(`File "${file.name}" loaded successfully.`);
    };

    const snipAudio = async () => {
        if (!audioFile) {
            setStatusMessage("Please upload an audio file first.");
            return;
        }

        if (!ready) {
            setStatusMessage("Audio Snipper isn't ready yet. Please wait.");
            return;
        }

        if (!outputFileName.trim()) {
            setStatusMessage("Please specify an output file name.");
            return;
        }

        // Ensure we have a valid file extension
        let finalFileName = outputFileName.trim();
        if (!finalFileName.endsWith('.mp3')) {
            finalFileName += '.mp3';
        }

        setProcessing(true);
        setStatusMessage("Processing...");

        try {
            // Use the FFmpeg service to snip the audio
            const outputBlob = await ffmpegService.cropAudio(
                audioFile,
                startTime,
                duration
            );

            // Create a URL for the output blob
            const url = URL.createObjectURL(outputBlob);

            // Create a download link
            const a = document.createElement("a");
            a.href = url;
            a.download = finalFileName;
            a.click();

            setStatusMessage("Audio snipped successfully!");
        } catch (error) {
            console.error("Error processing audio:", error);
            if (error instanceof Error) {
                setStatusMessage(`Error: ${error.message}`);
            }
        } finally {
            setProcessing(false);
        }
    };

    return (
        <>
            <h1>Audio Snipper</h1>

            {!ready && <StatusMessage message="Loading Audio Snipper..."/>}

            <FileUploader
                onFileSelect={handleFileSelect}
                disabled={processing}
            />

            <AudioPlayer audioFile={audioFile}/>

            <SnippingControls
                startTime={startTime}
                duration={duration}
                outputFileName={outputFileName}
                onStartTimeChange={setStartTime}
                onDurationChange={setDuration}
                onOutputFileNameChange={setOutputFileName}
                disabled={processing}
            />

            <ProcessingButton
                onClick={snipAudio}
                disabled={isProcessingButtonDisabled}
                processing={processing}
            />

            <StatusMessage message={statusMessage}/>

            <footer>
                <section className="support-section">
                    <p>Audio Snipper respects your privacy. All audio processing happens in your browser.</p>
                    <p>Your files never leave your device.</p>
                    <p>
                        If you like this tool, please consider <a href="https://buymeacoffee.com/julian.computes" target="_blank"
                                                                  rel="noopener noreferrer">buying me a coffee</a>.
                    </p>
                </section>
            </footer>
        </>
    );
}
