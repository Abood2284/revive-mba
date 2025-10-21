"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export interface LiveStudentCounterProps {
  from?: number;
  to?: number;
  durationMs?: number;
}

export function LiveStudentCounter({
  from = 12400,
  to = 12847,
  durationMs = 1400,
}: LiveStudentCounterProps) {
  const [value, setValue] = useState(from);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const start = performance.now();
    const delta = to - from;
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      setValue(Math.floor(from + delta * (1 - Math.pow(1 - t, 3))));
      if (t < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [from, to, durationMs]);

  const formatted = useMemo(() => `${value.toLocaleString()}+`, [value]);

  return <span className="animated-counter font-semibold">{formatted}</span>;
}

export default LiveStudentCounter;
