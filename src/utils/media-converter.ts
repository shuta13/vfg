import { fetchFile } from '@ffmpeg/ffmpeg';
import { decompressFrames, parseGIF } from 'gifuct-js';
import type { Msg } from '../types';
import { ffmpeg } from './ffmpeg';

const START_TIME = Date.now();
let PLAY_TIME = 0;
let DRAW_INDEX = 0;

export const mediaEncoder = (data: Msg['uploadedMediaData'][number]) => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  const gif = parseGIF(data.fileData);
  const frames = decompressFrames(gif, true);

  const drawMedia = () => {
    const now = Date.now();
    const elapsedTime = now - START_TIME;

    while (PLAY_TIME < elapsedTime) {
      const f = frames[DRAW_INDEX % frames.length];
      PLAY_TIME += f.delay;
      DRAW_INDEX++;
    }

    const frame = frames[DRAW_INDEX % frames.length];

    const image = new ImageData(
      frame.patch,
      frame.dims.width,
      frame.dims.height
    );
    context?.clearRect(0, 0, canvas.width, canvas.height);
    context?.putImageData(image, frame.dims.left, frame.dims.top);

    requestAnimationFrame(drawMedia);
  };

  drawMedia();

  return new Promise<{ name: string; fileData: Uint8Array }>(
    (resolve, reject) => {
      canvas.toBlob((blob) => {
        const reader = new FileReader();
        reader.onload = () =>
          reader.result && !(typeof reader.result === 'string')
            ? resolve({
                name: data.name,
                fileData: new Uint8Array(reader.result),
              })
            : reject(new Error('Could not resolve'));
        reader.onerror = () => reject(new Error('Could not read from blob'));
        blob
          ? reader.readAsArrayBuffer(blob)
          : reject(new Error('Blob is null'));
      });
    }
  );
};

const convertVideoToGif = async (file: File) => {
  if (ffmpeg.isLoaded() === false) {
    await ffmpeg.load();
  }
  const fileName = file.name.split('.')[0];
  ffmpeg.FS('writeFile', `${file.name}`, await fetchFile(file));
  // sourced: https://fireship.io/lessons/wasm-video-to-gif/
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
  return {
    name: file.name,
    fileData: data,
  };
  // const url = URL.createObjectURL(
  //   new Blob([data.buffer], { type: 'image/gif' })
  // );
  // return url;
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
