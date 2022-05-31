precision mediump float;

varying vec2 v_uvCoord;
uniform sampler2D u_texture;

void main() {
    gl_FragColor = texture2D(u_texture, vec2(v_uvCoord.x, 1.0 - v_uvCoord.y));
}