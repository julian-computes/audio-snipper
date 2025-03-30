interface ProcessingButtonProps {
    onClick: () => void;
    disabled: boolean;
    processing: boolean;
}

export function ProcessingButton({onClick, disabled, processing}: ProcessingButtonProps) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            aria-busy={processing}
        >
            {processing ? "Processing..." : "Snip"}
        </button>
    );
}
