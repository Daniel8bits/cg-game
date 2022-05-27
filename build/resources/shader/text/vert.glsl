precision mediump float;

attribute vec2 a_position;
attribute vec2 a_texcoord;


uniform mat4 u_transform;
uniform mat4 u_view;
uniform mat4 u_projection;

varying vec2 v_texcoord;

void main() {
  // Multiply the position by the matrix.
  gl_Position = u_projection  * u_transform * vec4(a_position,0.0,1.0);

  // Pass the texcoord to the fragment shader.
  v_texcoord = a_texcoord;
}
