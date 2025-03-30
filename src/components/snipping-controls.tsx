import {h} from 'preact';

interface SnippingControlsProps {
    startTime: number;
    duration: number;
    outputFileName: string;
    onStartTimeChange: (time: number) => void;
    onDurationChange: (duration: number) => void;
    onOutputFileNameChange: (name: string) => void;
    disabled: boolean;
}

export function SnippingControls({
                                     startTime,
                                     duration,
                                     outputFileName,
                                     onStartTimeChange,
                                     onDurationChange,
                                     onOutputFileNameChange,
                                     disabled
                                 }: SnippingControlsProps) {

    const handleDurationChange = (e: h.JSX.TargetedEvent<HTMLInputElement>) => {
        const value = parseFloat((e.target as HTMLInputElement).value);
        if (value < 0) {
            onDurationChange(0);
        } else {
            onDurationChange(value);
        }
    };

    return (
        <>
            <div className="control-group">
                <label htmlFor="start-time">
                    Start Time (seconds):
                </label>
                <input
                    id="start-time"
                    type="number"
                    min="0"
                    value={startTime}
                    onInput={(e) => onStartTimeChange(parseFloat((e.target as HTMLInputElement).value))}
                    disabled={disabled}
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
                    step="0.1"
                    value={duration}
                    onInput={handleDurationChange}
                    disabled={disabled}
                    aria-describedby="duration-description"
                />
                <p id="duration-description" className="helper-text">Length of the audio snippet</p>
            </div>

            <div className="control-group">
                <label htmlFor="output-filename">
                    Output File Name:
                </label>
                <input
                    id="output-filename"
                    type="text"
                    value={outputFileName}
                    onInput={(e) => onOutputFileNameChange((e.target as HTMLInputElement).value)}
                    disabled={disabled}
                    aria-describedby="filename-description"
                    required
                />
                <p id="filename-description" className="helper-text">Name for the output file (.mp3 will be added if
                    needed)</p>
            </div>
        </>
    );
}
