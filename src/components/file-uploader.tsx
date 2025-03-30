import {h} from 'preact';

interface FileUploaderProps {
    onFileSelect: (file: File) => void;
    disabled: boolean;
}

export function FileUploader({onFileSelect, disabled}: FileUploaderProps) {
    const handleFileUpload = (e: h.JSX.TargetedEvent<HTMLInputElement, Event>) => {
        const file = e.currentTarget.files?.[0];
        if (!file) return;

        onFileSelect(file);
    };

    return (
        <div className="control-group">
            <label htmlFor="audio-upload">Upload Audio</label>
            <input
                id="audio-upload"
                type="file"
                accept="audio/*"
                onChange={handleFileUpload}
                disabled={disabled}
                aria-describedby="upload-description"
            />
            <p id="upload-description" className="helper-text">Select an audio file to snip</p>
        </div>
    );
}
