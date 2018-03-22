float plot(vec2 uv,float pct){
  return smoothstep(pct-0.02,pct,uv.y)-
         smoothstep(pct,pct+0.02,uv.y);
}
#pragma glslify: export(plot)
