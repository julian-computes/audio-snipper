import {useEffect, useRef} from 'preact/hooks';

interface StatusMessageProps {
    message: string;
}

export function StatusMessage({message}: StatusMessageProps) {
    const messageRef = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
        if (messageRef.current) {
            messageRef.current.textContent = message;
        }
    }, [message]);

    return (
        <p
            ref={messageRef}
            aria-live="polite"
            className="message"
            role="status"
        >
            {message}
        </p>
    );
}
