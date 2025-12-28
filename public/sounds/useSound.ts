import { useEffect, useRef, useState } from "react";

export function useSound() {
  const buttonSound = useRef<HTMLAudioElement | null>(null);
  const musicSound = useRef<HTMLAudioElement | null>(null);
  const drumsSound = useRef<HTMLAudioElement | null>(null);
  const winnerSound = useRef<HTMLAudioElement | null>(null);
  const loserSound = useRef<HTMLAudioElement | null>(null);

  const [isMuted, setIsMuted] = useState(false);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [effectsEnabled, setEffectsEnabled] = useState(true);

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
  /* MUSIC — CONTROLADA POR ESTADO */
  /* ========================= */
  useEffect(() => {
    if (!musicSound.current) return;

    if (isMuted || !musicEnabled) {
      musicSound.current.pause();
      musicSound.current.currentTime = 0;
      return;
    }

    musicSound.current.play().catch(() => {});
  }, [isMuted, musicEnabled]);

  /* ========================= */
  /* FX */
  /* ========================= */
  function playButton() {
    if (isMuted || !effectsEnabled || !buttonSound.current) return;
    buttonSound.current.currentTime = 0;
    buttonSound.current.play().catch(() => {});
  }

  function playDrums() {
    if (isMuted || !effectsEnabled || !drumsSound.current) return;
    drumsSound.current.currentTime = 0;
    drumsSound.current.play().catch(() => {});
  }

  function playWinner() {
    if (isMuted || !effectsEnabled || !winnerSound.current) return;
    winnerSound.current.currentTime = 0;
    winnerSound.current.play().catch(() => {});
  }

  function playLoser() {
    if (isMuted || !effectsEnabled || !loserSound.current) return;
    loserSound.current.currentTime = 0;
    loserSound.current.play().catch(() => {});
  }

  /* ========================= */
  /* MUTE */
  /* ========================= */
  function toggleMute() {
    setIsMuted((prev) => !prev);
  }

  /* ========================= */
  /* UNLOCK AUDIO (GESTO DO USUÁRIO) */
  /* ========================= */
  function unlockAudio() {
    if (!musicSound.current) return;

    if (!isMuted && musicEnabled) {
      musicSound.current.play().catch(() => {});
    }
  }

  return {
    playButton,
    playDrums,
    playWinner,
    playLoser,
    toggleMute,
    unlockAudio,
    isMuted,
    musicEnabled,
    effectsEnabled,
    setMusicEnabled,
    setEffectsEnabled,
  };
}
