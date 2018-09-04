#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D uMainSampler;
uniform vec2 uResolution;
uniform float uTime;
uniform vec3 uTint;
uniform float uZoom;

varying vec2 outTexCoord;

void main()
{
    vec2 uv = (gl_FragCoord.xy * uZoom) / uResolution.xy;
    vec3 col = 0.5 + 0.5 * cos(uTime + uv.xyx + vec3(0, 2, 4));
    gl_FragColor = vec4(col * uTint, 1.0) * texture2D(uMainSampler, outTexCoord);
}