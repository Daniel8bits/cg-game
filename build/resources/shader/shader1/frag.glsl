precision mediump float;

varying vec2 v_uvCoord;

uniform sampler2D u_texture;

//
uniform float u_shininess;
varying vec3 v_normal;
varying vec3 FragPos;
uniform vec3 u_lightColor;
uniform vec3 u_specularColor;
uniform vec3 u_diffuseColor;
struct Light{
  vec3 position;
  vec3 direction;
  float cutOff;
} ;
uniform Light u_light;
void main() {
    gl_FragColor = texture2D(u_texture, v_uvCoord);
    
    /*
    //gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);

    vec3 surfaceToLightDirection = normalize(v_surfaceToLight);
    vec3 surfaceToViewDirection = normalize(v_surfaceToView);
    vec3 halfVector = normalize(surfaceToLightDirection + surfaceToViewDirection);

    vec3 normal = normalize(v_normal);
    //vec3 surfaceToLightDirection = normalize(v_surfaceToLight);
    float light = max(dot(v_normal, v_surfaceToLight),0.0);
    float specular = 0.0;
    if (light > 0.0) {
        specular = pow(dot(normal, halfVector), u_shininess);
    }
  //  outColor = u_color;
 
    // Lets multiply just the color portion (not the alpha)
    // by the light
   gl_FragColor.rgb *= light * u_lightColor;
   gl_FragColor.rgb += specular * u_specularColor;*/

  vec3 texturevec3 = vec3(texture2D(u_texture, v_uvCoord));
   vec3 ambient = u_lightColor * texturevec3;
  	
    // diffuse 
    vec3 norm = normalize(v_normal);
    vec3 lightDir = u_light.position - FragPos;
    float diff = max(dot(norm, lightDir), 0.0);
    vec3 diffuse = u_diffuseColor * (diff * texturevec3);
    

      // specular
    vec3 viewDir = u_light.position - FragPos;
    vec3 reflectDir = reflect(-lightDir, norm);  
    float spec = 0.0;
    if(diff > 0.0){
      spec = pow(max(dot(viewDir, reflectDir), 0.0),u_shininess);
    }
    vec3 specular = u_specularColor * (spec * texturevec3);  
        
    float distance  = length(u_light.position - FragPos);
    float attenuation = 1.0 / (1.0 + 0.09 * distance + 0.032 * (distance * distance));    
    ambient  *= attenuation; 
    diffuse  *= attenuation;
    specular *= attenuation; 

    float theta     = dot(lightDir, normalize(-u_light.direction));
    float epsilon   = u_light.cutOff - 0.82;
    float intensity = clamp((theta - 0.82) / epsilon, 0.0, 1.0);    

 //   diffuse  *= intensity;
   // specular *= intensity;

    vec3 result = ambient + diffuse + specular;
    //gl_FragColor = vec4(v_normal,1);
     gl_FragColor = vec4(result, 1.0);
}