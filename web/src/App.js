import React, { useRef, useEffect, useMemo, useState } from "react";
import { VideoController } from "./components/VideoController";
import { FaRegEdit } from "react-icons/fa";
import LabelList from "./components/LabelList";
import { colors } from "./colors";

const colorLength = 400;

function getIndex(time, fps) {
  return Math.floor(time * fps);
}

function App() {
  const [playing, setPlaying] = useState(false);
  const [video, setVideo] = useState("");
  const [duration, setDuration] = useState(0);
  const [source, setSource] = useState("");
  const [labels, setLabels] = useState(["Unlabeled", "Label 1", "Label 2", "Label 3", "Label 4"]);
  const [editing, setEditing] = useState(false);
  const [fps, setFPS] = useState(30); // has no effect on video playback, but rather the next-frame button
  const [speed, setSpeed] = useState(1);
  const [keyPressed, setKeyPressed] = useState('');
  const [colorList, setColorList] = useState(Array(colorLength).fill(colors[0]))
  const [activeLabel, setActiveLabel] = useState(0)
  const [message, setMessage] = useState('')
  const defaultLabel = useRef(0);
  const keyRef = useRef(0);
  const labelList = useRef(Array(Math.ceil(fps * duration)).fill(0))
  useEffect(() => {
    labelList.current = (Array(Math.ceil(fps * duration)).fill(0))
  }, [fps, duration])
  const time = useRef(0);


  const handleKeyDown = (event) => {
    if (event.repeat) return; // Ignore keydown events when a key is being held down
    if (keyPressed !== '') return;
    const s = String(event.key);
    if (!'0123456789'.includes(s)) return
    const d = parseInt(s, 10)
    if (d >= labels.length) {
      return setMessage(`Invalid label number pressed: <${d}>`);
    }
    else {
      setMessage('')
    }
    setKeyPressed(event.code);
    keyRef.current = d;
    setSpeed(0.5) // slowdown for temp labeling
  };
  const handleKeyUp = (event) => {
    if (event.code === 'Space' && keyPressed === '') {
      return playing ? handlePause() : handlePlay();
    }
    if (event.code !== keyPressed) return;
    setKeyPressed('');
    keyRef.current = 0;
    setSpeed(1)
  };

  const handleFileChange = (event) => {
    if (event.target.files.length === 0) return;
    const file = event.target.files[0];
    const objectURL = URL.createObjectURL(file);
    setVideo(file.name);
    setSource(objectURL);
  };

  const handleProgress = (e) => {
    const start = getIndex(time.current, fps);
    time.current = e.target.currentTime;
    const end = getIndex(time.current, fps);
    const newLabel = keyRef.current === 0 ? defaultLabel.current : keyRef.current;
    for (let i = start; i < end; i++) {
      labelList.current[i] = newLabel;
    }
    setColorList(
      (prev) => {
        const next = [...prev]
        const colorStart = Math.floor(start * colorLength / (labelList.current.length))
        const colorEnd = Math.floor(end * colorLength / (labelList.current.length))
        for (let i = colorStart; i < colorEnd; i++) {
          next[i] = colors[newLabel];
        }
        return next;
      }
    )
  };

  const handleChangeLabel = (index, event) => {
    const updatedLabels = [...labels];
    updatedLabels[index] = event.target.value;
    setLabels(updatedLabels);
  };

  const handleAddLabel = () => {
    if (labels.length === 9) {
      return setMessage('Maximum of 9 labels allowed');
    }
    setLabels((prev) => [...prev, '']);
  };

  const handleRemoveLabel = (index) => {
    setLabels((prev) => prev.filter((_, i) => i !== index))
  };

  const handleClickLabel = (index) => {
    setActiveLabel(index);
    defaultLabel.current = index;
  }

  const handlePlay = () => {
    if (!editing && keyPressed === '') {
      setPlaying(true);
    }
  }

  const handlePause = () => {
    setPlaying(false);
  }

  const handleSwitch = () => setEditing(e => {
    setMessage('');
    if (!e) {
      handlePause();
    }
    return !e;
  })

  const handleSave = () => {
    function getCSVData(data) {
      return data.map((e, i) => [i / fps, e === 0 ? "Unlabeled" : labels[e]]);
    }
    function downloadCSV(data, filename) {
      function convertToCSV(data) {
        const rows = data.map(row => row.join(','));
        return rows.join('\n');
      }
      const csv = convertToCSV(data);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

      if (navigator.msSaveBlob) { // For Internet Explorer
        navigator.msSaveBlob(blob, filename);
      } else {
        const link = document.createElement('a');
        if (link.download !== undefined) {
          const url = URL.createObjectURL(blob);
          link.setAttribute('href', url);
          link.setAttribute('download', filename);
          link.style.visibility = 'hidden';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }
      }
    }
    downloadCSV(getCSVData(labelList.current), `${video}.csv`);
  }

  React.useEffect(() => {
    if (editing) return;
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [playing, editing, keyPressed, labels]);

  return (
    <div className="container">
      <div className="left-container">
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <h3>Labels</h3>
          <div className="edit-labels" onClick={handleSwitch}>
            <FaRegEdit size={20} />
          </div>
        </div>
        <div className="left-inner-container">
          <LabelList
            selected={activeLabel}
            active={keyPressed === '' ? activeLabel : keyRef.current}
            editing={editing}
            labels={labels}
            onChangeLabel={handleChangeLabel}
            onAddLabel={handleAddLabel}
            onRemoveLabel={handleRemoveLabel}
            onClickLabel={handleClickLabel}
          />
        </div>
        {keyPressed === '' ?
          <div className="hint">
            Click on any label to set as default<br />
            Press number key on the keyboard to temporarily set label
          </div>
          :
          <h1 style={{ marginLeft: '20px' }}>{keyPressed}</h1>
        }
      </div>
      <div className="mid-container">
        {message !== '' && <div className="message">{message}</div>}
        <VideoController
          playing={playing}
          onPlay={handlePlay}
          onPause={handlePause}
          colors={colorList}
          source={source}
          fps={fps}
          onProgress={handleProgress}
          barColors={colorList}
          onDuration={d => setDuration(d)}
          speed={speed}
        />
        <div className="mid-input-container">
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
          <h4>{video}</h4>
          {source !== '' && <button className="save-btn" onClick={handleSave}>Save labels</button>}
        </div>
      </div>
      <div className="right-container">
        <h3>Settings</h3>
      </div>
    </div>
  );
}

export default App;
