vec2 rotate(vec2 _p, float _r){
  return mat2(cos(_r), -sin(_r),
              sin(_r), cos(_r)) * _p;
}
#pragma glslify: export(rotate)
