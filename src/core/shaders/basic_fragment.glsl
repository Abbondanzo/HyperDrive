precision mediump float;

varying vec3 v_normal;
varying vec3 v_position;

uniform vec3 u_reverseLightDirection;
uniform vec4 u_color;

void main() {
    vec3 normal = normalize(v_normal);
    float light = dot(normal, u_reverseLightDirection);

    gl_FragColor = vec4(0, 0, 0, 1);
    // gl_FragColor.rgb *= light;
}
