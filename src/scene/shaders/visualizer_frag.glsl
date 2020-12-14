varying float sV;
varying vec2 vUv;

vec3 yellow = vec3(0.988, 0.804, 0.020);
vec3 purple = vec3(1.000, 0.000, 0.988);

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  vec3 col = vec3(0.0);
  vec2 pct = vUv * 2.0;

  float nBands = float(N_BANDS);
  float idx = floor(vUv.x * nBands);
  float band = idx / nBands;
  band = band * band;

  float f = fract(vUv.x * nBands);
  
  // More purple as sV approaches 0
  vec3 gradient = mix(yellow, purple, sV);

  col += vec3(1.0 - step(0.0, pct.y - sV * 1.5));
  col *= gradient;
  
  // Simulate spacing
  col *= step(0.05, f);
  col *= step(f, 0.95);

  col = clamp(col, 0.0, 1.0);

  if (length(col) <= 0.05) {
    fragColor = vec4(0.0);
  } else {
	  fragColor = vec4(col, 1.0);
  }
 }


void main() {
  mainImage(gl_FragColor, gl_FragCoord.xy);
}
