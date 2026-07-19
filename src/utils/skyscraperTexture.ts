import { CanvasTexture, RepeatWrapping, Texture } from "three";

interface SkyscraperPalette {
  litColor: string;
  dimColor: string;
  windowDensity: number;
}

const CANVAS_SIZE = 256;
const GRID_COLUMNS = 12;
const GRID_ROWS = 12;

export const SKYSCRAPER_PALETTES: SkyscraperPalette[] = [
  { litColor: "#a05cff", dimColor: "#241934", windowDensity: 0.35 },
  { litColor: "#e6b800", dimColor: "#3a2d10", windowDensity: 0.3 },
  { litColor: "#00b8d4", dimColor: "#0e262b", windowDensity: 0.32 },
  { litColor: "#e0299e", dimColor: "#2e0c26", windowDensity: 0.28 },
  { litColor: "#2ecc0e", dimColor: "#15290d", windowDensity: 0.3 },
];

export const createSkyscraperTexture = (
  palette: SkyscraperPalette,
): Texture => {
  const canvas = document.createElement("canvas");
  canvas.width = CANVAS_SIZE;
  canvas.height = CANVAS_SIZE;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

  const cellWidth = CANVAS_SIZE / GRID_COLUMNS;
  const cellHeight = CANVAS_SIZE / GRID_ROWS;
  const padding = cellWidth * 0.2;

  for (let row = 0; row < GRID_ROWS; row++) {
    for (let col = 0; col < GRID_COLUMNS; col++) {
      const lit = Math.random() < palette.windowDensity;
      ctx.fillStyle = lit ? palette.litColor : palette.dimColor;
      ctx.fillRect(
        col * cellWidth + padding,
        row * cellHeight + padding,
        cellWidth - padding * 2,
        cellHeight - padding * 2,
      );
    }
  }

  const texture = new CanvasTexture(canvas);
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.anisotropy = 16;
  return texture;
};
