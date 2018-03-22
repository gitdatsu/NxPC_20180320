/*{
  "audio": true,
  "glslify": true,
  "IMPORTED":{
    "video1":{
      "PATH": "./data/movie/wark1.MOV",
      "SPEED": .5,
    },
    "image1":{
      "PATH": "./data/image/NxPC_logo.jpg",
    },
  },
  "PASSES":[
    {"TARGET": "buff"},
    {"TARGET": "render"}
  ],
}*/

precision mediump float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

uniform float volume;
uniform sampler2D sampler;
uniform sampler2D spectrum;

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

#pragma glslify: rand1D = require(./utils/rand1D.frag)
#pragma glslify: rotate = require(./utils/rotate2D.frag)
#pragma glslify: polygon = require(./utils/shape/polygon.frag)

void main(){
  float time = mod(time,60.);
  vec2 p = (gl_FragCoord.xy*2. - resolution)/min(resolution.x, resolution.y);
  vec2 st = gl_FragCoord.xy/resolution;
  vec3 color = vec3(0.0);

  if(PASSINDEX==0){
    float ratio = 1.;
    p *= ratio;
    //
    vec2 ip = floor(p);
    //
    if(mod(ip.y,2.)<1.)p.x += fract(time);
    else p.x -= fract(time);
    p += vec2(1.0/ratio);
    p *= 2.;
    p = fract(p)*2.0-1.0;

    float pn = ip.x<0.?-1.:1.;
    p = rotate(p, time);
    color += polygon(p, vec2(0.,0.), 0.3, 3);
    color += polygon(p, vec2(0.,0.) + vec2(sin(time*2.6),cos(time))*0.2, .3 * volume/255. * 10., 3) * red;
    p = rotate(p, pn*time*PI*0.3);
    color += polygon(p, vec2(0.,0.), .5 * volume/255. * 10., int(floor(mod(time*10., 10.)))+3) * blue;
    p = rotate(p, pn*time*PI*0.5);
    color += polygon(p, vec2(0.,0.), .6 * volume/255. * 10., 3) * green;

    color += polygon(p, vec2(0.), .5, int(floor(mod(time*10., 10.)))+3);

    gl_FragColor = vec4(color, 1.);

  }else{
    if(0.34<volume/255.){
      gl_FragColor = texture2D(buff, st);
      gl_FragColor.rgb *= 2.;
    }else{
      float w = 0.05;
      float r = texture2D(buff, vec2(st.x-w, st.y)).r;
      float g = texture2D(buff, vec2(st.x, st.y)).r;
      float b = texture2D(buff, vec2(st.x+w, st.y)).r;
      gl_FragColor = vec4(r,g,b,1.);
      // gl_FragColor = vec4(vec3(1.)-vec3(r,g,b), 1.);
    }
  }
}
