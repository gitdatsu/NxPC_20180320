// circle
// _st : pixel pos normalized from -1.0 to 1.0
// _pos : center of circle
// _r : radius
// _isFill : whether to fill
float circle(vec2 _p,vec2 _offset,float _r,bool _isFill){
  vec2 p = _p-_offset;
  float l = length(p);
  if(_isFill){
    return 1.0-smoothstep(_r,_r+0.02,length(p));
  }else{
    float weight = 0.008;
    return smoothstep(_r-weight,_r,l)-smoothstep(_r,_r+weight,l);
  }
}
#pragma glslify: export(circle)
