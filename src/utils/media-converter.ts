import { fetchFile } from '@ffmpeg/ffmpeg';
import { ffmpeg } from './ffmpeg';

const convertVideoToGif = async (file: File) => {
  if (ffmpeg.isLoaded() === false) {
    await ffmpeg.load();
  }
  const fileName = file.name.split('.')[0];
  ffmpeg.FS('writeFile', `${file.name}`, await fetchFile(file));
  await ffmpeg.run('-i', `${file.name}`, '-f', 'gif', `${fileName}.gif`);
  const data = ffmpeg.FS('readFile', `${fileName}.gif`);
  return {
    name: file.name,
    fileData: data,
  };
};

export const mediaConverter = async (files: File[]) => {
  const mediaData = [];
  for (const file of files) {
    const data = await convertVideoToGif(file);
    mediaData.push(data);
  }
  if (mediaData.length > 0) return mediaData;
  return [];
};
