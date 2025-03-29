varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUv;
varying vec4 vColor;

void main() {
    gl_FragColor = vec4(vColor, 1.0);
}
