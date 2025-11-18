import React, { useState, useRef, useEffect } from "react";
import VideoPlayer from "react-video-player-extended";
import Canvas from "../Canvas";
import styles from "./VideoController.module.css";

export const MAX_WIDTH = 800;
export const MAX_HEIGHT = 550;

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
  // Navigation props
  onFrameBackward,
  onFrameForward,
  onSkipBackward5s,
  onSkipForward5s,
  onSkipBackward1s,
  onSkipForward1s,
  // Keypoint props
  points,
  setPoints,
  selectedKeypoint,
  onMarkKeypoint,
  onErrorMarkedKeypoint,
  isRemoveKeypoint,
  onRemoveKeypoint,
}) {
  const [volume, setVolume] = useState(0.7);
  const [timeStart] = useState(0);
  const controls = ["Play", "Time", "Progress", "Volume", "NextFrame"];
  const videoRef = useRef(null);
  
  useEffect(() => {
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

    colors.forEach((color) => {
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
          key={source} // force remount when videoSource is changed
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
        {!playing && (
          <div
            className={styles.canvasContainer}
            style={{ width: MAX_WIDTH, height: MAX_HEIGHT }}
          >
            <Canvas
              points={points}
              setPoints={setPoints}
              currentLabel={selectedKeypoint}
              onMarkKeypoint={onMarkKeypoint}
              onErrorMarkedKeypoint={onErrorMarkedKeypoint}
              isRemove={isRemoveKeypoint}
              onRemoveKeypoint={onRemoveKeypoint}
            />
          </div>
        )}
        <div className="bar" style={{ background: createGradient() }}></div>
                {/* Navigation buttons */}
                <div className={styles.navigationButtons}>
          <button 
            className={styles.navButton} 
            onClick={onSkipBackward5s}
            disabled={!source}
            title="Skip backward 5 seconds"
          >
            ⏪ 5s
          </button>
          <button 
            className={styles.navButton} 
            onClick={onSkipBackward1s}
            disabled={!source}
            title="Skip backward 1 second"
          >
            ⏪ 1s
          </button>
          <button 
            className={styles.navButton} 
            onClick={onFrameBackward}
            disabled={!source}
            title="Previous frame"
          >
            ⏮ 1
          </button>
          <button 
            className={styles.navButton} 
            onClick={onFrameForward}
            disabled={!source}
            title="Next frame"
          >
            ⏭ 1
          </button>
          <button 
            className={styles.navButton} 
            onClick={onSkipForward1s}
            disabled={!source}
            title="Skip forward 1 second"
          >
            1s ⏩
          </button>
          <button 
            className={styles.navButton} 
            onClick={onSkipForward5s}
            disabled={!source}
            title="Skip forward 5 seconds"
          >
            5s ⏩
          </button>
        </div>
      </div>
    )
  );
}
