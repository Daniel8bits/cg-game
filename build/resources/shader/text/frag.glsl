precision highp float;

// Passed in from the vertex shader.
varying vec2 v_texcoord;

uniform sampler2D u_texture;

varying vec4 outColor;

void main() {
   gl_FragColor = texture2D(u_texture, v_texcoord);
}