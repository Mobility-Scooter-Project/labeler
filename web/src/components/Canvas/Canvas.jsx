import React from "react";
import {
  Stage,
  Layer,
  Line,
  Circle,
  Text,
  Group,
  Rect,
  Tag,
} from "react-konva";
import { MAX_HEIGHT, MAX_WIDTH } from "../VideoController/VideoController";
import {
  colorKeypointByIndexInSkeletonPair,
  keypointsText,
  labelKeypointWidth,
  skeletonPair,
  swayPointsText,
  swaySkeletonPair,
  colorSwayPointByIndexInSkeletonPair,
} from "../../utils/constant";

const CIRCLE_RAD = 4;
const ERROR_TEXT_THRESHOLD = 5;
export const Canvas = ({
  points,
  setPoints,
  currentLabel = null,
  isRemove = false,
  onMarkKeypoint,
  onRemoveKeypoint,
  onErrorMarkedKeypoint,
  
  //sway
  swayPoints,
  setSwayPoints,
  currentSwayLabel,
  onMarkSwayPoint,
}) => {
  const isInsideCircle = (
    circle_x,
    circle_y,
    x,
    y,
    rad = CIRCLE_RAD + ERROR_TEXT_THRESHOLD
  ) => {
    if (
      (x - circle_x) * (x - circle_x) + (y - circle_y) * (y - circle_y) <=
      rad * rad
    )
      return true;
    else return false;
  };
  const handleMouseDown = (event) => {
    const { x, y } = event.target?.getStage()?.getPointerPosition();
    if (isRemove) {
      let deletedPoint = null;
      const newPoints = points.filter((point) => {
        const { x: x_circle, y: y_circle } = point;
        if (isInsideCircle(x_circle, y_circle, x, y)) {
          deletedPoint = point;
          return false;
        }
        return true;
      });
      if (deletedPoint) {
        onRemoveKeypoint(deletedPoint.label);
      }
      setPoints(newPoints);
    } else {
      if (currentLabel != null) {
        if (event.evt.button !== 2 && event.target.getStage()) {
          setPoints((prevArray) => [
            ...prevArray,
            { x: x, y: y, label: currentLabel },
          ]);
          onMarkKeypoint(currentLabel);
        }
      } else {
        onErrorMarkedKeypoint();
      }

      if (currentSwayLabel != null) {
        if (event.evt.button !== 2 && event.target.getStage()) {
          setSwayPoints((prevArray) => [
            ...prevArray,
            { x: x, y: y, label: currentSwayLabel },
          ]);
          onMarkSwayPoint(currentSwayLabel);
        }
      } 
    }
  };

  const renderSkeleton = () => {
    const lineArray = [];
    skeletonPair.forEach((pair, index) => {
      const line = points.filter(
        (point) => point.label === pair[0] || point.label === pair[1]
      );
      if (line.length === 2) {
        lineArray.push({
          points: [line[0].x, line[0].y, line[1].x, line[1].y],
          color: colorKeypointByIndexInSkeletonPair(index),
        });
      }
    });

    //----------- SWAY -------------
    swaySkeletonPair.forEach((pair, index) => {
      const line = swayPoints.filter(
        (swayPoints) => swayPoints.label === pair[0] || swayPoints.label === pair[1]
      );
      if (line.length === 2) {
        lineArray.push({
          swayPoints: [line[0].x, line[0].y, line[1].x, line[1].y],
          color: colorSwayPointByIndexInSkeletonPair(index),
          dash: [5, 5], // Make sway point connections dashed
        });
      }
    });
    //----------- SWAY -------------

    return lineArray.map((linePoints) => (
      <Line
        points={linePoints.points}
        strokeWidth={2}
        stroke={linePoints.color}
        lineCap="round"
        lineJoin="round"
        dash={linePoints.dash || []}
      />
    ));
  };

  //----------- SWAY -------------
  const getLabelText = (label) => {
    return keypointsText[label] || swayPointsText[label] || "Unknown";
  };

  const getLabelColor = (label) => {
    return swayPointsText[label] ? "#FFA500" : "red"; // Orange for sway points, red for keypoints
  };
  //----------- SWAY -------------


  return (
    <Stage width={MAX_WIDTH} height={MAX_HEIGHT} onMouseDown={handleMouseDown}>
      <Layer>
        {renderSkeleton()}
        {points.map((e) => (
          <>
            <Rect
              x={e.x - 14}
              y={e.y - 15}
              width={labelKeypointWidth(keypointsText[e.label])}
              height={10}
              fill={"white"}
            />
            <Circle radius={CIRCLE_RAD} stroke="#4eff00" x={e.x} y={e.y} />
            <Text
              x={e.x - 10}
              y={e.y - 14}
              text={getLabelText(e.label)}
              fill={getLabelColor(e.label)}
              // text={keypointsText[e.label]}
              // fill="red"
              fontSize={10}
              fontStyle="bold"
            />
          </>
        ))}
      </Layer>
    </Stage>
  );
};
