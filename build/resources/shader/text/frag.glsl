precision highp float;

// Passed in from the vertex shader.
varying vec2 v_texcoord;

uniform sampler2D u_texture;

varying vec4 outColor;
uniform int onlyLights;

void main() {
    if(onlyLights == 1){
        gl_FragColor = vec4(0.0,0.0,0.0,0.0);
    }else{
/*
      vec3 color = vec3(texture2D(u_texture, vec2(v_texcoord.x, 1.0 - v_texcoord.y)));
      if(color == vec3(0.0, 0.0, 0.0))
        gl_FragColor = vec4(color, 0.0);
      else
        gl_FragColor = vec4(color, 1.0);
*/
      gl_FragColor = texture2D(u_texture, vec2(v_texcoord.x, 1.0 - v_texcoord.y));
    }
}