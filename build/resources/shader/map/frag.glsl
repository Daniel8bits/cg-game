precision mediump float;

uniform vec2 u_uvCoord;
uniform sampler2D u_texture;

void main() {
  gl_FragColor = texture2D(u_texture, u_uvCoord);
}