import { Container, Sprite, Text, Texture } from 'pixi.js';

export interface IScene {
    container: Container;
    init(): void | Promise<void>;
    update(delta: number): void;
    destroy(): void;
    resize(screenWidth: number, screenHeight: number): void;
}

export type SceneConstructor = new () => IScene;

export interface Emoji {
    name: string;
    url: string;
}

export interface DialogueLine {
    name: CharacterName;
    text: string;
}

export type DialogueSection = {
    type: 'text' | 'emoji' | 'missing_emoji';
    content: string;
};

export interface AvatarData {
    name: string;
    url: string;
    position: 'left' | 'right';
}

export interface MagicWordsData {
    emojies: Emoji[];
    dialogue: DialogueLine[];
    avatars?: AvatarData[];
}

export interface LoadTexturePromiseData {
    name: string;
    texture: Texture;
}

export interface LoadAvatarTextureData extends LoadTexturePromiseData {
    position: 'left' | 'right';
}

export interface LineItem {
    characterName: CharacterName;
    container: Container;
    parts: DialogueSection[];
    characterText: Text;
    partObjects: (Text | Sprite)[];
}

export type CharacterName = 'Sheldon' | 'Penny' | 'Leonard' | 'Neighbour' | 'Narrator';
