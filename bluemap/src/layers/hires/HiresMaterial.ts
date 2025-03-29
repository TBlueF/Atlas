import * as THREE from "three";
import HIRES_VERTEX_SHADER from "./HiresVertexShader.glsl?raw"
import HIRES_FRAGMENT_SHADER from "./HiresFragmentShader.glsl?raw"
import { stringToImage } from "../../Util.ts";
import { TextureAnimation, TextureAnimationSettings } from "./TextureAnimation.ts";

export function createHiresMaterials(settings: Partial<HiresMaterialSettings>[]): THREE.Material[] {
    return settings.map(createHiresMaterial);
}

export function createHiresMaterial(partialSettings: Partial<HiresMaterialSettings>): THREE.Material {
    const settings = {
        color: [0.5, 0, 0.5, 1],
        halfTransparent: false,
        texture: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAPklEQVR4Xu3MsQkAMAwDQe2/tFPnBB4gpLhG8MpkZpNkZ6AKZKAKZKAKZKAKZKAKZKAKZKAKWg0XD/UPnjg4MbX+EDdeTUwAAAAASUVORK5CYII=",
        ...partialSettings
    }

    const color = settings.color;
    const opaque = color[3] === 1;
    const transparent = settings.halfTransparent ?? false;
    const animation = settings.animation ? new TextureAnimation(settings.animation) : null;

    const texture = new THREE.Texture();
    texture.image = stringToImage(settings.texture);
    texture.anisotropy = 1;
    texture.generateMipmaps = opaque || transparent;
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = texture.generateMipmaps ? THREE.NearestMipMapLinearFilter : THREE.NearestFilter;
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.flipY = false;
    texture.image.addEventListener("load", () => {
        texture.needsUpdate = true
        animation?.init(texture.image.naturalWidth, texture.image.naturalHeight)
    });

    const material = new THREE.RawShaderMaterial({
        uniforms: {
            textureImage: { value: texture },
            ...animation?.uniforms,
        },
        vertexShader: HIRES_VERTEX_SHADER,
        fragmentShader: HIRES_FRAGMENT_SHADER,
        transparent: transparent,
        depthWrite: true,
        depthTest: true,
        vertexColors: true,
        side: THREE.FrontSide,
        wireframe: false,
    });
    material.needsUpdate = true;
    if (animation) material.onBeforeRender = () => animation.update();

    return material;
}

export interface HiresMaterialSettings {
    resourcePath: string,
    color: (number | undefined)[],
    halfTransparent: boolean,
    texture: string,
    animation: Partial<TextureAnimationSettings>
}
