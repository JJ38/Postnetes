

export default class GameControlModel {

    camera;
    scene;
    minZoom;
    maxZoom;
    zoomStep;
    zoom = 1;
    isDragging = false;

    startPointerX = 0;
    startPointerY = 0;
    startCamX = 0;
    startCamY = 0;

    pointer;


    constructor(camera, scene, minZoom, maxZoom, zoomStep) {
        this.camera = camera;
        this.scene = scene;
        this.minZoom = minZoom;
        this.maxZoom = maxZoom;
        this.zoomStep = zoomStep;
        this.zoom = minZoom
        this.camera.zoom = this.zoom;

        this.setUpListeners();
    }

    setUpListeners(){

        this.scene.input.on('wheel', (pointer) => {

            //Calculate new zoom first
            if(pointer.deltaY < 0){
                this.zoom + this.zoomStep > this.maxZoom ? this.zoom = this.maxZoom : this.zoom += this.zoomStep; 
            }else{
                this.zoom - this.zoomStep < this.minZoom ? this.zoom = this.minZoom : this.zoom -= this.zoomStep; 
            }

            // // 2. Get world point BEFORE zooming
            const worldPointBefore = this.camera.getWorldPoint(pointer.x, pointer.y);
            this.camera.zoom = this.zoom;

            //Force camera to re-calculate its internal matrix so getWorldPoint is accurate
            this.camera.preRender(); 

            //Get world point AFTER zooming
            const worldPointAfter = this.camera.getWorldPoint(pointer.x, pointer.y);

            //Calculate offset and apply
            this.camera.scrollX += worldPointBefore.x - worldPointAfter.x;
            this.camera.scrollY += worldPointBefore.y - worldPointAfter.y;

            //Apply the hard top-wall constraint immediately after scrolling
            const topLeftY = this.camera.scrollY;
            if(topLeftY < 0){
                this.camera.scrollY = 0;
            }

        });

        this.scene.input.on('pointerdown', (pointer) => {

            console.log("pointer down");

            this.isDragging = true;

            this.startPointerX = pointer.x;
            this.startPointerY = pointer.y;
            this.startCamX = this.camera.scrollX;
            this.startCamY = this.camera.scrollY;

            this.pointer = pointer;

            //this.calculateDragPosition(pointer, startPointerX, startPointerY, startCamX, startCamY); // Update camera position immediately on pointer down

        });

        this.scene.input.on('pointerup', () => {
            this.isDragging = false;
        });



    }

    calculateDragPosition(){

        console.log(this.pointer);

         // Calculate raw movement
        const dragX = this.pointer.x - this.startPointerX;
        const dragY = this.pointer.y - this.startPointerY;
        
        // ADJUSTED: Divide the movement by the current zoom
        // This ensures that 10 pixels of mouse movement equals 10 pixels of camera movement, 
        // regardless of whether you are zoomed in or out.
        const visibleWorldSpace = this.camera.height; //camera/canvas height * (initial zoom / current zoom).
        const topWallY = visibleWorldSpace - this.camera.height;
        
        const newX = this.startCamX - (dragX / this.camera.zoom);
        const attemptNewY = this.startCamY - (dragY / this.camera.zoom);

        //adjust the camera's scrollY to ensure the top of the bay door is always visible, even when zoomed in
        const newY = Math.max(topWallY, attemptNewY);

        console.log(`newX: ${newX}, newY: ${newY}`);

        this.setCameraPosition(newX, newY);

    }

    updateCameraPosition(){
        
        if(this.isDragging){
            console.log("dragging");
            this.calculateDragPosition();
        }   

    }

    setCameraPosition(x, y) {
        
       this.camera.scrollX = x;
       this.camera.scrollY = y;

    }


}