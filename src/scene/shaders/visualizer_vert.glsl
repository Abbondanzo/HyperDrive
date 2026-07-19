uniform sampler2D frequencies;

const int lod = 0;

varying float sV;
varying vec2 vUv;

void main() {
  // We only care about the first 18k hz, in a full 24k
  float fft = float(BIN_SIZE) * 0.75;
  float freqBase = 25.0;
  float mappedX = (pow(freqBase, uv.x) - 1.0) / (freqBase - 1.0);
  int xIdx = int(mappedX * fft);
  // Grab a frequency value and set the range 0.0 to 1.0
  sV = texelFetch(frequencies, ivec2(xIdx, 0), lod).x / 255.;
  // Pass UV for pct calculations
  vUv = uv;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
