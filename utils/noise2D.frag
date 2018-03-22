#ifdef GL_ES
precision mediump float;
#endif

vec2 rand2(vec2 st){
    st = vec2( dot(st,vec2(127.1,311.7)),
              dot(st,vec2(269.5,183.3)) );
    return -1.0 + 2.0*fract(sin(st)*43758.5453123);
}

float noise2D(vec2 p){
	vec2 i = floor(p);
	vec2 f = fract(p);

	vec2 u = f * f * f * (10.0 + f * (-15.0 + 6.0 * f));

	return mix( mix( dot( rand2(i + vec2(0.0,0.0) ), f - vec2(0.0,0.0) ),
									 dot( rand2(i + vec2(1.0,0.0) ), f - vec2(1.0,0.0) ), u.x),
							mix( dot( rand2(i + vec2(0.0,1.0) ), f - vec2(0.0,1.0) ),
									 dot( rand2(i + vec2(1.0,1.0) ), f - vec2(1.0,1.0) ), u.x), u.y);
}
#pragma glslify: export(noise2D)
