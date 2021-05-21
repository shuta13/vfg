import { fetchFile } from '@ffmpeg/ffmpeg';
import { ffmpeg } from './ffmpeg';

export const mediaConverter = async (file: File) => {
  if (ffmpeg.isLoaded() === false) {
    await ffmpeg.load();
  }
  ffmpeg.FS('writeFile', 'input.mov', await fetchFile(file));
  await ffmpeg.run(
    '-i',
    'input.mov',
    '-t',
    '2.5',
    '-ss',
    '2.0',
    '-f',
    'gif',
    'out.gif'
  );
  const data = ffmpeg.FS('readFile', 'out.gif');
  const url = URL.createObjectURL(
    new Blob([data.buffer], { type: 'image/gif' })
  );
  return url;
};
