precision mediump float;

varying vec2 v_uvCoord;

uniform vec3 u_color;
uniform int onlyLights;

void main() {
    if(onlyLights == 1){
        gl_FragColor = vec4(0.0,0.0,0.0,0.0);
    }else{
        gl_FragColor = vec4(u_color,0.1);
    }
}