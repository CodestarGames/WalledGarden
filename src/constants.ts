import { TextStyle } from 'pixi.js';

export const textStyles = {
    MAIN_FONT: 'Courier New',
    get BUTTON(): Partial<TextStyle> {
        return {
            fontFamily: this.MAIN_FONT,
            fontSize: 18,
            fill: 0xffffff,
            align: 'center',
            fontWeight: 'bold',
            dropShadow: true,
            dropShadowColor: '#000000',
            dropShadowAlpha: 0.2,
            dropShadowDistance: 2,
        };
    },

    get DIALOGUE(): Partial<TextStyle> {
        return {
            fontFamily: this.MAIN_FONT,
            fontSize: 20,
            fill: 0x000000,
        };
    },

    get SCENE_TITLE(): Partial<TextStyle> {
        return {
            fontFamily: this.MAIN_FONT,
            fontSize: 36,
            fill: 0xffffff,
            align: 'center',
            dropShadow: true,
            dropShadowColor: '#000000',
            dropShadowBlur: 4,
            dropShadowDistance: 3,
        };
    },

    get LOADING_TEXT(): Partial<TextStyle> {
        return {
            fontFamily: this.MAIN_FONT,
            fontSize: 24,
            fill: 0xffffff,
        };
    },

    get MISSING_EMOJI(): Partial<TextStyle> {
        return {
            ...this.DIALOGUE,
            fill: 0xaaaaaa,
            fontStyle: 'italic',
        };
    },
};

export const aceOfShadowsConf = {
    CARD_WIDTH: 120,
    CARD_HEIGHT: 160,
    STACK_OFFSET_Y: 5,
    NUM_CARDS: 144,
    MOVE_INTERVAL: 1000,
    ANIMATION_DURATION: 2,
    STACK_X_SPACING_FACTOR: 1.05,
};

export const magicWordsConf = {
    API_ENDPOINT: 'https://private-624120-softgamesassignment.apiary-mock.com/v2/magicwords',
    LINE_SPACING: 8,
    EMOJI_SIZE: 20,
    DIALOGUE_PADDING: 15,
    TYPING_SPEED_CHARS_PER_SEC: 15,
};

export const UI_SPACING = 10;
export const SCREEN_EDGE_PADDING = 10;

export const menuSceneLayout = {
    TITLE_Y_FACTOR: 0.2,
};
export const preloaderLayout = {
    TEXT_OFFSET_Y: UI_SPACING,
};

export const flameEmitterConf = {
    alpha: {
        start: 0.92,
        end: 0,
    },
    scale: {
        start: 0.75,
        end: 0.33,
        minimumScaleMultiplier: 2,
    },
    color: {
        start: '#fff191',
        end: '#ff622c',
    },
    speed: {
        start: 500,
        end: 1500,
        minimumSpeedMultiplier: 1,
    },
    acceleration: {
        x: 0,
        y: 0,
    },
    maxSpeed: 0,
    startRotation: {
        min: 270,
        max: 270,
    },
    noRotation: true,
    rotationSpeed: {
        min: 0,
        max: 0,
    },
    lifetime: {
        min: 0.1,
        max: 0.17,
    },
    blendMode: 'normal',
    frequency: 0.00001,
    emitterLifetime: -1,
    maxParticles: 9,
    pos: {
        x: 0,
        y: 0,
    },
    addAtBack: false,
    spawnType: 'circle',
    spawnCircle: {
        x: 0,
        y: 0,
        r: 5,
    },
};
