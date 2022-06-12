precision mediump float;

varying vec2 v_uvCoord;
uniform sampler2D u_texture;
uniform int onlyLights;

void main() {
    if(onlyLights == 1){
        gl_FragColor = vec4(0.0,0.0,0.0,0.0);
    }else{
        gl_FragColor = texture2D(u_texture, vec2(v_uvCoord.x, 1.0 - v_uvCoord.y));
    }
}