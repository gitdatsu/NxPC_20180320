
/*{
  "pixelRatio":1,
  "audio" : true,
  "glslify": true,
  "PASSES" : [
    {"TARGET": "buff"},
    {"TARGET": "render"},
  ],
}*/

precision mediump float;

uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;
uniform sampler2D samples;
uniform sampler2D spectrum;
uniform float volume;
uniform sampler2D backbuffer;

uniform int PASSINDEX;
uniform sampler2D render;
uniform sampler2D buff;

#define PI 3.14159263

//color set
#define red vec3(1.,0.,0.)
#define green vec3(0.,1.,0.)
#define blue vec3(0.,0.,1.)
#define yellow vec3(1.,1.,0.)
#define cyan vec3(0.,1.,1.);
#define magenta vec3(1.,0.,1.)
#define white vec3(1.0)
#define black vec3(0.0)
#define gray vec3(128.)/255.
#define lightgray vec3(211.)/255.
#define darkgray vec3(169.)/255.
#define orange vec3(255., 165., 0.)/255.
#define purple vec3(128., 0., 128.)/255.
#define navy vec3(0., 0., 128.)/255.
#define darkgreen vec3(0., 100., 0.)/255.
#define skyblue vec3(135., 206., 235)/255.


float tri(float _theta){
  return abs(mod(_theta-1.,2.)-1.);
}

vec2 rotate(vec2 _p, float _r){
  return mat2(
      cos(_r),-sin(_r),sin(_r),cos(_r)
    )*_p;
}

float circle(vec2 p, vec2 offset, float r){
  return 1.0-smoothstep(r, r+0.008, distance(p,offset));
}

#pragma glslify: rand1D = require(./utils/rand1D.frag)
#pragma glslify: noise1D = require(./utils/noise1D.frag)

void main(){
  //------------------------------------------------------------------
  float time = mod(time, 60.);
  vec2 p = (gl_FragCoord.xy*2.-resolution)/min(resolution.x,resolution.y);
  vec2 st = gl_FragCoord.xy/resolution;
  vec3 color = vec3(0.);
  //------------------------------------------------------------------

  // p translate
  // p = mod(st*3.0,1.0)*2.0-1.0;
  p = rotate(p, time*0.1);
  // p = mod(p*3.0,1.0) *2.0-1.0;
  // p = mod(p*floor(volume/255.),1.0) *2.0-1.0;
  // p = rotate(p, time*0.1);
  // p = vec2(atan(p.y, p.x),length(p));
  p = abs(p);


  // freq
  float freq = texture2D(spectrum,vec2(tri(p.x*1.)*0.8,0.5)).r;
  freq *= pow(freq,2.);
  float freq2 = texture2D(spectrum,vec2(tri(p.y*1.)*0.8,0.5)).r;
  float f1 = 0.6;
  float f2 = 0.4;
  vec3 baseColor = vec3(freq * f1 + freq2 * f2);
  // color = baseColor*vec3(0.1,0.6,0.8);
  color = baseColor * orange;
  color += vec3(1.-step(0.002,abs(p.x)));
  color += vec3(1.-step(0.002,abs(p.y)));


  // wave
  float wave = texture2D(samples,vec2(tri(p.x),0.5)).r-0.5;
  wave *= 0.8;
  vec3 cw = vec3(1.-step(0.01,abs(wave-p.y))) * white;
  vec3 cf = vec3(step(0.002,(freq-abs(p.y)))) * yellow;
  // color += cw + cf;
  color += (cw*(vec3(1.)-cf)+(vec3(1.)-cw)*cf);

  color += texture2D(backbuffer, st).b * volume/255.0;

  vec4 tmp = volume/255.<0.8?vec4(color,1.):vec4(.8-color, 1.);
  gl_FragColor = tmp;


  if(PASSINDEX==0)  gl_FragColor = tmp;
  else{
    vec2 st = gl_FragCoord.xy/resolution;
    if(0.5<noise1D(time*10.)){
      st *= 0.9;
      float w = 0.2<noise1D(5.157+time)?-0.01:0.01;
      // w *= volume/255. *0.1;
      st.x = fract(st.x + w);
      st.y = fract(st.y + w);
    }
    
    float w = volume/255.*0.05;
    float r = texture2D(buff, vec2(st.x-w, st.y+w)).r;
    float g = texture2D(buff, vec2(st.x, st.y)).g;
    float b = texture2D(buff, vec2(st.x+w, st.y-w)).g;
    color = vec3(r,g,b);
    if(0.34<volume/255.)color = 1.0-color;
    gl_FragColor = vec4(color,1.);

    // gl_FragColor = texture2D(buff, st);
  }
}
