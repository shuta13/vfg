import { fetchFile } from '@ffmpeg/ffmpeg';
import { ffmpeg } from './ffmpeg';

const convertVideoToGif = async (file: File) => {
  if (ffmpeg.isLoaded() === false) {
    await ffmpeg.load();
  }
  const fileName = file.name.split('.')[0];
  ffmpeg.FS('writeFile', `${file.name}`, await fetchFile(file));
  await ffmpeg.run(
    '-i',
    `${file.name}`,
    '-t',
    '2.5',
    '-ss',
    '2.0',
    '-f',
    'gif',
    `${fileName}.gif`
  );
  const data = ffmpeg.FS('readFile', `${fileName}.gif`);
  const url = URL.createObjectURL(
    new Blob([data.buffer], { type: 'image/gif' })
  );
  return url;
};

export const mediaConverter = async (files: File[]) => {
  const urls = [];
  for (const file of files) {
    const url = await convertVideoToGif(file);
    urls.push(url);
  }
  if (urls.length > 0) return urls;
  return [];
};
