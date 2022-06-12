precision mediump float;

varying vec2 v_uvCoord;

uniform sampler2D screenTexture;

void main()
{ 
    gl_FragColor = texture2D(screenTexture, vec2(v_uvCoord.x, v_uvCoord.y));
    //gl_FragColor = vec4(vec3(1.0 - texture2D(screenTexture, v_uvCoord)), 1.0);
}