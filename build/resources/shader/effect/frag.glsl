precision mediump float;

varying vec2 v_uvCoord;

uniform sampler2D u_texture;
uniform sampler2D u_mascara;
uniform bool horizontal;
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
        if(horizontal)
        {
            for(int i = 1; i < 5; ++i)
            {
                result += texture2D(u_texture, v_uvCoord + vec2(tex_offset.x * float(i), 0.0)).rgb * weight[i];
                result += texture2D(u_texture, v_uvCoord - vec2(tex_offset.x * float(i), 0.0)).rgb * weight[i];
            }
        }
        else
        {
            for(int i = 1; i < 5; ++i)
            {
                result += texture2D(u_texture, v_uvCoord + vec2(0.0, tex_offset.y * float(i))).rgb * weight[i];
                result += texture2D(u_texture, v_uvCoord - vec2(0.0, tex_offset.y * float(i))).rgb * weight[i];
            }
        }
        //gl_FragColor = vec4(vec3(1.0 - texture2D(screenTexture, v_uvCoord)), 1.0);
    }
    gl_FragColor = vec4(result,1.0);
}