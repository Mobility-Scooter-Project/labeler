export const keypointsIndex = [0, 5, 6, 7, 8, 9, 10, 11, 12];

export const skeletonPair = [
  [0, 5],
  [0, 6],
  [5, 6],
  [5, 7],
  [6, 8],
  [7, 9],
  [8, 10],
  [5, 11],
  [6, 12],
  [11, 12],
];

export const keypointsText = {
  0: "nose",
  1: "left eye",
  2: "right eye",
  3: "left ear",
  4: "right ear",
  5: "left shoulder",
  6: "right shoulder",
  7: "left elbow",
  8: "right elbow",
  9: "left wrist",
  10: "right wrist",
  11: "left hip",
  12: "right hip",
};

export const colorKeypointByIndexInSkeletonPair = (indexInSkeletonPair) => {
  switch (indexInSkeletonPair) {
    case 0:
    case 1:
      return "#4fff00";
    case 2:
    case 3:
    case 4:
    case 5:
    case 6:
      return "#3080f9";
    case 7:
    case 8:
    case 9:
      return "#f73efd";
    default:
      return null;
  }
};

// export const keypointsText = {
//   nose: 0,
//   "left eye": 1,
//   "right eye": 2,
//   "left ear": 3,
//   "right ear": 4,
//   "left shoulder": 5,
//   "right shoulder": 6,
//   "left elbow": 7,
//   "right elbow": 8,
//   "left wrist": 9,
//   "right wrist": 10,
//   "left hip": 11,
//   "right hip": 12,
// };
