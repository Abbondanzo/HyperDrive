precision mediump float;

varying vec2 vUv;

uniform sampler2D tDiffuse;
uniform float scanlineCount;
uniform float opacity;

void main() {
  vec2 p = vUv;

  vec4 texel = texture2D(tDiffuse, p);
  vec3 scanlines = vec2(sin(p.y * scanlineCount), cos(p.y * scanlineCount)).xyx;

  gl_FragColor = vec4(texel.rgb * (1. + scanlines * opacity), 1.0);
}
