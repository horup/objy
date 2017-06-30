declare var require:any;
import * as THREE from 'three';
import Input from './input';
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
        loader.load("dist/textures/sprites.png", (tex1) => 
        {
            tex1.magFilter = THREE.NearestFilter;
            tex1.minFilter = THREE.NearestFilter;
            loader.load('dist/textures/walls.png', (tex2) => 
            {
                tex2.magFilter = THREE.NearestFilter;
                tex2.minFilter = THREE.NearestFilter;
                this.textures.sprites = tex1;
                this.textures.walls = tex2;

                objloader.load("dist/objs/lpv6.obj", (obj:THREE.Group)=>
                {
                    this.group = obj;
                    let mat = new THREE.MeshNormalMaterial();
                    for (let mesh of this.group.children)
                    {
                        (mesh as THREE.Mesh).material = mat;
                    }

                    this.gridScene.add(this.group);

                    this.initRenderer();
                    this.animate();
                });
            });
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
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 10000);
            this.camera.translateZ(-0);
            this.camera.lookAt(new THREE.Vector3(0, 0, 0));
            this.width = window.innerWidth;
            this.height = window.innerHeight;
        }
    }

    private animate()
    {
        this.resize();
        this.input.handle();

        this.syncScene();
        let time = new Date().getTime();
        this.renderer.autoClear = false;
        this.renderer.clear();
        this.renderer.render(this.gridScene, this.camera);
        this.renderer.render(this.entitiesScene, this.camera);
        requestAnimationFrame(()=>this.animate());
        let elapsed = (new Date().getTime()) - time;
        let s = 0.01;
        this.group.rotateY(s*2);
    }

  
    init()
    {
        this.input = new Input();
        this.gridScene = new THREE.Scene();
        this.entitiesScene = new THREE.Scene();
        this.initTextures();
    }
}