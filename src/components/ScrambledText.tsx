// Scramble text effect — pure React, no premium plugins needed
// Inspired by https://codepen.io/creativeocean/pen/NPWLwJM

import React, { useEffect, useRef, useCallback } from 'react';

export interface ScrambledTextProps {
  radius?: number;
  duration?: number;
  speed?: number;
  scrambleChars?: string;
  className?: string;
  style?: React.CSSProperties;
  children: string;
}

const ScrambledText: React.FC<ScrambledTextProps> = ({
  radius = 120,
  duration = 1.2,
  speed = 0.5,
  scrambleChars = '.:<>*#@!',
  className = '',
  style = {},
  children,
}) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const spansRef = useRef<HTMLSpanElement[]>([]);
  const timersRef = useRef<Map<number, ReturnType<typeof setInterval>>>(new Map());

  const scrambleChar = useCallback(
    (span: HTMLSpanElement, index: number, original: string) => {
      // Clear any existing timer for this char
      if (timersRef.current.has(index)) {
        clearInterval(timersRef.current.get(index)!);
      }

      const totalSteps = Math.max(3, Math.round((duration / speed) * 10));
      let step = 0;

      const interval = setInterval(() => {
        if (step >= totalSteps) {
          span.textContent = original;
          clearInterval(interval);
          timersRef.current.delete(index);
          return;
        }
        const progress = step / totalSteps;
        if (progress > 0.7 || original === ' ') {
          span.textContent = original;
        } else {
          span.textContent = scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
        }
        step++;
      }, (speed * 1000) / 10);

      timersRef.current.set(index, interval);
    },
    [duration, speed, scrambleChars]
  );

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const handlePointerMove = (e: PointerEvent) => {
      spansRef.current.forEach((span, i) => {
        if (!span) return;
        const { left, top, width, height } = span.getBoundingClientRect();
        const dx = e.clientX - (left + width / 2);
        const dy = e.clientY - (top + height / 2);
        const dist = Math.hypot(dx, dy);

        if (dist < radius) {
          const original = span.dataset.original || span.textContent || '';
          scrambleChar(span, i, original);
        }
      });
    };

    el.addEventListener('pointermove', handlePointerMove);
    return () => {
      el.removeEventListener('pointermove', handlePointerMove);
      timersRef.current.forEach((t) => clearInterval(t));
    };
  }, [radius, scrambleChar]);

  const chars = Array.from(children);

  return (
    <div ref={rootRef} className={className} style={style}>
      {chars.map((char, i) => (
        <span
          key={i}
          ref={(el) => { if (el) spansRef.current[i] = el; }}
          data-original={char}
          className="inline-block"
          style={{ whiteSpace: char === ' ' ? 'pre' : undefined }}
        >
          {char}
        </span>
      ))}
    </div>
  );
};

export default ScrambledText;
