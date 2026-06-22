
import Phaser from 'phaser';
import { MainScene } from './scenes/mainScene.js';

console.log('game.js loaded');

const config = {
    backgroundColor: '#d4d4d4',
    width: "100%",
    height: "100%",
    scene: [MainScene],
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.RESIZE, 
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
}

const game = new Phaser.Game(config); // sets up game loop at 60fps