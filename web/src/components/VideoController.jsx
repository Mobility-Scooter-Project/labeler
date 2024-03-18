import React, { useState } from "react";
import VideoPlayer from "react-video-player-extended";

function clamp(a, b, c, d, e) {
  const v = (a - b) / (c - b) * (e - d) + d
  return Math.max(d, Math.min(e, v))
}

const getColor = (value) => {
  const convert = (v) => clamp(Math.log(v), -8, -1, 0, 1)
  if (value < 1)
    return `rgb(230, ${convert(1 - value) * 230}, ${convert(1 - value) * 230})`
  else if (value < 2)
    return `rgb(230, 230, ${convert(2 - value) * 230})`
  else
    return `rgb(${convert(3 - value) * 230}, 230, ${convert(3 - value) * 230})`
};

export function VideoController({
  playing,
  onPlay,
  onPause,
  source,
  values,
  fps,
  slowdown,
  onProgress,
}) {
  const [volume, setVolume] = useState(0.7);
  const [timeStart] = useState(0);
  const controls = ["Play", "Time", "Progress", "Volume", "NextFrame"];

  const handleDuration = (duration) => {
    console.log("Duration: ", duration);
  };

  React.useEffect(() => {
    // Add progress bar when the component mounts
    const progressWrap = document.querySelector('.progress-wrap');
    const volume = document.querySelector('.volume');
    if (volume) {
      volume.style.marginLeft = '12px';
      volume.style.maxWidth = '16px';
    }

    const createGradient = () => {
      let total = 0;
      let gradient = '';

      values.forEach((value, index) => {
        const startPos = total;
        const endPos = startPos + 100 / values.length;
        const color = getColor(value);
        gradient += `, ${color} ${startPos}%, ${color} ${endPos}%`;
        total += 100 / values.length;
      });

      return `linear-gradient(to right${gradient})`;
    };
    if (progressWrap) {
      progressWrap.style.margin = 0;
      const bar = document.createElement('div');
      bar.className = 'bar';
      bar.style.background = createGradient();
      progressWrap.appendChild(bar);
    }

    // Remove progress bar when the component unmounts
    return () => {
      progressWrap?.querySelector('.bar')?.remove();
    };
  }, [values, source]);

  return (
    source && <VideoPlayer
      key={source} // force remount when videoSource is changed
      url={source}
      controls={controls}
      isPlaying={playing}
      volume={volume}
      loop={false}
      height={"auto"}
      width={"800px"}
      timeStart={timeStart}
      onPlay={onPlay}
      onPause={onPause}
      onVolume={(value) => setVolume(value)}
      onProgress={onProgress}
      onDuration={handleDuration}
      onVideoPlayingComplete={(props) => onPause()}
      fps={fps}
    />
  );
}
