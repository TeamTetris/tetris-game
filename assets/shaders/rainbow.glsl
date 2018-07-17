#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D uMainSampler;
uniform vec2 uResolution;
uniform float uTime;

varying vec2 outTexCoord;

void main()
{
    vec2 uv = gl_FragCoord.xy / uResolution.xy;
    vec3 col = 0.5 + 0.5 * cos(uTime + uv.xyx + vec3(0, 2, 4));
    gl_FragColor = vec4(col, 1.0) * texture2D(uMainSampler, outTexCoord);
}