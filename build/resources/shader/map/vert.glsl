attribute vec3 a_position;
attribute vec3 a_normal;
attribute vec2 a_uvCoord;

varying vec2 v_uvCoord;
//varying vec4 v_color;

uniform mat4 u_transform;
uniform mat4 u_view;
uniform mat4 u_projection;
uniform vec3 u_camera_position;


// Light?
//uniform vec3 u_viewWorldPosition;
uniform mat4 u_worldInverseTranspose;
//uniform vec3 u_lightWorldPosition;

varying vec3 v_normal;
varying vec3 v_FragPos;
varying vec3 v_camera_view;
varying float v_visibility;

#define FOG_DENSITY 0.03
#define FOG_GRADIENT 2.0

void main() {
    //color_data = vec4(normalize(a_position.xyz), 1);
    //v_color = mix(vec4(normalize(a_position.xyz), 1), vec4(a_normal, 1), .5);
    //gl_Position = u_orthographic * vec4(a_position, 1.0);

    v_uvCoord = a_uvCoord;
    //v_uvCoord = vec2(a_uvCoord.x*1102.0, a_uvCoord.y*1287.0a);


    // Light
    v_normal = mat3(u_worldInverseTranspose) * a_normal;
    v_FragPos = (u_transform * vec4(a_position, 1)).xyz;
    v_camera_view = vec3(u_view).xyz;

    vec4 positionRelativeToCamera = u_view * u_transform * vec4(a_position, 1.0);
    
    float distance = length(positionRelativeToCamera.xyz);
    v_visibility = clamp(exp(-pow(distance*FOG_DENSITY, FOG_GRADIENT)), 0.0, 1.0);

    gl_Position = u_projection * positionRelativeToCamera;
}