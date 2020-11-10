import { truncate } from "./numbers";

export const degreesToRadians = (degrees: number) => {
  return ((degrees % 360) * Math.PI) / 180;
};

export const radiansToDegrees = (radians: number) => {
  return truncate((radians * 180) / Math.PI) % 360;
};
