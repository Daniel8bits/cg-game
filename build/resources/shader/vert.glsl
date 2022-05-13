attribute vec3 a_position;
attribute vec3 a_normal;
//attribute vec4 a_color;

varying vec4 color_data;

uniform mat4 u_transform;
uniform mat4 u_view;
uniform mat4 u_projection;

void main() {
    color_data = vec4(normalize(a_position.xyz), 1);
    //color_data = vec4(a_normal, 1);
    //gl_Position = u_orthographic * vec4(a_position, 1.0);
    gl_Position = u_projection * u_view * u_transform * vec4(a_position, 1.0);
}