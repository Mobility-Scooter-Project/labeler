import React, { useState, useRef } from "react";
import VideoPlayer from "react-video-player-extended";

const MAX_WIDTH = 800;
const MAX_HEIGHT = 550;

export function VideoController({
  playing,
  onPlay,
  onPause,
  source,
  fps,
  speed,
  onProgress,
  onDuration,
  colors,
  onComplete,
}) {
  const [volume, setVolume] = useState(0.7);
  const [timeStart] = useState(0);
  const controls = ["Play", "Time", "Progress", "Volume", "NextFrame"];
  const videoRef = useRef(null);

  React.useEffect(() => {
    // Add progress bar when the component mounts
    const volume = document.querySelector(".volume");
    if (volume) {
      volume.style.marginLeft = "12px";
      volume.style.maxWidth = "16px";
    }
    // Reset playback speed
    videoRef.current = document.querySelector(".react-video-player");
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  }, [source, speed]);

  const createGradient = () => {
    let total = 0;
    let gradient = "";

    colors.forEach(color => {
      const startPos = total;
      const endPos = startPos + 100 / colors.length;
      gradient += `, ${color} ${startPos}%, ${color} ${endPos}%`;
      total += 100 / colors.length;
    });

    return `linear-gradient(to right${gradient})`;
  };

  return (
    source && (
      <div style={{ position: "relative" }}>
        <VideoPlayer
          key={`${source}${fps}`} // force remount when videoSource is changed or fps is changed
          url={source}
          controls={controls}
          isPlaying={playing}
          volume={volume}
          loop={false}
          width={MAX_WIDTH}
          height={MAX_HEIGHT}
          timeStart={timeStart}
          onPlay={onPlay}
          onPause={onPause}
          onVolume={(value) => setVolume(value)}
          onProgress={onProgress}
          onDuration={onDuration}
          onVideoPlayingComplete={(props) => onPause() & onComplete()}
          fps={fps}
        />
        <div className="bar" style={{ background: createGradient() }}></div>
      </div>
    )
  );
}
