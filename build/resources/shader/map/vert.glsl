attribute vec3 a_position;
attribute vec3 a_normal;
attribute vec2 a_uvCoord;

uniform mat4 u_transform;
uniform mat4 u_view;
uniform mat4 u_projection;

varying vec2 v_uvCoord;

void main() {

    v_uvCoord = a_uvCoord;

    gl_Position = u_projection * u_view * u_transform * vec4(a_position, 1.0);
}