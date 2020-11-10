uniform mat4 u_projectionMatrix;
uniform mat4 u_modelViewMatrix;
uniform mat4 u_normalMatrix;

attribute vec4 a_position;
attribute vec4 a_normals;

varying vec3 v_normal;
varying vec3 v_position;

void main() {
    gl_Position = u_projectionMatrix * u_modelViewMatrix * a_position;

    v_normal = vec3(u_modelViewMatrix * a_normals);
    v_position = vec3(u_modelViewMatrix * a_position);
}
