
export default class StandardWorkstation {

    entityData;
    entity;
    worldPosition;
    scene;
    static width = 500;
    static height = 500;

    constructor(scene, podData, x, y){
        
        this.scene = scene;
        this.entityData = podData;

        const container = this.scene.add.container(x, y);
        const workstationArea = this.scene.add.rectangle(
            0,    // x
            0,    // y
            StandardWorkstation.width,  // width
            StandardWorkstation.height,   // height
            0xff0000 // fill color
        )
        
        const podIP = this.scene.add.text(
            0,
            -(workstationArea.height / 2) + 50, // Position the text below the rectangle
            this.entityData.ip,
            {
                fontSize: "32px",
                color: "#ffffff"
            }
        ).setOrigin(0.5); // Center the text

        const podName = this.scene.add.text(
            0,
            0,
            this.entityData.name,
            {
                fontSize: "24px",
                color: "#ffffff"
            }
        ).setOrigin(0.5);

        container.add([workstationArea, podName, podIP]); //When adding objects to a container its position is now relative to the container

        container.setSize(workstationArea.width, workstationArea.height);

        this.entity = container;

    }

}