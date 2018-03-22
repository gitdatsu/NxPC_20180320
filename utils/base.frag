/*{
  "glslify":true,
  "audio":true,
}*/

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

uniform float volume;
uniform sampler2D samples;
uniform sampler2D spectrum;

#define PI 3.14159265359
#define TWO_PI 6.28318536718

void main(){
  vec2 p = (gl_FragCoord.xy*2.-resolution) / min(resolution.x,resolution.y);
  vec2 st = gl_FragCoord.xy/resolution;
  vec3 color = vec3(0.);

  gl_FragColor = vec4(color,1.);
}
