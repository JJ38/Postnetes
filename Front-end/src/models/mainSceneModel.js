
export default class MainSceneModel{

    departments;
    workerstations;
    workers;
    conveyors;
    lastUpdate;
    date = new Date();

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
        }



    }
    
    shouldUpdateState(){
   
        if((Date.now() - this.lastUpdate) >= 1000){
            this.lastUpdate = Date.now();
            return true;
        }

        return false;

    }
}
    
