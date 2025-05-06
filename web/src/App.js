import React, { useRef, useEffect, useState } from "react";
import VideoController from "./components/VideoController";
import { FaRegEdit } from "react-icons/fa";
import LabelList from "./components/LabelList";
import { colors } from "./colors";
import ScooterIcon from "./components/ScooterIcon";
import Selection from "./components/Selection";
import { VERSION } from "./version";
import KeypointList from "./components/KeypointLabel";
import { keypointsIndex } from "./utils/constant";
import { SwayPointLabel } from "./components/SwayPointLabel/SwayPointLabel";

const colorLength = 400;

function getIndex(time, fps) {
  return Math.floor(time * fps);
}

function App() {

  // const dataLabel = useSelector((state) => state.app?.labelData);
  // const dataKeypoint = useSelector((state) => state.app?.keypointsData);

  const [playing, setPlaying] = useState(false);
  const [video, setVideo] = useState("");

  const [duration, setDuration] = useState(0);
  const [source, setSource] = useState("");
  const [labels, setLabels] = useState([
    "Unlabeled",
    "Label 1",
    "Label 2",
    "Label 3",
    "Label 4",
  ]);
  const [editing, setEditing] = useState(false);
  const [fps, setFPS] = useState(30); // has no effect on video playback, but rather the next-frame button
  const [rotation, setRotation] = useState("0°");
  const [playbackSpeed, setPlaybackSpeed] = useState("1.0");
  const [focusSpeed, setFocusSpeed] = useState("0.5");
  const [speed, setSpeed] = useState(1);
  const [keyPressed, setKeyPressed] = useState("");
  const [colorList, setColorList] = useState(
    Array(colorLength).fill(colors[0])
  );
  const [activeLabel, setActiveLabel] = useState(0);
  const [message, setMessage] = useState("");
  const defaultLabel = useRef(0);
  const keyRef = useRef(-1);
  const fpsRef = useRef(30);

  // const dispatch = useDispatch();

  const labelList = useRef([]);
  useEffect(() => {
    if (labelList.current) return;
    labelList.current = Array(Math.floor(fpsRef.current * duration)).fill(0);
    setColorList(Array(colorLength).fill(colors[0]));
    console.log(
      "Setting labelList to " +
        Math.floor(fpsRef.current * duration) +
        " frames"
    );
  }, [duration]);
  const time = useRef(0);

  const handleKeyDown = (event) => {
    if (event.code === "Space" || event.keyCode === 32) {
      // Prevent the default space key action (scrolling or clicking)
      event.preventDefault();
    }
    if (event.repeat) return; // Ignore keydown events when a key is being held down
    if (keyPressed !== "") return;
    const s = String(event.key);
    if (!"0123456789".includes(s)) return;
    const d = parseInt(s, 10);
    if (d >= labels.length) {
      return setMessage(`Invalid label number pressed: <${d}>`);
    } else {
      setMessage("");
    }
    setKeyPressed(event.code);
    keyRef.current = d;
    setSpeed(parseFloat(focusSpeed)); // slowdown for temp labeling
  };

  const handleKeyUp = (event) => {
    if (event.code === "Space" && keyPressed === "") {
      return playing ? handlePause() : handlePlay();
    }
    if (event.code !== keyPressed) return;
    setKeyPressed("");
    keyRef.current = -1;
    setSpeed(parseFloat(playbackSpeed));
  };

  const handleFPSChange = (value) => {
    setFPS(value);
    const prevFPS = fpsRef.current;
    let prev = labelList.current[0];
    const compressed_labels = [[0, prev]];
    for (let i = 1; i < labelList.current.length; i++) {
      if (prev !== labelList.current[i]) {
        prev = labelList.current[i];
        compressed_labels.push([Math.floor((i * value) / prevFPS), prev]);
      }
    }
    const new_length = Math.floor((labelList.current.length * value) / prevFPS);
    compressed_labels.push([new_length, 0]);
    const newLabelList = Array(new_length).fill(0);
    for (let i = 0; i < compressed_labels.length - 1; i++) {
      const start = Math.floor(compressed_labels[i][0]);
      const end = Math.floor(compressed_labels[i + 1][0]);
      const label = compressed_labels[i][1];
      for (let j = start; j < end; j++) {
        newLabelList[j] = label;
      }
    }
    labelList.current = newLabelList;
    fpsRef.current = value;
    console.log(
      "Resizing labelList to " +
        Math.floor(fpsRef.current * duration) +
        " frames"
    );
  };

  const handleFileChange = async (event) => {
    if (event.target.files.length === 0) return;
    const file = event.target.files[0];
    const objectURL = URL.createObjectURL(file);
    setVideo(file.name);
    setSource(objectURL);
    labelList.current = null;

    
    // Reset keypoints data
    setKeypointData([]);
    // dispatch(resetKeypoint());
    time.current = 0;

    setPoints([]);
    setSelectedKeypoint(null);
    setMarkedKeypoints([]);
    setErrorChooseKeypoint(false);
    setIsRemoveKeypoint(false);

    //sway
    setSwayPoints([]);
    setSelectedSwayPoint(null);
    setMarkedSwayPoints([]);
    setIsRemoveSwayPoint(false);
  };

  const updateLabels = (start, end, label) => {
    for (let i = start; i < end; i++) {
      labelList.current[i] = label;
    }
    setColorList((prev) => {
      const next = [...prev];
      const colorStart = Math.floor(
        (start * colorLength) / labelList.current.length
      );
      const colorEnd = Math.floor(
        (end * colorLength) / labelList.current.length
      );
      for (let i = colorStart; i < colorEnd; i++) {
        next[i] = colors[label];
      }
      return next;
    });
  };

  const handleProgress = (e) => {
    const start = getIndex(time.current, fpsRef.current);
    time.current = e.target.currentTime;
    const end = getIndex(time.current, fpsRef.current);
    const newLabel =
      keyRef.current === -1 ? defaultLabel.current : keyRef.current;
    updateLabels(start, end, newLabel);
  };

  const handleChangeLabel = (index, event) => {
    const updatedLabels = [...labels];
    updatedLabels[index] = event.target.value;
    setLabels(updatedLabels);
  };

  const handleAddLabel = () => {
    if (labels.length === 10) {
      return setMessage("Maximum of 10 labels allowed");
    }
    setLabels((prev) => [...prev, ""]);
  };

  const handleRemoveLabel = (index) => {
    setMessage("");
    setLabels((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClickLabel = (index) => {
    setActiveLabel(index);
    defaultLabel.current = index;
  };

  const handlePlay = () => {
    if (editing) {
      setEditing(false);
    }
    if (keyPressed === "") {
      setPlaying(true);
    }
  };

  const handlePause = () => {
    setPlaying(false);
  };

  const handleSwitch = () =>
    setEditing((e) => {
      setMessage("");
      if (!e) {
        handlePause();
      }
      return !e;
    });
  const downloadCSV = (data, filename) => {
    function convertToCSV(data) {
      const rows = data.map((row) => row.join(","));
      return rows.join("\n");
    }
    const csv = convertToCSV(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

    if (navigator.msSaveBlob) {
      // For Internet Explorer
      navigator.msSaveBlob(blob, filename);
    } else {
      const link = document.createElement("a");
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", filename);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    }
  };
  const handleSaveLabel = () => {
    function getCSVData(data) {
      return data.map((e, i) => [i / fpsRef.current, labels[e]]);
    }

    const validate = () => {
      const expected = Array(colorLength).fill(colors[0]);
      for (let i = 0; i < labelList.current.length; i++) {
        expected[Math.floor((i * colorLength) / labelList.current.length)] =
          colors[labelList.current[i]];
      }
      for (let i = 1; i < colorLength - 1; i++) {
        if (
          expected[i] !== colorList[i - 1] &&
          expected[i] !== colorList[i + 1] &&
          expected[i] !== colorList[i]
        ) {
          const ERROR_MESSAGE =
            "Color and labels not match, please contact developer for help!";
          const color2label = colors.reduce(
            (obj, item, index) => ({ ...obj, [item]: index }),
            {}
          );
          console.log(labelList.current);
          downloadCSV(
            expected.map((_, i) => [
              color2label[expected[i]],
              color2label[colorList[i]],
            ])
          );
          alert(ERROR_MESSAGE);
          throw Error(ERROR_MESSAGE);
        }
      }
    };
    validate();
    downloadCSV(getCSVData(labelList.current), `${video}.csv`);
  };

  const handleComplete = () => {
    handlePause();
    const start = getIndex(time.current, fpsRef.current);
    const end = labelList.current.length;
    const newLabel =
      keyRef.current === -1 ? defaultLabel.current : keyRef.current;
    updateLabels(start, end, newLabel);
  };
  // Keypoint handling
  const [points, setPoints] = useState([]);
  const [selectedKeypoint, setSelectedKeypoint] = useState();
  const [markedKeypoints, setMarkedKeypoints] = useState([]);
  const [errorChooseKeypoint, setErrorChooseKeypoint] = useState(false);
  const [isRemoveKeypoint, setIsRemoveKeypoint] = useState(false);
  const [keypointData, setKeypointData] = useState([]);
  const handleSaveKeypoint = () => {
    const csvHeader = [
      "Frame",
      "x0",
      "y0",
      "x5",
      "y5",
      "x6",
      "y6",
      "x7",
      "y7",
      "x8",
      "y8",
      "x9",
      "y9",
      "x10",
      "y10",
      "x11",
      "y11",
      "x12",
      "y12",
    ];
    keypointData.sort((a, b) => a[0] - b[0]);

    downloadCSV([[csvHeader], ...keypointData], `${video}-keypoints.csv`);
  };

  useEffect(() => {
    if (editing) return;
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [playing, editing, keyPressed, labels, playbackSpeed, focusSpeed]);

  const handleCompleteMarkKeypoint = () => {
    points.sort((a, b) => a.label - b.label);
    const pointsCoordinate = [];
    for (const indexLabel of keypointsIndex) {
      const firstKeypoint = points.length ? points[0] : null;
      if (firstKeypoint?.label === indexLabel) {
        pointsCoordinate.push(firstKeypoint.x, firstKeypoint.y);
        points.shift();
      } else {
        pointsCoordinate.push(-1, -1);
      }
    }
    setKeypointData([
      ...keypointData,
      [getIndex(time.current, fps), ...pointsCoordinate],
    ]);
    setPoints([]);
    setSelectedKeypoint(undefined);
    setMarkedKeypoints([]);

    // Set local storage payload
    // dispatch(setKeypointSlice(keypointData));
  };
  const handleMarkedKeypoint = (key) => {
    setSelectedKeypoint(undefined);
    setMarkedKeypoints([...markedKeypoints, key]);
  };
  const handleRemoveKeypoint = (key) => {
    const newMarkedKeypoints = markedKeypoints.filter((k) => k !== key);
    setMarkedKeypoints(newMarkedKeypoints);
  };

  // Sway Point 
  const [swayPoints, setSwayPoints] = useState([]);
  const [selectedSwayPoint, setSelectedSwayPoint] = useState();
  const [markedSwayPoints, setMarkedSwayPoints] = useState([]);
  const [isRemoveSwayPoint, setIsRemoveSwayPoint] = useState(false);
  // TODO: NEED TO IMPLEMENT
  const handleCompleteMarkSwayPoint = () => {

  }; 

  const handleSaveSwayPoint = () => {

  };

  const handleMarkedSwayPoint = (key) => {
    setSelectedSwayPoint(undefined)
    setMarkedSwayPoints([...markedSwayPoints, key]);
  };

  const handleRemoveSwayPoint = (key) => {
    const newMarkedSwayPoints = markedSwayPoints.filter((k) => k !== key);
    setMarkedSwayPoints(newMarkedSwayPoints);
  };

  return (
    <div className="container">
      <div className="title-container">
        <div className="scooter-icon">
          <ScooterIcon />
        </div>
        <div className="title">LABELER</div>
      </div>
      <div className="version">v{VERSION}</div>
      <div className="left-container">
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <h3 style={{ userSelect: "none" }}>Labels</h3>
          <div className="edit-labels" onClick={handleSwitch}>
            <FaRegEdit size={20} />
          </div>
        </div>
        <div className="left-inner-container">
          <LabelList
            selected={activeLabel}
            active={
              keyPressed === "" || keyRef.current === -1
                ? activeLabel
                : keyRef.current
            }
            editing={editing}
            labels={labels}
            onChangeLabel={handleChangeLabel}
            onAddLabel={handleAddLabel}
            onRemoveLabel={handleRemoveLabel}
            onClickLabel={handleClickLabel}
          />
        </div>
        {keyPressed === "" ? (
          <div className="hint">
            Click on any label to set as default
            <br />
            Press number key on the keyboard to temporarily set label
          </div>
        ) : (
          <h1 style={{ marginLeft: "20px" }}>{keyPressed}</h1>
        )}

        {/* Label keypoints for drawing */}
        <div>
          <h3 style={{ userSelect: "none" }}>Keypoints</h3>
          {errorChooseKeypoint && (
            <div className="error-keypoints">
              Please choose a keypoint before marking on video!
            </div>
          )}
          <KeypointList
            onKeypoint={(k) => {
              setSelectedKeypoint(k);
              setErrorChooseKeypoint(false);
            }}
            selected={selectedKeypoint}
            marked={markedKeypoints}
            onComplete={handleCompleteMarkKeypoint}
            isRemoveKeypoint={isRemoveKeypoint}
            setIsRemoveKeypoint={setIsRemoveKeypoint}
          />
        </div>
      </div>
      <div className="mid-container">
        {message !== "" && <div className="message">{message}</div>}
        <VideoController
          playing={playing}
          onPlay={handlePlay}
          onPause={handlePause}
          colors={colorList}
          source={source}
          fps={30}
          onProgress={handleProgress}
          barColors={colorList}
          onDuration={(d) => setDuration(d)}
          onComplete={handleComplete}
          speed={speed}
          // Keypoint handler
          points={points}
          setPoints={setPoints}
          selectedKeypoint={selectedKeypoint}
          onMarkKeypoint={handleMarkedKeypoint}
          onErrorMarkedKeypoint={() => setErrorChooseKeypoint(true)}
          isRemoveKeypoint={isRemoveKeypoint}
          onRemoveKeypoint={handleRemoveKeypoint}

          //Swaypoint handler
          swayPoints={swayPoints}
          setSwayPoints={setSwayPoints}
          selectedSwayPoint={selectedSwayPoint}
          onMarkSwayPoint={handleMarkedSwayPoint}
          isRemoveSwayPoint={isRemoveSwayPoint}
          onRemoveSwayPoint={handleRemoveSwayPoint}

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
          {source !== "" && (
            <>
              <button className="save-btn" onClick={handleSaveLabel}>
                Save labels
              </button>
              <button className="save-btn" onClick={handleSaveKeypoint}>
                Save Keypoints
              </button>
              <button className="save-btn" onClick={handleSaveSwayPoint}>
                Save Sway Boundaries
              </button>
            </>
          )}
        </div>
      </div>

      <div className="right-container">
        <div className="selections-container">
          <h3 style={{ userSelect: "none" }}>Settings</h3>
          <Selection
            key={1}
            name="FPS"
            defaultValue={fps}
            values={[24, 30, 60]}
            onSelect={handleFPSChange}
          />
          <Selection
            key={2}
            name="Rotation"
            defaultValue={rotation}
            values={["0°", "90°", "180°", "270°"]}
            onSelect={setRotation}
          />
          <Selection
            key={3}
            name="Video Speed"
            defaultValue={playbackSpeed}
            values={["0.5", "1.0", "1.5", "2.0"]}
            onSelect={(s) => setPlaybackSpeed(s) & setSpeed(parseFloat(s))}
          />
          <Selection
            key={4}
            name="Focus Speed"
            defaultValue={focusSpeed}
            values={["0.5", "1.0", "1.5", "2.0"]}
            onSelect={setFocusSpeed}
          />
        </div>
        <div className="hint">Rotation is under construction...</div>
        <div className="hint">Don't refresh midway, no cache yet</div>
        
        {/* Sway Boundaries Labeling */}
        <div>
          <h3 style={{ userSelect: "none" }}>Sway Boundaries</h3>
          <SwayPointLabel 
            onSwayPoint={(k) => {
              setSelectedSwayPoint(k);
            }}
            selected={selectedSwayPoint}
            marked={markedSwayPoints}
            onComplete={handleCompleteMarkSwayPoint}
            isRemoveSwayPoint={isRemoveSwayPoint}
            setIsRemoveSwayPoint={setIsRemoveSwayPoint}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
