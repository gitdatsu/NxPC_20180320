#ifdef GL_ES
precision mediump float;
#endif

float rand1D(float n) {
	return fract(sin(n * 43758.5453));
}

float noise1D(float n){
	float i = floor(n);
	float f = fract(n);

	float u = f * f * f * (10.0 + f * (-15.0 + 6.0 * f));

	return mix(rand1D(i), rand1D(i+1.), u);
}
#pragma glslify: export(noise1D)
