import React, { useEffect, useRef, useState } from "react";

interface LongPressButtonProps {
    duration?: number; // milliseconds to trigger the long press
    onLongPress: () => void;
    children: React.ReactNode;
    size?: number; // size of the button in px
}

export const LongPressButton: React.FC<LongPressButtonProps> = ({
    duration = 2000,
    onLongPress,
    children,
    size = 100,
}) => {
    const [progress, setProgress] = useState(0);
    const timeoutRef = useRef<number | null>(null);
    const intervalRef = useRef<number | null>(null);
    const startTimeRef = useRef<number | null>(null);
    const isPressedRef = useRef(false);

    const radius = size / 2 - 6;
    const circumference = 2 * Math.PI * radius;

    const startPress = () => {
        isPressedRef.current = true;
        startTimeRef.current = Date.now();
        setProgress(0);

        intervalRef.current = setInterval(() => {
            const elapsed = Date.now() - (startTimeRef.current || 0);
            const progressValue = Math.min(elapsed / duration, 1);
            setProgress(progressValue);
        }, 16); // ~60fps

        timeoutRef.current = setTimeout(() => {
            onLongPress();
            reset();
        }, duration);
    };

    const cancelPress = () => {
        if (!isPressedRef.current) return;
        reset();
    };

    const reset = () => {
        isPressedRef.current = false;
        clearTimeout(timeoutRef.current!);
        clearInterval(intervalRef.current!);
        setProgress(0);
    };

    useEffect(() => {
        return () => reset();
    }, []);

    return (
        <div
            style={{
                position: "relative",
                width: size,
                height: size,
                borderRadius: "50%",
                overflow: "hidden",
                userSelect: "none",
                touchAction: "manipulation",
            }}
            onMouseDown={startPress}
            onMouseUp={cancelPress}
            onMouseLeave={cancelPress}
            onTouchStart={startPress}
            onTouchEnd={cancelPress}
        >
            <svg
                width={size}
                height={size}
                style={{ position: "absolute", top: 0, left: 0 }}
            >
                <circle
                    stroke="#eee"
                    fill="none"
                    strokeWidth="4"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
                <circle
                    stroke="#53706e"
                    fill="none"
                    strokeWidth="4"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference * (1 - progress)}
                    style={{ transition: "stroke-dashoffset 0.1s linear" }}
                />
            </svg>
            <button
                style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    border: "none",
                    background: "#8ebfbb",
                    color: "#fff",
                    fontSize: "1rem",
                    cursor: "pointer",
                }}
            >
                {children}
            </button>
        </div>
    );
};
