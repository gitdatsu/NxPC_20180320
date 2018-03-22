// line
// _st : pixel pos normalized from -1.0 to 1.0
// _p1 : start point
// _p2 : end point
float line(vec2 _st,vec2 _p1,vec2 _p2){
  float weight = 0.004;
  if(_st.x<min(_p1.x,_p2.x)-weight||max(_p1.x,_p2.x)+weight<_st.x) return 0.;
  if(_st.y<min(_p1.y,_p2.y)-weight||max(_p1.y,_p2.y)+weight<_st.y) return 0.;

  float a = (_p1.y-_p2.y)/(_p1.x-_p2.x);
  float b = _p1.y-a*_p1.x;
  float y = a*_st.x+b;// y=ax+b
  float x = (_st.y-b)/a;// x=(y-b)/a

  return smoothstep(y-weight,y,_st.y)-smoothstep(y,y+weight,_st.y) +
         smoothstep(x-weight,x,_st.x)-smoothstep(x,x+weight,_st.x);
}
#pragma glslify: export(line)
