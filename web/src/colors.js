
const hexColors = [
  '#666666',
  '#D2D2D2', // White Smoke (darker)
  '#C7E6FF', // Azure (darker)
  '#C8A676', // Wheat (darker)
  '#CDB9A3', // Antique White (darker)
  '#FFB4A9', // Misty Rose (darker)
  '#FFECE7', // Snow (darker)
  '#9ED2FF', // Alice Blue (darker)
  '#D2D2AC', // Beige (darker)
  '#C7FFC7', // Honeydew (darker)
  '#D6D6FF', // Ghost White (darker)
  '#D4CDBD', // Linen (darker)
  '#D4D4A3', // Light Goldenrod Yellow (darker)
  '#F0E0CB', // Old Lace (darker)
  '#FFDFC7', // Cornsilk (darker)
  '#FFF2C6', // Light Yellow (darker)
  '#FFFFF0', // Ivory (same as original)
  '#BFAE4D', // Khaki (darker)
  '#FFE58C', // Lemon Chiffon (darker)
  '#FFCEA3', // Papaya Whip (darker)
  '#D2D2AC', // Beige (darker)
  '#FFC39E', // Bisque (darker)
]
const convertHexToRGB = (hex) => {
  hex = hex.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgb(${r}, ${g}, ${b})`;
};

export const colors = hexColors.map(convertHexToRGB);
