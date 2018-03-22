precision mediump float;
uniform float time;
uniform vec2 resolution;

// all distance function -------------------------------------------------------------

// Sphere
float sdSphere(vec3 _p, float r){
  return length(_p) - r;
}
float sdSphere(vec3 _p){
  float r = 0.4;
  return length(_p) - r;
}

// unsigned Box
float udBox(vec3 _p, vec3 b){
  return length(max(abs(_p)-b,0.0));
}
float udBox(vec3 _p){
  vec3 _b = vec3(0.4);
  return length(max(abs(_p)-_b,0.0));
}

// unsigned Round Box
float udRoundBox(vec3 _p, vec3 _b, float _r){
  return length(max(abs(_p)-_b,0.0))-_r;
}
float udRoundBox(vec3 _p){
  vec3 _b = vec3(0.4);
  float _r = 0.2;
  return length(max(abs(_p)-_b,0.0))-_r;
}

// singned Box
float sdBox(vec3 _p, vec3 _b){
  return length(max(abs(_p)-_b,0.0));
}
float sdBox(vec3 _p){
  vec3 _b = vec3(0.4);
  return length(max(abs(_p)-_b,0.0));
}

// signed Torus
float sdTorus(vec3 _p, vec2 _t){
  vec2 q = vec2(length(_p.xz)-_t.x, _p.y);
  return length(q)-_t.y;
}
float sdTorus(vec3 _p){
  vec2 _t = vec2(0.3,0.1);
  vec2 q = vec2(length(_p.xz)-_t.x, _p.y);
  return length(q)-_t.y;
}

// signed Cylinder
float sdCylinder(vec3 _p, vec3 _c){
  return length(_p.xz - _c.xy)-_c.z;
}
float sdCylinder(vec3 _p){
  vec3 _c = vec3(0.1,0.1,0.1);
  return length(_p.xz - _c.xy)-_c.z;
}

// signed cone
float sdCone(vec3 _p, vec2 _c){
  vec2 c = normalize(_c);
  float q = length(_p.xy);
  return dot(c, vec2(q, _p.z));
}
float sdCone(vec3 _p){
  vec2 _c = vec2(0.01);
  vec2 c = normalize(_c);
  float q = length(_p.xy);
  return dot(c, vec2(q, _p.z));
}

// signed Plane
float sdPlane(vec3 _p, vec4 _n){
  vec4 n = normalize(_n);
  return dot(_p, n.xyz) + n.w;
}
float sdPlane(vec3 _p){
  vec4 n = normalize(vec4(.3));
  return dot(_p, n.xyz) + n.w;
}

// signed Hexagonal Prism
float sdHexPrism(vec3 _p, vec2 _h){
  vec3 q = abs(_p);
  return max(q.z-_h.y, max((q.x*0.866025 + q.y*0.5), q.y) - _h.x);
}
float sdHexPrism(vec3 _p){
  vec2 _h = vec2(0.3);
  vec3 q = abs(_p);
  return max(q.z-_h.y, max((q.x*0.866025 + q.y*0.5), q.y) - _h.x);
}

// signed Triangular Prism
float sdTriPrism( vec3 _p, vec2 _h ){
  vec3 q = abs(_p);
  return max(q.z-_h.y,max(q.x*0.866025+_p.y*0.5,-_p.y)-_h.x*0.5);
}
float sdTriPrism( vec3 _p){
  vec2 _h = vec2(0.3);
  vec3 q = abs(_p);
  return max(q.z-_h.y,max(q.x*0.866025+_p.y*0.5,-_p.y)-_h.x*0.5);
}

// signed Capsule
float sdCapsule(vec3 _p, vec3 _a, vec3 _b, float _r){
  vec3 pa = _p - _a;
  vec3 ba = _b - _a;
  float h = clamp(dot(pa,ba)/dot(ba,ba), 0., 1.);
  return length(pa - ba*h)-_r;
}
float sdCapsule(vec3 _p){
  vec3 _a,_b;
  _a = vec3(0.2);
  _b = vec3(0.4);
  float _r = 0.3;
  vec3 pa = _p - _a;
  vec3 ba = _b - _a;
  float h = clamp(dot(pa,ba)/dot(ba,ba), 0., 1.);
  return length(pa - ba*h)-_r;
}

// signed Capped Cylinder
float sdCappedCylinder(vec3 _p, vec2 _h){
  vec2 d = abs(vec2(length(_p.xy), _p.y)) - _h;
  return min(max(d.x, d.y), 0.) + length(max(d, 0.));
}
float sdCappedCylinder(vec3 _p){
  vec2 _h = vec2(0.3);
  vec2 d = abs(vec2(length(_p.xy), _p.y)) - _h;
  return min(max(d.x, d.y), 0.) + length(max(d, 0.));
}

// signed Capped Cone
float sdCappedCone( vec3 _p, vec3 _c )
{
  vec2 q = vec2( length(_p.xz), _p.y );
  vec2 v = vec2( _c.z*_c.y/_c.x, -_c.z );
  vec2 w = v - q;
  vec2 vv = vec2( dot(v,v), v.x*v.x );
  vec2 qv = vec2( dot(v,w), v.x*w.x );
  vec2 d = max(qv,0.0)*qv/vv;
  return sqrt( dot(w,w) - max(d.x,d.y) ) * sign(max(q.y*v.x-q.x*v.y,w.y));
}
float sdCappedCone( vec3 _p){
  vec3 _c = vec3(0.4, 0.2, 0.3);
  vec2 q = vec2( length(_p.xz), _p.y );
  vec2 v = vec2( _c.z*_c.y/_c.x, -_c.z );
  vec2 w = v - q;
  vec2 vv = vec2( dot(v,v), v.x*v.x );
  vec2 qv = vec2( dot(v,w), v.x*w.x );
  vec2 d = max(qv,0.0)*qv/vv;
  return sqrt( dot(w,w) - max(d.x,d.y) ) * sign(max(q.y*v.x-q.x*v.y,w.y));
}

// signed ellipsoid
float sdEllipsoid(vec3 _p, vec3 _r){
  return (length(_p/_r)-1.)*min(min(_r.x,_r.y),_r.z);
}
float sdEllipsoid(vec3 _p){
  vec3 _r = vec3(0.3);
  return (length(_p/_r)-1.)*min(min(_r.x,_r.y),_r.z);
}

// unsigned Triangle
float dot2(vec3 _v){ return dot(_v, _v);}
float udTriangle(vec3 _p, vec3 _a, vec3 _b, vec3 _c){
  vec3 ba = _b-_a; vec3 pa = _p-_a;
  vec3 cb = _c-_b; vec3 pb = _p-_b;
  vec3 ac = _a-_c; vec3 pc = _p-_c;
  vec3 nor = cross(ba,ac);

  return sqrt(
    (sign(dot(cross(ba, nor), pa))+
    sign(dot(cross(cb, nor), pb))+
    sign(dot(cross(ac, nor), pc))<2.)
    ?
    min( min(
    dot2(ba*clamp(dot(ba,pa)/dot2(ba),0.0,1.0)-pa),
    dot2(cb*clamp(dot(cb,pb)/dot2(cb),0.0,1.0)-pb)),
    dot2(ac*clamp(dot(ac,pc)/dot2(ac),0.0,1.0)-pc))
    :
    dot(nor,pa)*dot(nor,pa)/dot2(nor)
  );
}
float udTriangle(vec3 _p){
  vec3 _a = vec3(0.1, 0.2, 0.3);
  vec3 _b = vec3(0.2, 0.3, 0.4);
  vec3 _c = vec3(0.3, 0.4, 0.5);

  vec3 ba = _b-_a; vec3 pa = _p-_a;
  vec3 cb = _c-_b; vec3 pb = _p-_b;
  vec3 ac = _a-_c; vec3 pc = _p-_c;
  vec3 nor = cross(ba,ac);

  return sqrt(
    (sign(dot(cross(ba, nor), pa))+
    sign(dot(cross(cb, nor), pb))+
    sign(dot(cross(ac, nor), pc))<2.)
    ?
    min( min(
    dot2(ba*clamp(dot(ba,pa)/dot2(ba),0.0,1.0)-pa),
    dot2(cb*clamp(dot(cb,pb)/dot2(cb),0.0,1.0)-pb)),
    dot2(ac*clamp(dot(ac,pc)/dot2(ac),0.0,1.0)-pc))
    :
    dot(nor,pa)*dot(nor,pa)/dot2(nor)
  );
}

// signed Torus82
float lengthN(vec2 _p, float _n){ return pow(pow(_p.x, _n)+pow(_p.y, _n),1./_n);}
float sdTorus82(vec3 _p, vec2 _t){
  vec2 q = vec2(lengthN(_p.xz, 2.)-_t.x, _p.y);
  return lengthN(q, 8.)-_t.y;
}
float sdTorus82(vec3 _p){
  vec2 _t = vec2(0.5, 0.2);
  vec2 q = vec2(lengthN(_p.xz, 2.)-_t.x, _p.y);
  return lengthN(q, 8.)-_t.y;
}
// signed Torus88
float sdTorus88(vec3 _p, vec2 _t){
  vec2 q = vec2(lengthN(_p.xz, 8.)-_t.x, _p.y);
  return lengthN(q, 8.)-_t.y;
}
float sdTorus88(vec3 _p){
  vec2 _t = vec2(0.5, 0.2);
  vec2 q = vec2(lengthN(_p.xz, 8.)-_t.x, _p.y);
  return lengthN(q, 8.)-_t.y;
}
//---------------------------------------------------------------
// distance operations
// union
float opU(float _d1, float _d2){
  return min(_d1, _d2);
}
// Subtraction
float opS(float _d1, float _d2){
  return max(-_d1, _d2);
}
// Intersection
float opI(float _d1, float _d2){
  return max(_d1, _d2);
}

//---------------------------------------------------------------


// switch distance function
float dFunc(vec3 _p, float _r){
  float ret = 0.;

  // premitive distance function


  float n = mod(floor(_r*1.), 4.);
  if(n<1.) ret += sdSphere(_p);
  // if(n<1.) ret += sdSphere(_p, _r);
  else if(n<2.) ret += sdTorus(_p);
  else/* if(n<3.) */ ret += udBox(_p);
  // else ret = opI(sdTorus88(_p), udBox(_p));
  // ret += udRoundBox(_p);
  // ret += sdBox(_p);

  // ret += sdCylinder(_p);
  // ret += sdCone(_p);
  // ret += sdPlane(_p);
  // ret += sdHexPrism(_p);
  // ret += sdTriPrism(_p);
  // ret += sdCappedCylinder(_p);
  // ret += sdCappedCone(_p);
  // ret += sdEllipsoid(_p);
  // ret += udTriangle(_p);
  // ret += sdTorus82(_p);
  // ret += sdTorus88(_p);



  return ret;
}
#pragma glslify: export(dFunc)
