/*{
  "audio": true,
  "glslify": true,
  "PASSES":[
    {"TARGET": "buff"},
    {"TARGET": "render"}
  ]
}*/
precision mediump float;

uniform vec2 resolution;
uniform float time;
uniform vec2 mouse;

uniform float volume;
uniform sampler2D samples;
uniform sampler2D spectrum;

uniform int PASSINDEX;
uniform sampler2D buff;
uniform sampler2D render;

#define PI 3.1415926

#pragma glslify: dFunc = require(./RayTracingSet/distanceFunction.frag)
#pragma glslify: op = require(./RayTracingSet/operation.frag)
#pragma glslify: rand1D = require(./utils/rand1D.frag)
#pragma glslify: noise1D = require(./utils/noise1D.frag)
#pragma glslify: hsv2rgb = require(./utils/hsv2rgb.frag)

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

mat2 rotate(float _r){
  return mat2(cos(_r), -sin(_r),
              sin(_r),  cos(_r));
}


void main(){
  float time = mod(time, 600.);
  vec2 p = (gl_FragCoord.xy*2.-resolution)/min(resolution.x, resolution.y);
  vec2 st = gl_FragCoord.xy/resolution;
  vec3 color = vec3(0.);

  float vol = volume/255.;

  if(PASSINDEX==0){
    vec3 camPos = vec3(0.,0.,time*1.);

    vec3 dir = vec3(p, 1.);
    float t = mod(time,3.0);
    // if(t<1.) dir.xy *= rotate(sin(time*0.2));
    // if(t<2.) dir.xz *= rotate(time*0.3);
    // dir.yz *= rotate(time*0.4);

    // dir.xy = vec2(length(dir.xy), atan(dir.y, dir.x));


    float d=0.;
    for(int i=0;i<24;i++){
      vec3 cur = op(dir*d + camPos);
      float tmp = dFunc(cur, vol * 8.)*0.7;
      if(tmp<0.01) break;
      d += tmp;
    }
    vec3 intersect_p = op(d*dir+camPos);

    // vec3 base = hsv2rgb(vec3(fract(volume/255*100.),1.,1.));
    vec3 base = lightgray;
    // vec3 base = gray;//hsv2rgb(vec3(volume, 1., 1.));
    color += (vec3(d*0.03)+dFunc(intersect_p-0.1, vol*8.)) * base;
    // if(0.27<volume/255.)color += (vec3(d*0.03)+dFunc(intersect_p-0.1, vol*8.));
    // else{
    //   color += 1.0-(vec3(d*0.03)+dFunc(intersect_p-0.1, vol * 8.));
    //   color *= 0.5;
    // }
    gl_FragColor = vec4(color, 1.0);
  }
  else{
    // if(0.9<noise1D(st.y*5.+time*200.)){
    //   float w = rand1D(time*0.01)*0.03;
    //   w = volume/255.*100.;
    //   // w = 0.1;
    //   float r = texture2D(buff, vec2(st.x-w,st.y)).r;
    //   float g = texture2D(buff, vec2(st.x,st.y)).g;
    //   float b = texture2D(buff, vec2(st.x+w,st.y)).b;
    //   color=vec3(r,g,b);
    //   // gl_FragColor = vec4(r,g,b, 1.);
    //   // color = 1. - texture2D(buff, st).rgb;
    //   // color = texture2D(buff, st).rgb;
    //   gl_FragColor = vec4(color, 1.);
    // }
    // else{
    //   vec2 st = gl_FragCoord.xy/resolution;
    //   // if(0.5<noise1D(time*10.)){
    //   //   st *= 0.9;
    //   //   float w = 0.2<noise1D(5.157+time)?-0.01:0.01;
    //   //   // w *= volume/255. *0.1;
    //   //   st.x = fract(st.x + w);
    //   //   st.y = fract(st.y + w);
    //   // }
    //
    //   gl_FragColor = texture2D(buff, st);
    //   // gl_FragColor.rgb = 1.0-gl_FragColor.rgb;
    // }
    gl_FragColor = texture2D(buff, st);
  }
}
