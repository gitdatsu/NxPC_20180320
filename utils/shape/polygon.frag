// polygon
// _st : pixel pos normalized from -1.0 to 1.0
// _pos : center of polygon
// _radius : radius of polygon vertex
// _n : num of vertex
precision mediump float;
#define PI 3.14159265359
#define TWO_PI 6.28318530718
float polygon(vec2 _st,vec2 _pos,float _radius,int _n){
  vec2 p = _st-_pos;
  float a = atan(p.x,p.y)+PI;
  float r = TWO_PI/float(_n);
  float d = cos(floor(.5+a/r)*r-a)*length(p);
  return  0.3*(1.0-smoothstep(_radius-0.02,_radius,d));
  // -smoothstep(_radius,_radius+0.02,d);
}
#pragma glslify: export(polygon)
