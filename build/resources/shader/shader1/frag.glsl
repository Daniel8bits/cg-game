precision mediump float;

varying vec2 v_uvCoord;
//varying vec4 v_color;

uniform sampler2D u_texture;
uniform vec3 u_camera_position;

//
varying vec3 v_normal;
varying vec3 v_FragPos;
varying vec3 v_camera_view;

#define MAX_LIGHTS 33


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

    float spec = pow(max(dot(viewDir, reflectDir), 0.0), light.shininess);

    properties.ambient  = light.color.ambient  * texturevec3;
    //properties.diffuse = pow(texturevec3, vec3(2.2));
    properties.diffuse  = light.color.diffuse  * diff * texturevec3;
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

bool isVisible(vec3 camera,vec3 light){
  float dx = camera.x - light.x;
  float dy = camera.y - light.y;
  float dz = camera.z - light.z;

  return sqrt(dx * dx + dy * dy + dz * dz) < 100.0;
}

void main() {
    vec3 texturevec3 = vec3(texture2D(u_texture, v_uvCoord));

    vec3 norm = normalize(v_normal);
    vec3 viewDir = normalize(u_camera_position - v_FragPos);
    vec3 result = vec3(0.0);
    //if(applyLight == 1) result = CalcPointLight(lightCamera,norm,viewDir,texturevec3);
    for(int i = 0; i < MAX_LIGHTS; i++)
        result += CalcPointLight(pointLights[i], norm, viewDir,texturevec3);
    gl_FragColor = vec4(result, 1.0);

    float gamma = 1.0;
    gl_FragColor.rgb = pow(gl_FragColor.rgb, vec3(1.0/gamma));

    //gl_FragColor = vec4(texturevec3, 1);
 
  /*
    vec3 ambient = u_lightColor * texturevec3;
  	
    // diffuse 
    vec3 lightDir = normalize(u_light.position - FragPos);
    float diff = max(dot(norm, lightDir), 0.0);
    vec3 diffuse = u_diffuseColor * (diff * texturevec3);
    

      // specular
    vec3 viewDir = normalize(u_camera_view - FragPos);//u_light.position - FragPos;
    vec3 reflectDir = reflect(-lightDir, norm);  
    float spec = 0.0;
    if(diff > 0.0){
      spec = pow(max(dot(viewDir, reflectDir), 0.0),u_shininess);
    }
    vec3 specular = u_specularColor * (spec * texturevec3);  
        
    float distance  = length(u_light.position - FragPos);
    float attenuation = 1.0 / (1.0 + 0.045 * distance + 0.0075 * (distance * distance));    
    ambient  *= attenuation; 
    diffuse  *= attenuation;
    specular *= attenuation; 

    float theta     = dot(lightDir, normalize(-u_light.direction));
    float epsilon   = u_light.cutOff - 0.82;
    float intensity = clamp((theta - 0.82) / epsilon, 0.0, 1.0);    

    diffuse  *= intensity;
    specular *= intensity;

      vec3 result = ambient + diffuse + specular;
    //gl_FragColor = vec4(v_normal,1);
     gl_FragColor = vec4(result, 1.0);*/
}
