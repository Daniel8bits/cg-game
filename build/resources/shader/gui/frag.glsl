precision mediump float;

varying vec2 v_uvCoord;

uniform vec4 u_color;
uniform float u_onlyLights;

void main() {
    /*
    if(onlyLights == 1){
        gl_FragColor = vec4(0.0,0.0,0.0,0.0);
    }else{
        gl_FragColor = u_color;
    }
    */

    gl_FragColor = mix(u_color, vec4(0.0,0.0,0.0,0.0), u_onlyLights);
}