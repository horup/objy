import * as THREE from 'three';

export default class Input
{
    pressed = {};
    mouseDown:boolean = false;
    startMouseX:number = 0;
    startMouseY:number = 0;
    mouseX:number = 0;
    mouseY:number = 0;
    constructor()
    {
        document.body.onmousedown = (e) =>
        {
            this.mouseDown = true;
            this.startMouseX = e.offsetX;
            this.startMouseY = e.offsetY;
            document.body.onmousemove(e);
        }
        document.body.onmouseup = (e) =>
        {
            this.mouseDown = false;
        }
        document.body.onmousemove = (e) =>
        {
            let x = e.offsetX - this.startMouseX;
            let y = e.offsetY - this.startMouseY;
            this.mouseX = x / document.body.clientWidth * 2;
            this.mouseY = y / document.body.clientHeight * 2;
        }

        document.addEventListener('touchstart', (e)=>
        {
            document.body.onmousedown({offsetX:e.touches[0].clientX, offsetY:e.touches[0].clientY} as any);
        });

        document.addEventListener('touchmove', (e)=>
        {
            document.body.onmousemove({offsetX:e.touches[0].clientX, offsetY:e.touches[0].clientY} as any);
        });

        document.addEventListener('touchend', (e)=>
        {
            document.body.onmouseup({offsetX:0, offsetY:0} as any);
        });

        document.body.onkeydown = (e) => {
            this.pressed[e.keyCode] = true;
        }
        document.body.onkeyup = (e) => {
            this.pressed[e.keyCode] = false;
        }
    }

    handle()
    {
     /*   let rotation = 0.05;
        if (this.pressed[37])
            this.state.angleZ += rotation;
        else if (this.pressed[39])
            this.state.angleZ -= rotation;


        let v = new THREE.Vector3();
        let dir = 0;
        if (this.pressed[38])
            dir = 1
        else if (this.pressed[40])
            dir = -1;

        if (this.mouseDown)
        {
            this.state.angleZ += (rotation * -this.mouseX);
            dir = -this.mouseY;
        }

        let vx = Math.cos(this.state.angleZ) * dir;
        let vy = Math.sin(this.state.angleZ) * dir;
        this.state.movement[0] = vx;
        this.state.movement[1] = vy;*/
    }
}