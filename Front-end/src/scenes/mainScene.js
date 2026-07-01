import Phaser from 'phaser';
import GameControlModel from '../models/gameControlModel.js';
import MainSceneModel from '../models/mainSceneModel.js';

export class MainScene extends Phaser.Scene {

    camera;
    mainSceneModel;
    
    constructor() {
        super({ key: 'MainScene' }); //helps indentify the scene in the game loop
    }

    init() {

        this.camera = this.cameras.main;
        this.camera.setOrigin(0, 0); //Set the camera's reference point to the top-left corner of the scene

        const min_zoom = 0.25;
        const max_zoom = 1;
        const zoom_step = 0.05;

        this.gameControlModel = new GameControlModel(this.camera, this, min_zoom, max_zoom, zoom_step);
        this.mainSceneModel = new MainSceneModel(this);

    }

    preload(){
        this.load.image('bay_door_open', '/assets/bay_door_open.png'); //tells phaser tell load image. Doesnt display it yet. Phaser will cache it for later use
        this.load.image('wall', '/assets/wall_with_spill.png'); //tells phaser tell load image. Doesnt display it yet. Phaser will cache it for later use

    }

    create() {

        const bayDoor = this.add.image(0, 0, 'bay_door_open'); //adds image to the scene at 0,0 in world space
        bayDoor.setOrigin(0.5, 0); // Set origin to top left. Origins are in the center by default (0.5, 0.5)

        // sets the camera position to the left to make sure the centre of the bay door is in the top centre of the screen
        this.camera.scrollX = -(this.camera.width * (1 / this.camera.zoom)) / 2 + bayDoor.width / 2;


        //add walls to the left of bay

        for(let i = 0; i < 10; i++){

            const wall = this.add.image(bayDoor.x + bayDoor.width * (i + 1), 0, 'wall'); 
            wall.setScale(1.17)
            wall.setOrigin(0.5, 0); // Set origin to top left. Origins are in the center by default (0.5, 0.5)

        }

        
        //add walls to the right of bay

        for(let i = 0; i < 10; i++){

            const wall = this.add.image(bayDoor.x - bayDoor.width * (i + 1), 0, 'wall'); 
            wall.setScale(1.17)
            wall.setOrigin(0.5, 0); // Set origin to top left. Origins are in the center by default (0.5, 0.5)

        }


    }

    //60 times a second roughly
    update(){

        this.gameControlModel.updateCameraPosition();
        this.mainSceneModel.updateGameState(); //poll kubernetes cluster
        this.mainSceneModel.drawScene(); //draw state of scene. Decoupled from polling cluster to allow for animations
        
    }
}