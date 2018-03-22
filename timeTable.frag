/*{
  "IMPORTED":{
    "timetable":{
      "PATH": "./data/image/TimeTable.PNG",
    },
  },
}*/
precision mediump float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

uniform sampler2D timetable;

void main(){
  float time = mod(time,60.);
  vec2 p = (gl_FragCoord.xy*2. - resolution)/min(resolution.x, resolution.y);
  vec2 st = gl_FragCoord.xy/resolution;
  vec3 color = vec3(0.0);


  p *= 0.55;
  p += vec2(0., 0.5);
  p -= vec2(0., time*0.1);
  p = fract(p);


  gl_FragColor = texture2D(timetable, p);
  gl_FragColor.rgb = 1.0-gl_FragColor.rgb;
}
