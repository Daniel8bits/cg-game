precision mediump float;

varying vec2 v_uvCoord;

uniform sampler2D u_texture;

uniform float u_shininess;
varying vec3 v_normal;
varying vec3 v_surfaceToLight;
varying vec3 v_surfaceToView;
uniform vec3 u_lightColor;
uniform vec3 u_specularColor;
void main() {
    gl_FragColor = texture2D(u_texture, v_uvCoord);
    //gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    vec3 surfaceToLightDirection = normalize(v_surfaceToLight);
    vec3 surfaceToViewDirection = normalize(v_surfaceToView);
    vec3 halfVector = normalize(surfaceToLightDirection + surfaceToViewDirection);

    vec3 normal = normalize(v_normal);
    //vec3 surfaceToLightDirection = normalize(v_surfaceToLight);
    float light = dot(v_normal, v_surfaceToLight);
    float specular = 0.0;
    if (light > 0.0) {
        specular = pow(dot(normal, halfVector), u_shininess);
    }
  //  outColor = u_color;
 
    // Lets multiply just the color portion (not the alpha)
    // by the light
   //gl_FragColor.rgb *= light;// * u_lightColor;
    //gl_FragColor.rgb += specular * u_specularColor;
}