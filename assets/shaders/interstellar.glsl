// Adapted from https://www.shadertoy.com/view/Xdl3D2
// License: CC BY-NC-SA 3.0 https://creativecommons.org/licenses/by-nc-sa/3.0/deed.en_US
#ifdef GL_ES
precision mediump float;
#endif

const float tau = 6.28318530717958647692;

uniform sampler2D uMainSampler;
uniform vec2 uResolution;
uniform float uTime;
uniform float uIntensity;
uniform vec3 uColor;

// Gamma correction
#define GAMMA (2.2)

vec3 ToLinear(vec3 col)
{
	// simulate a monitor, converting colour values into light values
	return pow(col, vec3(GAMMA));
}

vec3 ToGamma(vec3 col)
{
	// convert back into colour values, so the correct light will come out of the monitor
	return pow(col, vec3(1.0/GAMMA));
}

vec4 Noise(ivec2 x)
{
	return texture2D(uMainSampler, (vec2(x)+0.5)/(256.0), -100.0);
}

void main()
{
	vec3 ray;
	ray.xy = 2.0*(gl_FragCoord.xy-uResolution.xy*.5)/uResolution.x;
	ray.z = 1.0;
    
	float offset = uTime*.5;	
	float speed2 = uIntensity*4.0;
	float speed = speed2+.1;
	offset += uIntensity*.96;
	offset *= uIntensity * 4.0 + 0.3;
	
	
	vec3 col = vec3(0);
	
	vec3 stp = ray/max(abs(ray.x),abs(ray.y));
	
	vec3 pos = 2.0*stp+.5;
	for ( int i=0; i < 20; i++ )
	{
		float z = Noise(ivec2(pos.xy)).x;
		z = fract(z-offset);
		float d = 50.0*z-pos.z;
		float w = pow(max(0.0,1.0-8.0*length(fract(pos.xy)-.5)),2.0);
		vec3 c = max(vec3(0),vec3(1.0-abs(d+speed2*.5)/speed,1.0-abs(d)/speed,1.0-abs(d-speed2*.5)/speed));
		col += 1.5*(1.0-z)*c*w;
		pos += stp;
	}
	gl_FragColor = vec4(ToGamma(col),1.0);
}