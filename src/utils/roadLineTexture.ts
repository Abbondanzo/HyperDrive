import {
  CanvasTexture,
  ClampToEdgeWrapping,
  RepeatWrapping,
  Texture,
} from "three";

const CANVAS_SIZE = 256;
const EDGE_LINE_HEIGHT = 4;
const EDGE_GLOW_HEIGHT = 48;

// A narrow, length-uniform strip: bright at the road edges, feathering inward
// toward transparent. Since it never varies along its length, it can be
// stretched across the whole road with no repeat/scroll, so there's nothing
// to desync from the dashed center line's own animation.
export const createRoadEdgeGlowTexture = (color: string): Texture => {
  const canvas = document.createElement("canvas");
  canvas.width = 8;
  canvas.height = CANVAS_SIZE;
  const ctx = canvas.getContext("2d");

  ctx.clearRect(0, 0, canvas.width, CANVAS_SIZE);

  const topGlow = ctx.createLinearGradient(0, 0, 0, EDGE_GLOW_HEIGHT);
  topGlow.addColorStop(0, color);
  topGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = topGlow;
  ctx.fillRect(0, 0, canvas.width, EDGE_GLOW_HEIGHT);

  const bottomGlow = ctx.createLinearGradient(
    0,
    CANVAS_SIZE - EDGE_GLOW_HEIGHT,
    0,
    CANVAS_SIZE,
  );
  bottomGlow.addColorStop(0, "rgba(0, 0, 0, 0)");
  bottomGlow.addColorStop(1, color);
  ctx.fillStyle = bottomGlow;
  ctx.fillRect(
    0,
    CANVAS_SIZE - EDGE_GLOW_HEIGHT,
    canvas.width,
    EDGE_GLOW_HEIGHT,
  );

  ctx.fillStyle = color;
  ctx.fillRect(0, 0, canvas.width, EDGE_LINE_HEIGHT);
  ctx.fillRect(
    0,
    CANVAS_SIZE - EDGE_LINE_HEIGHT,
    canvas.width,
    EDGE_LINE_HEIGHT,
  );

  const texture = new CanvasTexture(canvas);
  texture.wrapS = RepeatWrapping;
  texture.wrapT = ClampToEdgeWrapping;
  texture.anisotropy = 16;
  return texture;
};
