attribute vec4 a_coords;
attribute vec3 a_normals;

uniform mat4 u_worldViewProjection;
uniform mat4 u_worldInverseTranspose;
varying vec3 v_normal;

void main() {
    gl_Position = u_worldViewProjection * a_coords;
    v_normal = mat3(u_worldInverseTranspose) * a_normals;
}
