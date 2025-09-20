export const waterfill = `#version 300 es
precision mediump float;

in vec2 v_uv;
out vec4 fragColor;

uniform float u_fillAmount;     // 0.0 = empty, 1.0 = full
uniform float u_time;
uniform vec4  u_waterColor;     // deep water color
uniform vec4  u_surfaceColor;   // lighter surface highlight
uniform float u_opacity;        // overall alpha
uniform float u_waveAmplitude;  // wave height
uniform float u_waveFrequency;  // number of ripples
uniform float u_waveSpeed;      // wave animation speed
uniform float u_noiseAmplitude; // extra noise ripple
uniform float u_highlightSpeed; // speed of moving highlights

// simple noise
float rand(vec2 co) {
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main() {
    vec2 uv = v_uv;

    // animated wave along top edge
    float wave = u_waveAmplitude *
                 sin(uv.x * u_waveFrequency + u_time * u_waveSpeed);

    // random surface noise
    float noise = (rand(uv + u_time) - 0.5) * u_noiseAmplitude;

    // current water height
    float cutoff = u_fillAmount + wave + noise;

    // inside water?
    if (1.0 - uv.y <= cutoff) {
        // depth-based gradient: darker at bottom, lighter near top
        float depth = smoothstep(0.0, 1.0, 1.0 - uv.y);
        vec3 baseColor = mix(u_surfaceColor.rgb, u_waterColor.rgb, depth);

        // subtle animated highlights
        float highlight = 0.1 * sin((uv.x + uv.y) * 10.0 + u_time * u_highlightSpeed);
        baseColor += highlight;

        fragColor = vec4(baseColor, u_opacity);
    } else {
        fragColor = vec4(0.0, 0.0, 0.0, 0.0); // fully transparent above water
    }
}
`;
