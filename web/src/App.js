import React, { useState } from "react";
import VideoPlayer from "react-video-player-extended";

function clamp(a, b, c, d, e) {
  const v = (a - b) / (c - b) * (e - d) + d
  return Math.max(d, Math.min(e, v))
}

const getColor = (value) => {
  const convert = (v) => clamp(Math.log(v),-8, -1, 0, 1)
  if (value < 1)
    return `rgb(230, ${convert(1-value)*230}, ${convert(1-value)*230})`
  else if (value < 2)
    return `rgb(230, 230, ${convert(2-value)*230})`
  else
    return `rgb(${convert(3-value)*230}, 230, ${convert(3-value)*230})`
}; 

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [timeStart] = useState(5);
  const [fps] = useState(30);
  const [videoSource, setVideoSource] = useState("");
  const controls = ["Play", "Time", "Progress", "Volume", "NextFrame"];
  const [values, setValues] = useState([0.97, 0.97, 3, 1, 2, 0.97, 1, 0.97, 2, 0.97, 3, 3]);
  const handleKeyDown = (event) => {
    if (event.repeat) return; // Ignore keydown events when a key is being held down
    console.log('Key pressed:', event.key);
  };
  const handleKeyUp = (event) => {
    console.log('Key released:', event.key);
  };



  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleVolume = (value) => {
    setVolume(value);
  };

  const handleProgress = (e) => {
    console.log("Current time: ", e.target.currentTime);
  };

  const handleDuration = (duration) => {
    console.log("Duration: ", duration);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const objectURL = URL.createObjectURL(file);
    console.log(objectURL);
    setVideoSource(objectURL);
  };

  React.useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // React.useEffect(()=> {
  //   const button = document.querySelector('.next-frame');
  //   const i_id = setInterval(()=> {
  //     button.click()
  //   }, 333)
  //   return () => clearInterval(i_id)
  // }, [])

  React.useEffect(() => {
    // Add progress bar when the component mounts
    const progressWrap = document.querySelector('.progress-wrap');

    const createGradient = () => {
      let total = 0;
      let gradient = '';

      values.forEach((value, index) => {
        const startPos = total;
        const endPos = startPos + 100/values.length;
        const color = getColor(value);
          gradient += `, ${color} ${startPos}%, ${color} ${endPos}%`;
          total += 100/values.length;
      });

      return `linear-gradient(to right${gradient})`;
    };
    if (progressWrap) {
      const bar = document.createElement('div');
      bar.className = 'bar';
      bar.style.background = createGradient();
      progressWrap.appendChild(bar);
    }

    // Remove progress bar when the component unmounts
    return () => {
      progressWrap?.querySelector('.bar')?.remove();
    };
  }, [values]);

  return (
    <>
      <div className="container">
        <VideoPlayer
          key={videoSource} // force remount when videoSource is changed
          url={videoSource}
          controls={controls}
          isPlaying={isPlaying}
          volume={volume}
          loop={false}
          height={"auto"}
          width={"800px"}
          timeStart={timeStart}
          onPlay={handlePlay}
          onPause={handlePause}
          onVolume={handleVolume}
          onProgress={handleProgress}
          onDuration={handleDuration}
          onVideoPlayingComplete={(props) => setIsPlaying(false)}
          fps={fps}
        />
        <label htmlFor="file-upload" className="file-upload-button">
          Choose Video
        </label>
        <input
          id="file-upload"
          type="file"
          className="file-input"
          onChange={handleFileChange}
          accept="video/*"
        />
      </div>
    </>
  );
}

export default App;
