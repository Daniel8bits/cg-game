attribute vec2 a_position;
attribute vec2 a_uvCoord;

varying vec2 v_uvCoord;

void main()
{
    gl_Position = vec4(a_position,0.0,1.0);
    v_uvCoord = a_uvCoord;
}