import { Texture } from 'pixi.js';
import { DialogueSection } from '@scenes/Types.ts';

// Parses dialogue text and breaks it down into it's individual parts.
export function parseLine(text: string, textures: Record<string, Texture>): DialogueSection[] {
    const pattern = `\{([^}]+)\}`;
    const regex = new RegExp(pattern, 'g');

    const sections: DialogueSection[] = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
        if (match.index > lastIndex) {
            sections.push({
                type: 'text',
                content: text.substring(lastIndex, match.index),
            });
        }

        const emojiName = match[1];
        if (textures[emojiName]) {
            sections.push({ type: 'emoji', content: emojiName });
        } else {
            if (emojiName === 'affirmative' || emojiName === 'win') {
                if (textures['satisfied']) {
                    sections.push({ type: 'emoji', content: 'satisfied' });
                } else {
                    sections.push({ type: 'missing_emoji', content: emojiName });
                }
            } else {
                sections.push({ type: 'missing_emoji', content: emojiName });
            }
        }
        lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
        sections.push({ type: 'text', content: text.substring(lastIndex) });
    }

    return sections;
}
