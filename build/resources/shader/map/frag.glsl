#extension GL_EXT_gpu_shader5 : disable 
#extension GL_ARB_gpu_shader5 : disable
precision mediump float;

varying vec2 v_uvCoord;

uniform sampler2D u_texture;
uniform vec3 u_camera_position_FRAG;


varying vec3 v_normal;
varying vec3 v_FragPos;
varying vec3 v_camera_view;
varying float v_visibility;

#define MAX_LIGHTS 5


struct LightProperties{
  vec3 ambient;
  vec3 diffuse;
  vec3 specular;
};
struct DistanceConfig{
  float constant;
  float linear;
  float quadratic;
};

struct Light{
  vec3 position;
  vec3 direction;
  float cutOff;
  float shininess;

  LightProperties color;
  DistanceConfig distance;
};

uniform Light pointLights[MAX_LIGHTS];
uniform Light lightCamera;
uniform float u_applyLight;
uniform float u_onlyLights;
uniform vec3 u_lightColor;

#define FOG_COLOR vec3(0.2, 0.0, 0.0)


LightProperties CalcDirLight(Light light, vec3 normal, vec3 viewDir,vec3 texturevec3)
{
    LightProperties properties;
    
    vec3 lightDir = normalize(-light.position - v_FragPos);
    float diff = dot(normal, lightDir);
    
    vec3 reflectDir = reflect(-lightDir, normal);
    vec3 halfwayDir = normalize(lightDir + viewDir);

    float spec = pow(dot(viewDir, halfwayDir), light.shininess);

    properties.ambient = light.color.ambient  * texturevec3;
    properties.diffuse = light.color.diffuse * pow(texturevec3, vec3(2.2)) * texturevec3;
    //properties.diffuse  = light.color.diffuse  * diff * texturevec3;
    properties.specular = light.color.specular * spec * texturevec3;
    
    return properties;
}  
vec3 CalcPointLight(Light light, vec3 normal, vec3 viewDir,vec3 texturevec3)
{
    LightProperties properties = CalcDirLight(light,normal,viewDir,texturevec3);

    float distance    = length(light.position - v_FragPos);
    float attenuation = 1.0 / (light.distance.constant + light.distance.linear * distance + light.distance.quadratic * (distance * distance));    
    properties.ambient *= attenuation;
    properties.diffuse *= attenuation; //Ta bugando a luz por algum motivo (?)
    properties.specular *= attenuation;

    return (properties.ambient + properties.diffuse + properties.specular);
} 

bool isVisible(vec3 camera,vec3 light){
  float dx = camera.x - light.x;
  float dy = camera.y - light.y;
  float dz = camera.z - light.z;

  return sqrt(dx * dx + dy * dy + dz * dz) < 100.0;
}

void main() {

  vec3 texturevec3 = vec3(texture2D(u_texture, v_uvCoord));

  vec3 norm = normalize(v_normal);
  vec3 viewDir = normalize(u_camera_position_FRAG - v_FragPos);
  vec3 result = vec3(0.0);
  vec4 fragment = vec4(0.0);
  //if(applyLight == 1) result = CalcPointLight(lightCamera,norm,viewDir,texturevec3);// Luz da Camera
  


  result += CalcPointLight(pointLights[0], norm, viewDir,texturevec3);
  result += CalcPointLight(pointLights[1], norm, viewDir,texturevec3);
  result += CalcPointLight(pointLights[2], norm, viewDir,texturevec3);
  result += CalcPointLight(pointLights[3], norm, viewDir,texturevec3);
  result += CalcPointLight(pointLights[4], norm, viewDir,texturevec3);

  result = mix(texturevec3*u_lightColor*10.0, result, u_applyLight);

  if(u_onlyLights == 1.0) {
    float brightness = dot(result.rgb, vec3(0.2126, 0.7152, 0.0722));
    if(brightness > 1.0)
        fragment = vec4(result.rgb, 1.0);
    else
        fragment = vec4(0.0, 0.0, 0.0, 1.0);
  } else {
    fragment = mix(vec4(FOG_COLOR, 1.0), vec4(result, 1.0), v_visibility);
  }

  float gamma = 2.2;
  fragment.rgb = pow(fragment.rgb, vec3(1.0/gamma))*0.3;

  gl_FragColor = fragment;




  /*

  if(v_visibility > 0.1 && applyLight == 1) {
    for(int i = 0; i < MAX_LIGHTS; i++)
        result += CalcPointLight(pointLights[i], norm, viewDir,texturevec3);
    }
  else if(applyLight == 0){
    result = texturevec3 * u_lightColor * 10.0;
  } else {
    result = FOG_COLOR;
  }
  if(onlyLights == 1){

    float brightness = dot(result.rgb, vec3(0.2126, 0.7152, 0.0722));
    if(brightness > 1.0)
        gl_FragColor = vec4(result.rgb, 1.0);
    else
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
  } else{

    gl_FragColor = mix(vec4(FOG_COLOR, 1.0), vec4(result, 1.0), v_visibility);
  }   

  */
  //float gamma = 2.2;
  //gl_FragColor.rgb = pow(gl_FragColor.rgb, vec3(1.0/gamma))*0.3;

  //gl_FragColor = vec4(texturevec3, 1.0);

}
