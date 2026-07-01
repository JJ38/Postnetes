import StandardWorkstation from './entities/standardWorkstation.js';
import STANDARD_WORKDSTATION_WIDTH from './entities/standardWorkstation.js';

export default class MainSceneModel{

    departments = new Map();
    workstations = new Map();
    workers = new Map();
    conveyors;
    lastUpdate;
    date = new Date();
    UPDATE_INTERVAL = 5000;
    scene;
    sceneGrid = [];
    GAME_GRID_SIZE = 100;
    WORKSTATION_SPACING = 1000;

    constructor(scene){
        this.scene = scene;
        this.lastUpdate = Date.now();
    }

    drawScene(){


    }

    async updateGameState(){

        //fetch state of cluster
        //parse cluster into entities

        if(this.shouldUpdateState()){

            const response = await fetch("http://localhost:5001/get-game-state");
            const jsonClusterState = await response.json();

            this.parseClusterState(jsonClusterState);
            console.log(this.workstations);

        }

        //draw all entities


    }
    
    shouldUpdateState(){
   
        if((Date.now() - this.lastUpdate) >= this.UPDATE_INTERVAL){
            this.lastUpdate = Date.now();
            return true;
        }

        return false;

    }


    parseClusterState(jsonClusterState){

        const pods = jsonClusterState['pods'];
        const services = jsonClusterState['services'];

        const clusterPods = pods.map(pod => pod.name);
        const gamePods = Array.from(this.workstations.keys());

        const onlyInCluster = clusterPods.filter(x => !gamePods.includes(x));
        const onlyInGame = gamePods.filter(x => !clusterPods.includes(x));

        console.log(onlyInGame);

        //check for new pods that need to be added to the scene
        for(let i = 0; i < pods.length; i++){

            const podName = pods[i].name;

            //Does pod need adding to game
            if(onlyInCluster.includes(podName)){

                switch (pods[i].labels.app){

                    case "standard-workstation":

                        const coordinates = this.findSpaceForEntity("standard-workstation");
                        console.log("Adding pod to game: " + podName + " at coordinates: " + coordinates.x + ", " + coordinates.y);

                        const standardWorkstation = new StandardWorkstation(this.scene, pods[i], coordinates.x, coordinates.y);
                        this.workstations.set(pods[i].name, standardWorkstation);
                        break;

                }

            }

        }

        onlyInGame.forEach(podName => {
            console.log("Removing pod from game: " + podName);
            this.workstations.get(podName).entity.destroy();
            this.workstations.delete(podName);
        });

    }

    findSpaceForEntity(entityType){


        switch (entityType){

            case "standard-workstation":


                let x = 0;
                const y = 1500;

                const xCoordinates = [];
                const yCoordinates = [];

                //get locations for all current workstations
                this.workstations.forEach((workstation, key) => {
                    const coordinates = workstation.entity.getBounds(); //This coordinate is the top left of the container. This is the same coordinate as the top left of the rectangle that is the workstation area
                    xCoordinates.push(coordinates.x + StandardWorkstation.width / 2); //We want the x coordinate to be the centre of the workstation area, not the left edge
                });

                xCoordinates.sort((a, b) => a - b);

                const freeInlineSpots = [];

                for(let i = 0; i < xCoordinates.length - 1; i++){

                    const distanceBetweenWorkstation = xCoordinates[i + 1] - xCoordinates[i];
                    console.log(distanceBetweenWorkstation);
                    //Is there a gap
                    if(distanceBetweenWorkstation > this.WORKSTATION_SPACING){

                        const numberOfGaps = this.WORKSTATION_SPACING/distanceBetweenWorkstation;

                        for(let j = 0; j < numberOfGaps; j++){

                            freeInlineSpots.push(xCoordinates[i] + (j * this.WORKSTATION_SPACING));

                        }
                        

                    } 
                    
                }

                console.log(xCoordinates);
                console.log(freeInlineSpots);
                //find closest available position to the ingress (bay door)
                if(xCoordinates.length == 0){
                    x = 0;
                    console.log("No workstations in game, placing new workstation at: " + x + ", " + y);
                    return {x: x, y: y};
                }

                if(freeInlineSpots.length == 0){

                    //if the left 
                    if(xCoordinates.length % 2){

                        console.log("xCoordinates[0]: " + xCoordinates[0]);
                        x = xCoordinates[0] - 1000; 
                        
                    }else{
                        console.log("xCoordinates[xCoordinates.length - 1]: " + xCoordinates[xCoordinates.length - 1]);
                        x = xCoordinates[xCoordinates.length - 1] + 1000;
                    }

                }


                return {x: x, y: y};
                break;

        }

    }


}
    
