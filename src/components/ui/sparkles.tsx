'use client';

import { useEffect, useRef } from "react";
import { useMousePosition } from "@/hooks/use-mouse-position";

interface SparklesCoreProps {
  id: string;
  createdAt: number;
  color: string;
  size: number;
  style: React.CSSProperties;
}

interface SparklesProps {
  className?: string;
  particleColor?: string;
  particleCount?: number;
  minSize?: number;
  maxSize?: number;
  particleSpeed?: number;
}

const DEFAULT_COLOR = "hsl(var(--neon-blue))";

function SparklesCore({ id, createdAt, color, size, style }: SparklesCoreProps) {
  return (
    <span
      key={id}
      style={{
        ...style,
        position: "absolute",
        display: "block",
        pointerEvents: "none",
        zIndex: 10,
        fontSize: size,
        color: color,
        transformOrigin: "center center",
        animation: "sparkle-animation 1000ms linear forwards",
      }}
    >
      ✦
    </span>
  );
}

export function Sparkles({
  className = "",
  particleColor = DEFAULT_COLOR,
  particleCount = 30,
  minSize = 10,
  maxSize = 20,
  particleSpeed = 1,
}: SparklesProps) {
  const mousePosition = useMousePosition();
  const sparklesRef = useRef<HTMLDivElement>(null);
  const sparklesArray = useRef<SparklesCoreProps[]>([]);

  useEffect(() => {
    let animationFrameId: number;
    let lastCreatedAt = 0;

    const createSparkle = () => {
      const now = Date.now();
      if (now - lastCreatedAt < 50) return;
      lastCreatedAt = now;

      const sparkle: SparklesCoreProps = {
        id: String(now),
        createdAt: now,
        color: particleColor,
        size: Math.random() * (maxSize - minSize) + minSize,
        style: {
          top: mousePosition.y,
          left: mousePosition.x,
          transform: `translate(-50%, -50%) scale(${Math.random()})`,
        },
      };

      sparklesArray.current = [...sparklesArray.current, sparkle];
    };

    const updateSparkles = () => {
      const now = Date.now();
      sparklesArray.current = sparklesArray.current.filter(
        (sparkle) => now - sparkle.createdAt < 1000
      );

      if (sparklesRef.current) {
        sparklesRef.current.innerHTML = "";
        sparklesArray.current.forEach((sparkle) => {
          const element = document.createElement("span");
          element.innerHTML = "✦";
          Object.assign(element.style, {
            position: "absolute",
            display: "block",
            pointerEvents: "none",
            zIndex: "10",
            fontSize: `${sparkle.size}px`,
            color: sparkle.color,
            top: `${sparkle.style.top}px`,
            left: `${sparkle.style.left}px`,
            transform: sparkle.style.transform,
            animation: `sparkle-animation ${particleSpeed}s linear forwards`,
          });
          sparklesRef.current?.appendChild(element);
        });
      }

      animationFrameId = requestAnimationFrame(updateSparkles);
    };

    const handleMouseMove = () => {
      if (sparklesArray.current.length < particleCount) {
        createSparkle();
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    animationFrameId = requestAnimationFrame(updateSparkles);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [mousePosition, particleColor, particleCount, minSize, maxSize, particleSpeed]);

  return (
    <div ref={sparklesRef} className={className} style={{ position: "absolute", inset: 0 }}>
      <style>
        {`
          @keyframes sparkle-animation {
            0% {
              transform: scale(0) rotate(0deg);
              opacity: 1;
            }
            100% {
              transform: scale(1) rotate(180deg);
              opacity: 0;
            }
          }
        `}
      </style>
    </div>
  );
} 