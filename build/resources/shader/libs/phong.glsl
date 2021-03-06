precision mediump float;

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