
export default class Conveyor {

    entityData;
    entity;
    worldPosition;
    scene;
    width = 100;
    height = 100;

    constructor(scene, podData, x, y){
        
        this.scene = scene;
        this.entityData = podData;

        const workstationArea = this.scene.add.rectangle(
            0,    // x
            0,    // y
            this.width,  // width
            this.height,   // height
            0x000000 // fill color
        );

        this.entity = workstationArea;

    }

}