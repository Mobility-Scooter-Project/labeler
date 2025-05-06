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
  
  // sway
  swayPoints,
  setSwayPoints,
  currentSwayLabel,
  onMarkSwayPoint,
  isRemoveSwayPoint = false,
  onRemoveSwayPoint,
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
    
    // Handle keypoints
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
    }

    // Handle sway points
    if (isRemoveSwayPoint) {
      let deletedPoint = null;
      const newPoints = swayPoints.filter((point) => {
        const { x: x_circle, y: y_circle } = point;
        if (isInsideCircle(x_circle, y_circle, x, y)) {
          deletedPoint = point;
          return false;
        }
        return true;
      });
      if (deletedPoint) {
        onRemoveSwayPoint(deletedPoint.label);
      }
      setSwayPoints(newPoints);
    } else {
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
    
    // Render keypoint skeleton
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

    // Render sway skeleton
    swaySkeletonPair.forEach((pair, index) => {
      const line = swayPoints.filter(
        (point) => point.label === pair[0] || point.label === pair[1]
      );
      if (line.length === 2) {
        lineArray.push({
          points: [line[0].x, line[0].y, line[1].x, line[1].y],
          color: colorSwayPointByIndexInSkeletonPair(index),
          dash: [5, 5],
        });
      }
    });

    return lineArray.map((linePoints, i) => (
      <Line
        key={`line-${i}`}
        points={linePoints.points}
        strokeWidth={2}
        stroke={linePoints.color}
        lineCap="round"
        lineJoin="round"
        dash={linePoints.dash || []}
      />
    ));
  };

  const getLabelText = (label) => {
    return keypointsText[label] || swayPointsText[label] || "Unknown";
  };

  const getLabelColor = (label) => {
    return swayPointsText[label] ? "green" : "red"; // green for sway points, red for keypoints
  };

  return (
    <Stage width={MAX_WIDTH} height={MAX_HEIGHT} onMouseDown={handleMouseDown}>
      <Layer>
        {renderSkeleton()}
        
        {/* Render keypoints */}
        {points.map((e, i) => (
          <Group key={`keypoint-${i}`}>
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
              fontSize={10}
              fontStyle="bold"
            />
          </Group>
        ))}
        
        {/* Render sway points */}
        {swayPoints.map((e, i) => (
          <Group key={`swaypoint-${i}`}>
            <Rect
              x={e.x - 14}
              y={e.y - 15}
              width={labelKeypointWidth(swayPointsText[e.label])}
              height={10}
              fill={"white"}
            />
            <Circle radius={CIRCLE_RAD} stroke="black" x={e.x} y={e.y} />
            <Text
              x={e.x - 10}
              y={e.y - 14}
              text={getLabelText(e.label)}
              fill={getLabelColor(e.label)}
              fontSize={10}
              fontStyle="bold"
            />
          </Group>
        ))}
      </Layer>
    </Stage>
  );
};
