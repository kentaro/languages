"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";

interface AudioPlayerProps {
    src: string;
    label?: string;
    className?: string;
}

export function AudioPlayer({ src, label, className }: AudioPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const togglePlay = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const onEnded = () => {
        setIsPlaying(false);
    };

    return (
        <div className={`flex items-center gap-2 ${className || ""}`}>
            <audio
                ref={audioRef}
                src={src}
                onEnded={onEnded}
                onError={() => console.error(`Error loading audio: ${src}`)}
            />
            <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6 p-0"
                onClick={togglePlay}
                aria-label={isPlaying ? "Pause" : "Play"}
            >
                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            </Button>
            {label && <span className="text-sm">{label}</span>}
        </div>
    );
} 