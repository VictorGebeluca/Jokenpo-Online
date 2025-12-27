import { useEffect, useRef, useState } from "react";

export function useSound() {
  const buttonSound = useRef<HTMLAudioElement | null>(null);
  const musicSound = useRef<HTMLAudioElement | null>(null);
  const drumsSound = useRef<HTMLAudioElement | null>(null);
  const winnerSound = useRef<HTMLAudioElement | null>(null);
  const loserSound = useRef<HTMLAudioElement | null>(null);

  const [isMuted, setIsMuted] = useState(false);
  const [musicStarted, setMusicStarted] = useState(false);

  /* ========================= */
  /* INIT */
  /* ========================= */
  useEffect(() => {
    buttonSound.current = new Audio("/sounds/button.mp3");
    buttonSound.current.volume = 0.6;

    musicSound.current = new Audio("/sounds/music.mp3");
    musicSound.current.volume = 0.25;
    musicSound.current.loop = true;

    drumsSound.current = new Audio("/sounds/tambores.mp3");
    drumsSound.current.volume = 0.7;

    winnerSound.current = new Audio("/sounds/winner.mp3");
    winnerSound.current.volume = 0.8;

    loserSound.current = new Audio("/sounds/loser.mp3");
    loserSound.current.volume = 0.8;

    return () => {
      buttonSound.current?.pause();
      musicSound.current?.pause();
      drumsSound.current?.pause();
      winnerSound.current?.pause();
      loserSound.current?.pause();
    };
  }, []);

  /* ========================= */
  /* FX */
  /* ========================= */
  function playButton() {
    if (isMuted || !buttonSound.current) return;
    buttonSound.current.currentTime = 0;
    buttonSound.current.play().catch(() => {});
  }

  function playDrums() {
    if (isMuted || !drumsSound.current) return;
    drumsSound.current.currentTime = 0;
    drumsSound.current.play().catch(() => {});
  }

  function playWinner() {
    if (isMuted || !winnerSound.current) return;
    winnerSound.current.currentTime = 0;
    winnerSound.current.play().catch(() => {});
  }

  function playLoser() {
    if (isMuted || !loserSound.current) return;
    loserSound.current.currentTime = 0;
    loserSound.current.play().catch(() => {});
  }

  /* ========================= */
  /* MUSIC */
  /* ========================= */
  function startMusic() {
    if (isMuted || musicStarted || !musicSound.current) return;

    musicSound.current
      .play()
      .then(() => setMusicStarted(true))
      .catch(() => {});
  }

  function stopMusic() {
    if (!musicSound.current) return;
    musicSound.current.pause();
    musicSound.current.currentTime = 0;
    setMusicStarted(false);
  }

  function toggleMute() {
    setIsMuted((prev) => {
      const next = !prev;
      if (musicSound.current) musicSound.current.muted = next;
      return next;
    });
  }

  return {
    playButton,
    playDrums,
    playWinner,
    playLoser,
    startMusic,
    stopMusic,
    toggleMute,
    isMuted,
  };
}
