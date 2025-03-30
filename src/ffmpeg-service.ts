import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";

class FFmpegService {
    private ffmpeg: FFmpeg;
    private loaded: boolean = false;

    constructor() {
        this.ffmpeg = new FFmpeg();
    }

    async load(): Promise<void> {
        if (this.loaded) return;

        try {
            await this.ffmpeg.load();
            this.loaded = true;
        } catch (error) {
            console.error("Failed to load FFmpeg:", error);
            throw error;
        }
    }

    async cropAudio(
        audioFile: File,
        startTime: number,
        duration: number
    ): Promise<Blob> {
        if (!this.loaded) {
            throw new Error("FFmpeg is not loaded yet");
        }

        try {
            // Write the input file to memory
            await this.ffmpeg.writeFile("input.mp3", await fetchFile(audioFile));

            // Execute the FFmpeg command to crop the audio
            await this.ffmpeg.exec([
                "-i", "input.mp3",
                "-ss", startTime.toString(),
                "-t", duration.toString(),
                "-acodec", "copy",
                "output.mp3"
            ]);

            // Read the result
            const data = await this.ffmpeg.readFile("output.mp3");
            const uint8Array = new Uint8Array(data as ArrayBuffer);

            // Create a blob for the output file
            return new Blob([uint8Array.buffer], { type: "audio/mp3" });
        } catch (error) {
            console.error("Error processing audio:", error);
            throw error;
        }
    }
}

// Export a singleton instance
const ffmpegService = new FFmpegService();
export default ffmpegService;
