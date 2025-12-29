import { useEffect, useRef, useState } from "react";

export function useSound() {
  const buttonSound = useRef<HTMLAudioElement | null>(null);
  const musicSound = useRef<HTMLAudioElement | null>(null);
  const drumsSound = useRef<HTMLAudioElement | null>(null);
  const winnerSound = useRef<HTMLAudioElement | null>(null);
  const loserSound = useRef<HTMLAudioElement | null>(null);
  const finalWinSound = useRef<HTMLAudioElement | null>(null);
  const finalLoseSound = useRef<HTMLAudioElement | null>(null);

  const [isMuted, setIsMuted] = useState(false);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [effectsEnabled, setEffectsEnabled] = useState(true);

  /* INIT */
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

    finalWinSound.current = new Audio("/sounds/youWin.mp3");
    finalWinSound.current.volume = 1;

    finalLoseSound.current = new Audio("/sounds/gameOver.mp3");
    finalLoseSound.current.volume = 1;

    return () => {
      [
        buttonSound,
        musicSound,
        drumsSound,
        winnerSound,
        loserSound,
        finalWinSound,
        finalLoseSound,
      ].forEach((s) => s.current?.pause());
    };
  }, []);

  /* MUSIC */
  useEffect(() => {
    if (!musicSound.current) return;

    if (isMuted || !musicEnabled) {
      musicSound.current.pause();
      return;
    }

    musicSound.current.play().catch(() => {});
  }, [isMuted, musicEnabled]);

  /* FX */
  function play(sound?: HTMLAudioElement | null) {
    if (isMuted || !effectsEnabled || !sound) return;
    sound.currentTime = 0;
    sound.play().catch(() => {});
  }

  return {
    playButton: () => play(buttonSound.current),
    playDrums: () => play(drumsSound.current),
    playWinner: () => play(winnerSound.current),
    playLoser: () => play(loserSound.current),
    playFinalWin: () => play(finalWinSound.current),
    playFinalLose: () => play(finalLoseSound.current),
    toggleMute: () => setIsMuted((v) => !v),
    unlockAudio: () => {
      if (!isMuted && musicEnabled) {
        musicSound.current?.play().catch(() => {});
      }
    },
    isMuted,
    setMusicEnabled,
    setEffectsEnabled,
  };
}
