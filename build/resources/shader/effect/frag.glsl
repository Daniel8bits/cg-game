#extension GL_EXT_gpu_shader5 : disable 
#extension GL_ARB_gpu_shader5 : disable
precision mediump float;

varying vec2 v_uvCoord;

uniform sampler2D u_texture;
uniform sampler2D u_mascara;
uniform float u_horizontal;
uniform float weight[5];
uniform float sizeTexture[2];
uniform int mode;

float gamma = 1.0;
float exposure = 1.0;
void main()
{ 
    vec3 result = texture2D(u_texture, vec2(v_uvCoord.x, v_uvCoord.y)).rgb;
    if(mode == 2){
        vec3 bloomColor = texture2D(u_mascara, vec2(v_uvCoord.x, v_uvCoord.y)).rgb;
        result += bloomColor;
        result = vec3(1.0) - exp(-result * exposure);
        result = pow(result,vec3(1.0/gamma));
    }else
    if(mode == 1){
        vec2 tex_offset = 1.0 / vec2(sizeTexture[0],sizeTexture[1]);
        result *= weight[0]; 

        float factor = mix(tex_offset.y, tex_offset.x, u_horizontal);

        result += texture2D(u_texture, v_uvCoord + mix(vec2(0.0, factor * 1.0), vec2(factor * 1.0, 0.0), u_horizontal)).rgb * weight[1];
        result += texture2D(u_texture, v_uvCoord - mix(vec2(0.0, factor * 1.0), vec2(factor * 1.0, 0.0), u_horizontal)).rgb * weight[1];

        result += texture2D(u_texture, v_uvCoord + mix(vec2(0.0, factor * 2.0), vec2(factor * 2.0, 0.0), u_horizontal)).rgb * weight[2];
        result += texture2D(u_texture, v_uvCoord - mix(vec2(0.0, factor * 2.0), vec2(factor * 2.0, 0.0), u_horizontal)).rgb * weight[2];

        result += texture2D(u_texture, v_uvCoord + mix(vec2(0.0, factor * 3.0), vec2(factor * 3.0, 0.0), u_horizontal)).rgb * weight[3];
        result += texture2D(u_texture, v_uvCoord - mix(vec2(0.0, factor * 3.0), vec2(factor * 3.0, 0.0), u_horizontal)).rgb * weight[3];

        result += texture2D(u_texture, v_uvCoord + mix(vec2(0.0, factor * 4.0), vec2(factor * 4.0, 0.0), u_horizontal)).rgb * weight[4];
        result += texture2D(u_texture, v_uvCoord - mix(vec2(0.0, factor * 4.0), vec2(factor * 4.0, 0.0), u_horizontal)).rgb * weight[4];
    }
    gl_FragColor = vec4(result,1.0);
}