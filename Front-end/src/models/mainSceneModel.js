
export default class MainSceneModel{

    departments;
    workerstations;
    workers;
    conveyors;
    lastUpdate;
    date = new Date();
    UPDATE_INTERVAL = 5000;

    constructor(){
        this.lastUpdate = Date.now();
    }

    drawScene(){


    }

    async updateGameState(){

        //fetch state of cluster
        //parse cluster into entities

        if(this.shouldUpdateState()){
            console.log("Polling kubernetes");

            const response = await fetch("http://localhost:5001/get-game-state");
            // console.log(response.status);
            const jsonClusterState = await response.json();
            // console.log(data);

            this.parseClusterState(jsonClusterState);

        }



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

        for(let i = 0; i < pods.length; i++){

            console.log(pods[i]);

        }

    }


}
    
