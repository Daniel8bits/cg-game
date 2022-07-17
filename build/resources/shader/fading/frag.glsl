#extension GL_EXT_gpu_shader5 : disable 
#extension GL_ARB_gpu_shader5 : disable
precision mediump float;

varying vec2 v_uvCoord;

uniform sampler2D u_albedo;
uniform float u_fading;

void main() {
  gl_FragColor = mix(vec4(vec3(texture2D(u_albedo, v_uvCoord).rgb), 1.0), vec4(0.0, 0.0, 0.0, 1.0), u_fading);
}