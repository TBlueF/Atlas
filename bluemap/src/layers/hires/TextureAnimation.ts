import { IUniform } from "three";

export class TextureAnimation {
    readonly settings: TextureAnimationSettings;
    readonly uniforms: TextureAnimationUniforms;

    private frameImages: number;
    private frameDelta: number;
    private frameTime: number;
    private frames: number;
    private frameIndex: number;
    private lastUpdate: number;

    constructor(settingsRaw: Partial<TextureAnimationSettings>) {
        this.settings = {
            interpolate: false,
            width: 1,
            height: 1,
            frametime: 1,
            ...settingsRaw,
        };

        this.frameImages = 1;
        this.frameDelta = 0;
        this.frameTime = this.settings.frametime * 50;
        this.frames = 1;
        this.frameIndex = 0;
        this.lastUpdate = window.performance.now();

        this.uniforms = {
            animationFrameHeight: { value: 1 },
            animationFrameIndex: { value: 0 },
            animationInterpolationFrameIndex: { value: 0 },
            animationInterpolation: { value: 0 },
        };
    }

    init(width: number, height: number) {
        this.frameImages = height / width;
        this.uniforms.animationFrameHeight.value = 1 / this.frameImages;
        this.frames = this.frameImages;
        if (this.settings.frames && this.settings.frames.length > 0) {
            this.frames = this.settings.frames.length;
        } else {
            this.settings.frames = undefined;
        }
    }

    update() {
        const now = window.performance.now();
        this.frameDelta += now - this.lastUpdate;
        this.lastUpdate = now;

        if (this.frameDelta > this.frameTime) {
            this.frameDelta -= this.frameTime;
            this.frameDelta %= this.frameTime;

            this.frameIndex++;
            this.frameIndex %= this.frames;

            if (this.settings.frames) {
                let frame = this.settings.frames[this.frameIndex];
                let nextFrame = this.settings.frames[(this.frameIndex + 1) % this.frames];

                this.uniforms.animationFrameIndex.value = frame.index;
                this.uniforms.animationInterpolationFrameIndex.value = nextFrame.index;
                this.frameTime = frame.time * 50;
            } else {
                this.uniforms.animationFrameIndex.value = this.frameIndex;
                this.uniforms.animationInterpolationFrameIndex.value = (this.frameIndex + 1) % this.frames;
            }
        }

        if (this.settings.interpolate) {
            this.uniforms.animationInterpolation.value = this.frameDelta / this.frameTime;
        }
    }
}

export type TextureAnimationSettings = {
    interpolate: boolean;
    width: number;
    height: number;
    frametime: number;
    frames?: {
        index: number;
        time: number;
    }[];
};

export type TextureAnimationUniforms = {
    animationFrameHeight: IUniform<number>;
    animationFrameIndex: IUniform<number>;
    animationInterpolationFrameIndex: IUniform<number>;
    animationInterpolation: IUniform<number>;
};
