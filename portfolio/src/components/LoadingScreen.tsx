import { useEffect, useState } from 'react';

export default function LoadingScreen() {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFadeOut(true), 2000);
    const hideTimer = setTimeout(() => setVisible(false), 2600);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-brutalist-black flex flex-col items-center justify-center transition-opacity duration-500 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}
    >
      <img
        src="/chay-logo.png"
        alt="Chhay Vizual"
        className="h-24 w-auto object-contain mb-6"
      />
      <p className="uppercase tracking-[0.4em] text-sm text-brutalist-grey opacity-50">
        ARCHITECTURAL <span className="opacity-60">✦</span> VISUALIZATION
      </p>
      {/* Loading bar */}
      <div className="mt-10 w-40 h-px bg-zinc-800 overflow-hidden">
        <div className="h-full bg-brutalist-grey loading-bar" />
      </div>
    </div>
  );
}
