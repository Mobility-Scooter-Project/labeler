import React, { useState } from "react";
import { VideoController } from "./components/VideoController";
import LabelList from "./components/LabelList";


function App() {
  const [video, setVideo] = useState("");
  const [source, setSource] = useState("");
  const [labels, setLabels] = useState(["ABC", "DEF"]);
  const [values, setValues] = useState([0.97, 0.97, 3, 1, 2, 0.97, 1, 0.97, 2, 0.97, 3, 3]);
  const [fps, setFPS] = useState(2); // has no effect on video playback, but rather the next-frame button
  const [slowdown, setSlowdown] = useState(4);
  const handleKeyDown = (event) => {
    if (event.repeat) return; // Ignore keydown events when a key is being held down
    console.log('Key pressed:', event.key);
  };
  const handleKeyUp = (event) => {
    console.log('Key released:', event.key);
  };

  const handleFileChange = (event) => {
    if (event.target.files.length===0) return;
    const file = event.target.files[0];
    const objectURL = URL.createObjectURL(file);
    setVideo(file.name);
    setSource(objectURL);
  };

  const handleProgress = (e) => {
    console.log("Current time: ", e.target.currentTime);
  };

  const handleChangeLabel = (index, event) => {
    const updatedLabels = [...labels];
    updatedLabels[index] = event.target.value;
    setLabels(updatedLabels);
  };

  const handleAddLabel = () => {
    setLabels((prevLabels) => [...prevLabels, '']);
  };

  const handleRemoveLabel = (index) => {
    setLabels((prevLabels) => prevLabels.filter((_, i) => i !== index));
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

  return (
    <div className="container">
      <div className="left-container">
        <h3>Labels</h3>
        <div className="left-inner-container">
          <LabelList
            labels={labels}
            onChangeLabel={handleChangeLabel}
            onAddLabel={handleAddLabel}
            onRemoveLabel={handleRemoveLabel}
          />
        </div>
      </div>
      <div className="mid-container">
        <VideoController
          values={values}
          source={source}
          fps={fps}
          onProgress={handleProgress}
        />
        <div className="mid-input-container">
        <h4>{video}</h4>
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
      </div>
      <div className="right-container">
        <h3>Settings</h3>
      </div>
    </div>
  );
}

export default App;
