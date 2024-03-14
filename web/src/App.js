import React, { useState } from "react";
import VideoPlayer from "react-video-player-extended";

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [timeStart] = useState(5);
  const [fps] = useState(30);
  const [videoSource, setVideoSource] = useState("");
  const controls = ["Play", "Time", "Progress", "Volume", "NextFrame"];
  // React.useEffect(()=> {
  //   const button = document.querySelector('.next-frame');
  //   const i_id = setInterval(()=> {
  //     button.click()
  //   }, 333)
  //   return () => clearInterval(i_id)
  // }, [])

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
