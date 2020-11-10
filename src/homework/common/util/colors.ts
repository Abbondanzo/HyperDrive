export const hexToRgb = (hex: string) => {
  const parseRgb = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  const rgb = {
    red: parseInt(parseRgb[1], 16),
    green: parseInt(parseRgb[2], 16),
    blue: parseInt(parseRgb[3], 16),
  };
  rgb.red /= 255;
  rgb.green /= 255;
  rgb.blue /= 255;
  return rgb;
};

const colorToHex = (color: number): string => {
  const hex = (color * 255).toString(16);
  return hex.length === 1 ? `0${hex}` : hex;
};

export const rgbToHex = (color: Canvas2D.Color) => {
  console.assert(color.red <= 1, "Red is greater than 1");
  const rh = colorToHex(color.red);
  console.assert(color.green <= 1, "Green is greater than 1");
  const gh = colorToHex(color.green);
  console.assert(color.blue <= 1, "Blue is greater than 1");
  const bh = colorToHex(color.blue);
  return `#${rh}${gh}${bh}`;
};
