uniform float frequencies[BIN_SIZE];

varying float sV;
varying vec2 vUv;

void main() {
  // We only care about the first 18k hz, in a full 24k
  float fft = float(BIN_SIZE) * 0.75;
  // Grab a frequency value and set the range 0.0 to 1.0
  sV = frequencies[int(uv.x * fft)] / 255.;
  // Pass UV for pct calculations
  vUv = uv;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
