precision mediump float;

uniform float time;
uniform vec2 resolution;

vec3 opRep(vec3 _p){
  float c = 2.0;
  vec3 q = mod(_p, c)-0.5*c;
  return q;
}
vec3 opTwist(vec3 _p){
  float c = cos(mod(time*20.0,20.0)*_p.y);
  float s = sin(mod(time*20.0,20.0)*_p.y);
  // float c = cos(10.0*sin(time*4.0)*_p.y);
  // float s = sin(10.0*sin(time*4.0)*_p.y);
  mat2 m = mat2(c, -s, s, c);
  vec3 q = vec3(m*_p.xz, _p.y);
  return q;
}

// vec3 opTx(vec3 _p){
//   // vec3 tx = vec3(cos(time)*5.0,0.,0.);
//   // mat4 m = mat4(
//   //   0., 0., 0., tx.x,
//   //   0., 0., 0., tx.y,
//   //   0., 0., 0., tx.z,
//   //   0., 0., 0., 1.
//   // );
//   // vec3 q = (m*vec4(_p,1.0)).xyz;
//   vec3 q = _p;
//   q.x += cos(time + 3.0 * sin(time + q.z)) * 0.5;
//   q.y += sin(time +3.0 * cos(time + q.z)) * 0.74;
//   return q;
// }

// vec3 opRot(vec3 _p, vec3 _rot){
//   float m11 = cos(_rot.x)*cos(_rot.y)*cos(_rot.z)-sin(_rot.x)*sin(_rot.z);
//   float m12 = -cos(_rot.x)*cos(_rot.y)*sin(_rot.z)-sin(_rot.x)*cos(_rot.z);
//   float m13 = cos(_rot.x)*sin(_rot.y);
//   float m21 = sin(_rot.x)*cos(_rot.y)*cos(_rot.x)+cos(_rot.x)*sin(_rot.z);
//   float m22 = -sin(_rot.x)*cos(_rot.y)*sin(_rot.z)+cos(_rot.x)*cos(_rot.z);
//   float m23 = sin(_rot.x)*sin(_rot.y);
//   float m31 = -sin(_rot.y)*cos(_rot.z);
//   float m32 = sin(_rot.y)*sin(_rot.z);
//   float m33 = cos(_rot.y);
//
//   mat4 m = mat4(
//     m11, m12, m13, 0.,
//     m21, m22, m23, 0.,
//     m31, m32, m33, 0.,
//     0.,  0.,  0.,  1.
//     // m = invert(m);
//   );
//   vec3 q = (m*vec4(_p, 1.0)).xyz;
//   return q;
// }
// vec3 opRot(vec3 _p){
//   vec3 rot = vec3(mod(time*2.0,40.0),0.,0.);
//   return opRot(_p, rot);
// }


vec3 op(vec3 _p){
  vec3 q = _p;
  q = opTwist(q);
  q = opRep(q);
  return q;
}
#pragma glslify: export(op)
