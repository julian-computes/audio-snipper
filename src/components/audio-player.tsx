import {useEffect, useRef} from 'preact/hooks';

interface AudioPlayerProps {
    audioFile: File | null;
}

export function AudioPlayer({audioFile}: AudioPlayerProps) {
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        if (audioFile && audioRef.current) {
            audioRef.current.src = URL.createObjectURL(audioFile);
        }
    }, [audioFile]);

    return (
        <audio
            ref={audioRef}
            controls
            aria-label="Audio player"
            className={audioFile ? "" : "hidden"}
        ></audio>
    );
}
