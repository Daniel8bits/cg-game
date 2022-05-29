precision mediump float;

varying vec2 v_uvCoord;

uniform vec3 u_color;

void main() {
    gl_FragColor = vec4(u_color,0.1);
}