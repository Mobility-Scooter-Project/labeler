import React, { useState } from "react";
import { Stage, Layer, Line, Circle, Text } from "react-konva";
import _flatten from "lodash/flatten";
import { MAX_HEIGHT, MAX_WIDTH } from "../VideoController/VideoController";
import {
  colorKeypointByIndexInSkeletonPair,
  keypointsText,
  skeletonPair,
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
    return lineArray.map((linePoints) => (
      <Line
        points={linePoints.points}
        strokeWidth={2}
        stroke={linePoints.color}
        lineCap="round"
        lineJoin="round"
      />
    ));
  };

  return (
    <Stage
      width={MAX_WIDTH}
      height={MAX_HEIGHT}
      onMouseDown={handleMouseDown}
    >
      <Layer>
        {renderSkeleton()}
        {points.map((e) => (
          <>
            <Circle radius={CIRCLE_RAD} stroke="#4eff00" x={e.x} y={e.y} />
            <Text
              x={e.x - 10}
              y={e.y - 14}
              text={keypointsText[e.label]}
              fill="#4eff00"
              fontSize={10}
            />
          </>
        ))}
      </Layer>
    </Stage>
  );
};
