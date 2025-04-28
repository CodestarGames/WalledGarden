import { Container, Graphics, Sprite, Text, Texture, Ticker } from 'pixi.js';
import { CharacterName, DialogueSection, LineItem, LoadAvatarTextureData, LoadTexturePromiseData, MagicWordsData } from '@scenes/Types.ts';

import { magicWordsConf, textStyles, UI_SPACING } from '@/constants';
import { parseLine } from '@/utils/dialogueParser';
import { BaseScene } from '@scenes/BaseScene.ts';
import { gsap } from 'gsap';
import { loadAvatarTexture, loadEmojiTexture } from '@scenes/MagicWords/textureLoaders.ts';
import { MenuScene } from '@scenes/MenuScene.ts';

const characterOffset = 180;

export class MagicWordsScene extends BaseScene {
    private loadingText: Text | null = null;
    private dialogueData: MagicWordsData | null = null;
    private emojiTextures: Record<string, Texture> = {};

    private dialogueContainer: Container | null = null;

    private avatarTextures: Record<string, Texture> = {};
    private avatarPositions: Record<string, 'left' | 'right'> = {};

    private linesData: LineItem[] = [];

    private currentLineIndex: number = 0;
    private currentPartIndex: number = 0;
    private currentCharacterIndex: number = 0;
    private lineRevealAccumulator: number = 0;
    private isTypingComplete: boolean = false;

    private readonly TYPING_SPEED_CHARS_PER_SEC: number = 10;
    private readonly DIALOGUE_PADDING = magicWordsConf.DIALOGUE_PADDING;

    private waitingTilNextLine: boolean = false;
    private sprite1: Sprite | null = null;
    private sprite2: Sprite | null = null;
    private sprite3: Sprite | null = null;
    private bg: Graphics | null = null;
    private _currentSpeakerName: string = '';
    get currentSpeakerName(): string {
        return this._currentSpeakerName;
    }

    set currentSpeakerName(value: CharacterName) {
        if (value !== this._currentSpeakerName) {
            let spriteToTween: Sprite | null = null;

            switch (value) {
                case 'Sheldon':
                    spriteToTween = this.sprite1;
                    break;
                case 'Penny':
                    spriteToTween = this.sprite2;
                    break;
                case 'Leonard':
                    spriteToTween = this.sprite3;
                    break;
            }

            if (spriteToTween) {
                const tween = gsap.timeline();
                tween.to(spriteToTween, {
                    y: spriteToTween.position.y - 16,
                    duration: 0.25,
                    repeat: 5,
                    ease: 'expo.out',
                    yoyo: true,
                });
            }
        }
        this._currentSpeakerName = value;
    }

    constructor() {
        super();
        this.container.sortableChildren = true;
    }

    public async init(): Promise<void> {
        this.dialogueData = null;
        this.emojiTextures = {};

        this.loadingText = new Text('Loading resources...', textStyles.LOADING_TEXT);
        this.loadingText.anchor.set(0.5);
        this.container.addChild(this.loadingText);

        this.createBackButton();

        this.resize(this.app.renderer.width, this.app.renderer.height);

        try {
            const res = await fetch(magicWordsConf.API_ENDPOINT);
            this.dialogueData = (await res.json()) as MagicWordsData;

            if (this.loadingText) this.loadingText.text = 'Loading Assets...';

            const emojiLoadPromise = this.loadEmojiTextures();
            const avatarLoadPromise = this.loadAvatarTextures();
            await Promise.all([emojiLoadPromise, avatarLoadPromise]);

            this.bg = new Graphics();
            this.container.addChild(this.bg);

            this.sprite1 = new Sprite(this.avatarTextures['Sheldon']);
            this.container.addChild(this.sprite1);
            this.sprite1.position.x = this.app.renderer.width * 0.5 - this.sprite1.width * 0.5;
            this.sprite1.position.y = this.app.renderer.height - characterOffset;

            this.sprite2 = new Sprite(this.avatarTextures['Penny']);
            this.container.addChild(this.sprite2);
            this.sprite2.position.x = this.app.renderer.width * 0.5 - characterOffset - this.sprite2.width * 0.5;
            this.sprite2.position.y = this.app.renderer.height - characterOffset;

            this.sprite3 = new Sprite(this.avatarTextures['Leonard']);
            this.container.addChild(this.sprite3);
            this.sprite3.position.x = this.app.renderer.width * 0.5 + characterOffset - this.sprite3.width * 0.5;
            this.sprite3.position.y = this.app.renderer.height - characterOffset;

            this.renderDialogue(this.app.renderer.width, this.app.renderer.height);
        } catch (error) {}
    }

    private async loadEmojiTextures(): Promise<void> {
        const emojiTexturePromises = this.dialogueData?.emojies.map(loadEmojiTexture) ?? [];
        const loadedEmojiData = (await Promise.all(emojiTexturePromises)).filter(
            (result): result is LoadTexturePromiseData => result !== null
        );

        loadedEmojiData.forEach((data) => {
            this.emojiTextures[data.name] = data.texture;
        });
    }

    private async loadAvatarTextures(): Promise<void> {
        const avatarTexturePromises = this.dialogueData!.avatars!.map(loadAvatarTexture);
        const loadedAvatarData = (await Promise.all(avatarTexturePromises)).filter(
            (result): result is LoadAvatarTextureData => result !== null
        );

        loadedAvatarData.forEach((data) => {
            this.avatarTextures[data.name] = data.texture;
            this.avatarPositions[data.name] = data.position;
        });
    }

    private renderDialogue(screenWidth: number, screenHeight: number): void {
        this.removeLoadingText();

        this.dialogueContainer = new Container();
        this.container.addChild(this.dialogueContainer);

        this.BuildDialogueRender(screenWidth / 2);

        this.resize(screenWidth, screenHeight);

        this.currentLineIndex = 0;
        this.currentPartIndex = 0;
        this.currentCharacterIndex = 0;
        this.lineRevealAccumulator = 0;
        this.isTypingComplete = false;
    }

    private BuildDialogueRender(width: number): void {
        let currentY = this.DIALOGUE_PADDING;
        let maxContentWidth = 0;
        this.linesData = [];

        const availableWidth = width - 2 * this.DIALOGUE_PADDING;

        for (const line of this.dialogueData!.dialogue) {
            const lineContainer = new Container();
            lineContainer.y = 0;
            lineContainer.x = -32;

            const characterName: CharacterName = line.name || 'Narrator';
            const nameSection: DialogueSection = {
                type: 'text',
                content: `${characterName}: `,
            };

            const messageSections = parseLine(line.text, this.emojiTextures);

            let finalLineSections: DialogueSection[] = [nameSection, ...messageSections];

            let lineCurrentX = this.DIALOGUE_PADDING;
            let maxLineHeight = 0;
            const finalLineObjects: (Text | Sprite)[] = [];
            let nameTextObject: Text | null = null;
            let currentLineWidth = 0;
            let lastSpacingAfter = 0;

            for (const finalLineSection of finalLineSections) {
                let displayObject: Text | Sprite | null = null;
                let partWidthOnly = 0;
                let currentObjectHeight = 0;
                let spacingAfter = 0;

                switch (finalLineSection.type) {
                    case 'text':
                        const style = {
                            ...textStyles.DIALOGUE,
                            wordWrap: true,
                            wordWrapWidth: availableWidth,
                        };
                        const text = new Text('', style);
                        text.text = finalLineSection.content;
                        partWidthOnly = text.width;
                        currentObjectHeight = text.height;
                        text.text = '';
                        spacingAfter = UI_SPACING / 2;
                        displayObject = text;

                        break;
                    case 'emoji':
                        const texture = this.emojiTextures[finalLineSection.content];
                        if (texture) {
                            const sprite = new Sprite(texture);
                            sprite.width = magicWordsConf.EMOJI_SIZE;
                            sprite.height = magicWordsConf.EMOJI_SIZE;
                            sprite.anchor.set(0, 0.5);
                            partWidthOnly = sprite.width;
                            currentObjectHeight = sprite.height;
                            spacingAfter = UI_SPACING / 2;
                            displayObject = sprite;
                            displayObject.alpha = 0;
                        } else {
                            const emojiText = new Text(`[${finalLineSection.content}]`, textStyles.MISSING_EMOJI);

                            emojiText.style.wordWrap = true;
                            emojiText.style.wordWrapWidth = availableWidth;
                            partWidthOnly = emojiText.width;
                            currentObjectHeight = emojiText.height;
                            spacingAfter = UI_SPACING / 2;
                            displayObject = emojiText;
                        }
                        break;
                    case 'missing_emoji':
                        const missingEmojiText = new Text('', textStyles.MISSING_EMOJI);
                        missingEmojiText.text = `[${finalLineSection.content}]`;

                        missingEmojiText.style.wordWrap = true;
                        missingEmojiText.style.wordWrapWidth = availableWidth;
                        partWidthOnly = missingEmojiText.width;
                        currentObjectHeight = missingEmojiText.height;
                        missingEmojiText.text = '';
                        spacingAfter = UI_SPACING / 2;
                        displayObject = missingEmojiText;
                        break;
                }

                if (displayObject) {
                    displayObject.x = lineCurrentX;
                    lineContainer.addChild(displayObject);
                    finalLineObjects.push(displayObject);
                    maxLineHeight = Math.max(maxLineHeight, currentObjectHeight);
                    lineCurrentX += partWidthOnly + spacingAfter;
                    lastSpacingAfter = spacingAfter;
                }
            }

            currentLineWidth = lineCurrentX - lastSpacingAfter - this.DIALOGUE_PADDING;
            maxContentWidth = Math.max(maxContentWidth, currentLineWidth);

            finalLineObjects.forEach((obj, index) => {
                const section = finalLineSections[index];
                if (obj instanceof Text) {
                    obj.y = (maxLineHeight - obj.height) / 2;
                } else if (section.type === 'emoji' && obj instanceof Sprite) {
                    obj.y = maxLineHeight / 2;
                }
            });

            this.linesData.push({
                characterName,
                container: lineContainer,
                parts: finalLineSections,
                characterText: nameTextObject!,
                partObjects: finalLineObjects,
            });

            this.dialogueContainer?.addChild(lineContainer);
            currentY += maxLineHeight + magicWordsConf.LINE_SPACING;
        }
    }

    public update(): void {
        if (this.waitingTilNextLine) return;

        if (this.isTypingComplete || !this.linesData.length || this.currentLineIndex >= this.linesData.length || !this.dialogueContainer) {
            this.isTypingComplete = true;
            return;
        }

        const deltaSeconds = Ticker.shared.deltaMS / 1000;
        this.lineRevealAccumulator += deltaSeconds;
        const timePerChar = 1 / this.TYPING_SPEED_CHARS_PER_SEC;
        const currentLineData = this.linesData[this.currentLineIndex];
        this.currentSpeakerName = this.linesData[this.currentLineIndex].characterName;

        if (this.currentPartIndex >= currentLineData.parts.length) {
            this.currentLineIndex++;
            this.waitingTilNextLine = true;
            setTimeout(() => {
                //destroys the current line container for the next line to come in.
                currentLineData.container.destroy();
                this.waitingTilNextLine = false;
            }, 2000);

            this.currentPartIndex = 0;
            this.currentCharacterIndex = 0;
            this.lineRevealAccumulator = 0;

            if (this.currentLineIndex >= this.linesData.length) {
                this.isTypingComplete = true;
            }

            return;
        }

        const currentSection = currentLineData.parts[this.currentPartIndex];
        const currentDisplayObject = currentLineData.partObjects[this.currentPartIndex];

        if (currentSection.type === 'emoji' && currentDisplayObject instanceof Sprite) {
            if (this.currentCharacterIndex === 0) {
                currentDisplayObject.alpha = 1;
                this.currentCharacterIndex = 1;
            }
            this.currentPartIndex++;
            this.currentCharacterIndex = 0;
            return;
        }

        if (currentDisplayObject instanceof Text) {
            const isMissingEmojiPlaceholder = currentSection.type === 'missing_emoji';
            const targetContent = currentSection.content;
            const targetText = isMissingEmojiPlaceholder ? `[${targetContent}]` : targetContent;
            const targetCharCount = targetText.length;

            if (currentDisplayObject.text.length < targetCharCount) {
                const charsToRevealFloat = this.lineRevealAccumulator / timePerChar;
                const charsToReveal = Math.floor(charsToRevealFloat);

                if (charsToReveal > 0) {
                    const revealCount = Math.min(charsToReveal, targetText.length - currentDisplayObject.text.length);
                    if (revealCount > 0) {
                        currentDisplayObject.text = targetText.substring(0, currentDisplayObject.text.length + revealCount);
                        this.lineRevealAccumulator -= revealCount * timePerChar;
                    }
                }
            } else {
                this.currentPartIndex++;
                this.currentCharacterIndex = 0;
            }
            return;
        }

        this.currentPartIndex++;
        this.currentCharacterIndex = 0;
    }

    public resize(screenWidth: number, screenHeight: number): void {
        if (this.loadingText) {
            this.loadingText.x = screenWidth / 2;
            this.loadingText.y = screenHeight / 2;
        }

        if (this.backBtn) {
            this.backBtn.x = screenWidth - this.backBtn.width - 32;
        }

        if (this.dialogueContainer) {
            this.dialogueContainer.x = screenWidth / 2 - this.dialogueContainer.width / 2;
            this.dialogueContainer.y = screenHeight / 2 - this.dialogueContainer.height / 2;
            if (this.bg) {
                this.bg.clear();
                this.bg
                    .beginFill(0xffffff)
                    .drawRoundedRect(screenWidth * 0.15, screenHeight * 0.33, screenWidth * 0.75, screenHeight * 0.33, 16);
            }

            if (this.sprite1) {
                this.sprite1.position.x = this.app.renderer.width * 0.5 - this.sprite1.width * 0.5;
                this.sprite1.position.y = this.app.renderer.height - characterOffset;
            }
            if (this.sprite2) {
                this.sprite2.position.x = this.app.renderer.width * 0.5 - characterOffset - this.sprite2.width * 0.5;
                this.sprite2.position.y = this.app.renderer.height - characterOffset;
            }

            if (this.sprite3) {
                this.sprite3.position.x = this.app.renderer.width * 0.5 + characterOffset - this.sprite3.width * 0.5;
                this.sprite3.position.y = this.app.renderer.height - characterOffset;
            }
        }
    }

    private removeLoadingText(): void {
        if (this.loadingText) {
            this.container.removeChild(this.loadingText);
            this.loadingText.destroy();
            this.loadingText = null;
        }
    }

    destroy(): void {}
}
