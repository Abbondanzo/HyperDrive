uniform sampler2D tDiffuse;
uniform float time;
uniform float amount;
uniform float size;

varying vec2 vUv;

float rand(vec2 co) {
  return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main() {
  vec2 p = vUv;
  vec4 color = texture2D(tDiffuse, p);
  float xs = floor(gl_FragCoord.x / size);
  float ys = floor(gl_FragCoord.y / size);
  vec4 snow = vec4(rand(vec2(xs * time,ys * time))*amount);
  gl_FragColor = color + snow;
}
