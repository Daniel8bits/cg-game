precision mediump float;

varying vec2 v_uvCoord;
//varying vec4 v_color;

uniform sampler2D u_lockedTexture;
uniform sampler2D u_unlockedTexture;
uniform sampler2D u_displayMap;
uniform float u_locked;
uniform vec3 u_camera_position;


varying vec3 v_normal;
varying vec3 v_FragPos;
varying vec3 v_camera_view;
varying float v_visibility;

#define MAX_LIGHTS 5
#define FOG_COLOR vec3(0.2, 0.0, 0.0)

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

LightProperties CalcDirLight(Light light, vec3 normal, vec3 viewDir,vec3 texturevec3)
{
    LightProperties properties;
    
    vec3 lightDir = normalize(-light.position - v_FragPos);
    float diff = max(dot(normal, lightDir), 0.0);
    
    vec3 reflectDir = reflect(-lightDir, normal);
    vec3 halfwayDir = normalize(lightDir + viewDir);

    float spec = pow(max(dot(viewDir, halfwayDir), 0.0), light.shininess);

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
    properties.diffuse *= attenuation;
    properties.specular *= attenuation;

    return (properties.ambient + properties.diffuse + properties.specular);
}

void main() {


  vec3 texturevec3 = mix(
    vec3(texture2D(u_unlockedTexture, v_uvCoord)),
    vec3(texture2D(u_lockedTexture, v_uvCoord)),
    u_locked
  );

  float displayMap = vec3(texture2D(u_displayMap, v_uvCoord)).x;

  vec3 norm = normalize(v_normal);
  vec3 viewDir = normalize(u_camera_position - v_FragPos);
  vec3 result = vec3(0.0);
  vec4 fragment = vec4(0.0);

  result += CalcPointLight(pointLights[0], norm, viewDir,texturevec3);
  result += CalcPointLight(pointLights[1], norm, viewDir,texturevec3);
  result += CalcPointLight(pointLights[2], norm, viewDir,texturevec3);
  result += CalcPointLight(pointLights[3], norm, viewDir,texturevec3);
  result += CalcPointLight(pointLights[4], norm, viewDir,texturevec3);

  result = mix(result, texturevec3*1.75, displayMap);

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
  vec3 texture;

  if(u_locked == 1) {
    texture = vec3(texture2D(u_lockedTexture, v_uvCoord));
  } else {
    texture = vec3(texture2D(u_unlockedTexture, v_uvCoord));
  }

  float displayMap = vec3(texture2D(u_displayMap, v_uvCoord)).x;

  vec3 result = vec3(0.0);
  if(v_visibility > 0.1 && displayMap == 0.0) {
    vec3 norm = normalize(v_normal);
    vec3 viewDir = normalize(u_camera_position - v_FragPos);
    if(applyLight == 1) result = CalcPointLight(lightCamera,norm,viewDir,texture);// Luz da Camera
    for(int i = 0; i < MAX_LIGHTS; i++)
        result += CalcPointLight(pointLights[i], norm, viewDir,texture);
  } else if(displayMap > 0.0) {
    result = texture * 1.75;
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

  //float gamma = 1.0;
  //gl_FragColor.rgb = pow(gl_FragColor.rgb, vec3(1.0/gamma));

  //gl_FragColor = vec4(texturevec3, 1.0);

}
