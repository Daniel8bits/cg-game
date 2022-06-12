attribute vec3 a_position;
attribute vec3 a_normal;
attribute vec2 a_uvCoord;

varying vec2 v_uvCoord;
//varying vec4 v_color;

uniform mat4 u_transform;
uniform mat4 u_view;
uniform mat4 u_projection;

// Light?
//uniform vec3 u_viewWorldPosition;
uniform mat4 u_worldInverseTranspose;
//uniform vec3 u_lightWorldPosition;

varying vec3 v_normal;
varying vec3 v_FragPos;
varying vec3 v_camera_view;
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

    gl_Position = u_projection * u_view * u_transform  * vec4(a_position, 1.0);
}