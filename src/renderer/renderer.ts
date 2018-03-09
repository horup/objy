declare var require:any;
import * as THREE from 'three';
import Input from './input';
import { Geometry } from 'three';
let OBJLoader = require('three-obj-loader');
OBJLoader(THREE);

export default class Renderer
{
    width:number;
    height:number;
    input:Input;
    renderer:THREE.WebGLRenderer;
    camera:THREE.Camera;
    gridScene:THREE.Scene;
    entitiesScene:THREE.Scene;
    textures = {sprites:null as THREE.Texture, walls:null as THREE.Texture};
    constructor()
    {
    }

    private initRenderer()
    {
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.autoClear = false;
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

    }

    group:THREE.Group = null;

    private initTextures()
    {
        let loader = new THREE.TextureLoader();
        let objloader = new THREE.OBJLoader();
      
        objloader.load("old hand drill.obj", (obj:THREE.Group)=>
        {
            this.group = obj;
            let mat = new THREE.MeshNormalMaterial();
            for (let mesh of this.group.children)
            {
            /*    (mesh as THREE.Mesh).geometry.computeBoundingSphere();
                let r = (mesh as THREE.Mesh).geometry.boundingSphere.radius;
                console.log(r);
                let s = 1/r;
                (mesh as THREE.Mesh).scale.set(s, s, s);*/
                (mesh as THREE.Mesh).material = mat;
            }

            this.gridScene.add(this.group);

            this.initRenderer();
            this.animate();
        });
    }

    test = {};

    private syncScene()
    {
       
    }

    private resize()
    {
        if (this.width != window.innerWidth || this.height != window.innerHeight)
        {
            var sphere = new THREE.Box3().setFromObject(this.group).getBoundingSphere();
            this.renderer.setPixelRatio(window.devicePixelRatio);
            this.renderer.setSize(window.innerWidth, window.innerHeight );
            this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 10000);
            this.camera.translateZ(-sphere.radius * 1.25);
            this.camera.lookAt(new THREE.Vector3(0, 0, 0));
        }
    }

    private animate()
    {
        requestAnimationFrame(()=>this.animate());
        this.resize();
        this.input.handle();

        this.syncScene();
        let time = new Date().getTime();
        this.renderer.autoClear = false;
        this.renderer.clear();
        this.renderer.render(this.gridScene, this.camera);
        let elapsed = (new Date().getTime()) - time;
        let s = 0.01;
        this.group.rotateY(s);
    }

  
    init()
    {
        this.input = new Input();
        this.gridScene = new THREE.Scene();
        this.entitiesScene = new THREE.Scene();
        this.initTextures();
    }
}