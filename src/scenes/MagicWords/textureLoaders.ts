import { AvatarData, Emoji, LoadAvatarTextureData, LoadTexturePromiseData } from '@scenes/Types.ts';
import { Assets, Texture } from 'pixi.js';

// Loads textures for avatars
export const loadAvatarTexture = async (avatar: AvatarData): Promise<LoadAvatarTextureData | null> => {
    await Assets.load({
        alias: avatar.name,
        src: avatar.url,
        format: 'png',
        loadParser: 'loadTextures',
    });

    const texture = Texture.from(avatar.name);
    return {
        name: avatar.name,
        texture,
        position: avatar.position,
    };
};
// Loads textures for emojis
export const loadEmojiTexture = async (emoji: Emoji): Promise<LoadTexturePromiseData | null> => {
    try {
        await Assets.load({
            alias: emoji.name,
            src: emoji.url,
            format: 'png',
            loadParser: 'loadTextures',
        });

        const texture = Texture.from(emoji.name);
        return { name: emoji.name, texture };
    } catch (fetchError) {
        return null;
    }
};
