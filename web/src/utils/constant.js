export const keypointsIndex = [0, 5, 6, 7, 8, 9, 10, 11, 12];


export const labelKeypointWidth = (text) => {
  const len = text.length;
  if (len < 5) {
    return 30;
  } else if (len < 9) {
    return 40;
  } else if (len < 11) {
    return 50;
  } else if (len < 12) {
    return 60;
  } else if (len < 14) {
    return 65;
  } else if (len < 16){
    return 75;
  } else{
    return 115;
  }
};

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

// ====================== SWAY POINTS ====================== //
// left sternum, left umbilicus, right sternum, right umbilicus
export const swayPointsIndex = [13, 14, 15, 16];  
export const swayPointsText = {
  13: "Left Sway - Sternum",
  14: "Left Sway - Umbilicus",
  15: "Right Sway - Sternum",
  16: "Right Sway - Umbilicus",
};

export const swaySkeletonPair = [
  [13, 14],  // left sternum → left umbilicus
  [15, 16],  // right sternum → right umbilicus
];

// maps colors to sway skeleton pairs
export const colorSwayPointByIndexInSkeletonPair = (pairIndex) => {
  if(pairIndex === 0){
    return "red";
  }
  return "green";
};
