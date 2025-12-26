import { useEffect, useRef, useState } from "react";

export function useSound() {
  const buttonSound = useRef<HTMLAudioElement | null>(null);
  const musicSound = useRef<HTMLAudioElement | null>(null);

  const [isMuted, setIsMuted] = useState(false);
  const [musicStarted, setMusicStarted] = useState(false);

  /* ========================= */
  /* INICIALIZA OS SONS */
  /* ========================= */
  useEffect(() => {
    buttonSound.current = new Audio("/sounds/button.mp3");
    buttonSound.current.volume = 0.6;

    musicSound.current = new Audio("/sounds/music.mp3");
    musicSound.current.volume = 0.25;
    musicSound.current.loop = true;

    return () => {
      buttonSound.current?.pause();
      musicSound.current?.pause();
    };
  }, []);

  /* ========================= */
  /* TOCAR CLICK */
  /* ========================= */
  function playButton() {
    if (isMuted || !buttonSound.current) return;

    buttonSound.current.currentTime = 0;
    buttonSound.current.play().catch(() => {});
  }

  /* ========================= */
  /* INICIAR MÚSICA (após interação) */
  /* ========================= */
  function startMusic() {
    if (isMuted || musicStarted || !musicSound.current) return;

    musicSound.current
      .play()
      .then(() => setMusicStarted(true))
      .catch(() => {});
  }

  /* ========================= */
  /* PARAR MÚSICA */
  /* ========================= */
  function stopMusic() {
    if (!musicSound.current) return;

    musicSound.current.pause();
    musicSound.current.currentTime = 0;
    setMusicStarted(false);
  }

  /* ========================= */
  /* MUTE / UNMUTE */
  /* ========================= */
  function toggleMute() {
    setIsMuted((prev) => {
      const next = !prev;

      if (musicSound.current) {
        musicSound.current.muted = next;
      }

      return next;
    });
  }

  return {
    playButton,
    startMusic,
    stopMusic,
    toggleMute,
    isMuted,
  };
}
