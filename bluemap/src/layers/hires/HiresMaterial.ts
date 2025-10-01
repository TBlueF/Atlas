import {
    ClampToEdgeWrapping, FrontSide,
    Material,
    NearestFilter,
    NearestMipMapLinearFilter,
    RawShaderMaterial,
    Texture
} from "three";
import { TextureAnimation, TextureAnimationSettings } from "./TextureAnimation.ts"
import { stringToImage } from "../../util.ts"
import HIRES_VERTEX_SHADER from "./HiresVertexShader.glsl?raw"
import HIRES_FRAGMENT_SHADER from "./HiresFragmentShader.glsl?raw"

export function createHiresMaterials(settings: Partial<HiresMaterialSettings>[]): Material[] {
    return settings.map(createHiresMaterial);
}

export function createHiresMaterial(partialSettings: Partial<HiresMaterialSettings>): Material {
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

    const texture = new Texture();
    texture.image = stringToImage(settings.texture);
    texture.anisotropy = 1;
    texture.generateMipmaps = opaque || transparent;
    texture.magFilter = NearestFilter;
    texture.minFilter = texture.generateMipmaps ? NearestMipMapLinearFilter : NearestFilter;
    texture.wrapS = ClampToEdgeWrapping;
    texture.wrapT = ClampToEdgeWrapping;
    texture.flipY = false;
    texture.image.addEventListener("load", () => {
        texture.needsUpdate = true
        animation?.init(texture.image.naturalWidth, texture.image.naturalHeight)
    });

    const material = new RawShaderMaterial();

    material.uniforms = {
        textureImage: { value: texture },
    ...animation?.uniforms,
    };
    material.vertexShader = HIRES_VERTEX_SHADER;
    material.fragmentShader = HIRES_FRAGMENT_SHADER;
    material.transparent = transparent;
    material.depthWrite = true;
    material.depthTest = true;
    material.vertexColors = true;
    material.side = FrontSide;
    material.wireframe = false;
    material.needsUpdate = true;
    if (animation) material.onBeforeRender = () => animation.update();

    return material;
}

export type HiresMaterialSettings = {
    resourcePath: string,
    color: number[],
    halfTransparent: boolean,
    texture: string,
    animation: TextureAnimationSettings
}
