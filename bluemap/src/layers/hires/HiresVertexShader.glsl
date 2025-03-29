attribute vec4 position;
attribute vec3 normal;
attribute vec2 uv;
attribute vec4 color;

uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUv;
varying vec4 vColor;

void main() {
    vPosition = position;
    vNormal = normal;
    vUv = uv;
    vColor = color;

    gl_Position = projectionMatrix * modelViewMatrix * position;
}
