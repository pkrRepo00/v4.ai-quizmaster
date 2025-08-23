
import { useState, useEffect, useRef } from 'react';

export const useTimer = (initialTime: number, onTimeUp: () => void) => {
    const [timeLeft, setTimeLeft] = useState(initialTime);
    const intervalRef = useRef<number | null>(null);
    const onTimeUpCallbackRef = useRef(onTimeUp);

    // Always keep the latest onTimeUp callback in a ref
    useEffect(() => {
        onTimeUpCallbackRef.current = onTimeUp;
    }, [onTimeUp]);

    useEffect(() => {
        intervalRef.current = window.setInterval(() => {
            setTimeLeft(prevTime => {
                if (prevTime <= 1) {
                    if (intervalRef.current) {
                        clearInterval(intervalRef.current);
                    }
                    onTimeUpCallbackRef.current(); // Use the callback from the ref
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialTime]); // Now, the effect only re-runs if the initialTime changes

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return { timeLeft, formattedTime: formatTime(timeLeft) };
};
