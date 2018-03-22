/*
{
  "audio": true,
  "glslify": true,
  "PASSES":[
    {"TARGET":"buff"},
    {"TARGET": "render"},
  ]
  "IMPORTED":{
    "PATH"; "./data/image/timetable.png"
  }
}
*/

precision mediump float;

uniform vec2 resolution;
uniform float time;

uniform float volume;
uniform sampler2D spectrum;
uniform sampler2D samples;

uniform int PASSINDEX;
uniform sampler2D buff;
uniform sampler2D render;

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

#pragma glslify: rotate = require(./utils/rotate2D.frag)


void main(){
  vec2 p = (gl_FragCoord.xy*2.-resolution)/min(resolution.x, resolution.y);
  vec3 color = vec3(0.);

  if(PASSINDEX==0){
    p = rotate(p,time*0.1);
    p = mod(p*1.0,1.0) *2.0-1.0;
    // p = mod(p*floor(volume/255.),1.0) *2.0-1.0;
    // p = rotate(p, time*0.1);
    // p = vec2(atan(p.y, p.x),length(p));
    p = abs(p);


    // freq
    float freq = texture2D(spectrum,vec2(tri(p.x*1.)*.8,0.5)).r;
    freq *= pow(freq,0.08);
    // freq *= 20.;
    float freq2 = texture2D(spectrum,vec2(tri(p.y*1.)*0.8,0.5)).r;
    float f1 = 0.8;
    float f2 = 0.9;
    vec3 baseColor = vec3(freq * f1 + freq2 * f2);
    // color = baseColor*vec3(0.1,0.6,0.8);
    color = baseColor *orange;
        color += vec3(1.-step(0.002,abs(p.x)));
    color += vec3(1.-step(0.002,abs(p.y)));

    // wave
    float wave = texture2D(samples,vec2(tri(p.x),0.5)).r-0.5;
    wave *= .8;
    vec3 cw = vec3(1.-step(0.01,abs(wave-p.y))) * white;
    vec3 cf = vec3(step(0.002,(freq-abs(p.y)))) * darkgray;
    // color += cw + cf;
    color += (cw*(vec3(1.)-cf)+(vec3(1.)-cw)*cf);

    // color += vec3(r, g, b);
    gl_FragColor = vec4(color, 1.);

  }else{
    vec2 st = gl_FragCoord.xy/resolution;
    // if(0.09<volume/255.){
    //   st += vec2(0.05,0.);
      st *= vec2(0.7);
    // }
    float w = volume/255.*0.5;
    float r = texture2D(buff, vec2(st.x-w, st.y)).r;
    float g = texture2D(buff, vec2(st.x, st.y)).r;
    float b = texture2D(buff, vec2(st.x+w, st.y)).r;
    gl_FragColor=vec4(r,g,b,1.);
    // gl_FragColor = texture2D(buff, st);
    // gl_FragColor.rgb = 1.0- gl_FragColor.brg;

  }

  // vec3 sdl = texture2D();
}
