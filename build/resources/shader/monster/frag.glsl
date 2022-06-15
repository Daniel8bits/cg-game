precision mediump float;

varying vec2 v_uvCoord;
//varying vec4 v_color;

uniform sampler2D u_texture;
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
uniform int applyLight;

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
    //properties.diffuse *= attenuation; Ta bugando a luz por algum motivo (?)
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

  vec4 texturePixel = texture2D(u_texture, v_uvCoord);
  vec3 texture = vec3(texturePixel);

  vec3 norm = normalize(v_normal);
  vec3 viewDir = normalize(u_camera_position - v_FragPos);
  vec3 result = vec3(0.0);
  //if(applyLight == 1) result = CalcPointLight(lightCamera,norm,viewDir,texture);// Luz da Camera

  if(v_visibility > 0.1) {
    for(int i = 0; i < MAX_LIGHTS; i++)
        result += CalcPointLight(pointLights[i], norm, viewDir,texture);
  } else {
    result = FOG_COLOR;
  }
      
  gl_FragColor = vec4(mix(FOG_COLOR, result, v_visibility), texturePixel.a);

  //float gamma = 2.2;
  //gl_FragColor.rgb = pow(gl_FragColor.rgb, vec3(1.0/gamma))*0.3;

  //gl_FragColor = vec4(texture, texturePixel.a);

}
