import { Howl } from 'howler';

export const playSound = (sound: string) => {
  const s = new Howl({
    src: [`/sounds/${sound}.mp3`],
  });
  s.play();
};
