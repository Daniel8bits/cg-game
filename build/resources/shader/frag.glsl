precision mediump float;

varying vec4 color_data;

void main() {
    gl_FragColor = color_data;
    //gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
}