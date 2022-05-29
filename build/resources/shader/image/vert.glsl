attribute vec2 a_position;
attribute vec2 a_uvCoord;

uniform mat4 u_transform;
uniform mat4 u_projection;

varying vec2 v_uvCoord;

void main() {
  gl_Position = u_projection * u_transform * vec4(a_position,0.0,1.0);//vec4((mat3(u_transform) * a_position).xy, 0, 1);
    v_uvCoord = a_uvCoord;
}