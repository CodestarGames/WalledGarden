# Walled Garden!

This is a coding test submission for a senior game developer position.


## Requirements
- node js
- pnpm


## Setup
Install dependencies:
   ```bash
   pnpm install
   ```


### Development
```bash
pnpm dev
```

### Build
```bash
pnpm build
```


## Directory structure

- `@scenes/`: Contains game and ui scenes

- `@utils`: contains various utilities

- `@assets/`: contains source of assets used


### Tech used

- **Pixi JS version 7**
    - Great development ecosystem
    - A solid player in the browser based gamedev field

- **gsap**
    - A great tweaning library with timeline support

- **barvynkoa/particle-emitter** 
    - A slightly more up to date fork of the pixi js particle emitter


### Possible future improvements
- If there was more time I would make a more all encompasing layout system or use pixi layout.
- Adding sound effects to the Magic Words Scene would up the charm.
- Adding a text effect parser on top of the existing dialogue parser could add some extra polish. Detection of words wrapped with * could be used to emphasize bold text.
- Because of the lack of an editor for working in this, we could look into using phaser editor for shipping/prototyping games faster.
- With extra time I would've applied a displacement filter on the candle and try to mimic it blowing in the wind a little more closely.

