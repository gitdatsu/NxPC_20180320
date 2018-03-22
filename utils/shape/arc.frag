// arc
// use original method "circle"
// _st ~ _isFill : same as circle
// _rad1 : start angle
// _rad2 : goal angle
float arc(vec2 _st, vec2 _pos, float _r, bool _isFill, in float _rad1, in float _rad2){
  _rad1 = mod(_rad1,2.*PI);
  _rad2 = mod(_rad2,2.*PI);
  vec2 p = _st-_pos;
  float r = length(p);
  float a = mod(atan(p.y,p.x)+2.*PI,2.*PI);
  float ret;
  ret = circle(_st,_pos,_r,_isFill);
  if(_rad1<_rad2){
    ret *= smoothstep(_rad1-0.02,_rad1,a)-smoothstep(_rad2,_rad2+0.02,a);
  }else{
    ret *= (smoothstep(-0.02,0.,a)-smoothstep(_rad2,_rad2+0.02,a)) +
           (smoothstep(_rad1-0.02,_rad1,a)-smoothstep(2.*PI,2.*PI+0.02,a));
  }
  return ret;
}
#pragma glslify: export(arc)
