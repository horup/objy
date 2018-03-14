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
    scene:THREE.Scene;
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

        let loader = document.createElement('div');
        loader.className = "loader";
        document.body.appendChild(loader);
        document.body.appendChild(this.renderer.domElement);

    }

    group:THREE.Group = null;

    private initMesh()
    {
        let getParameterByName = (name, url = null) => 
        {
            if (!url) url = window.location.href;
            name = name.replace(/[\[\]]/g, "\\$&");
            var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
                results = regex.exec(url);
            if (!results) return null;
            if (!results[2]) return '';
            return decodeURIComponent(results[2].replace(/\+/g, " "));
        }


        let loader = new THREE.TextureLoader();
        let objloader = new THREE.OBJLoader();
        let mesh = getParameterByName("mesh");
        if (mesh == null)
            mesh = "engine.obj";
        
        objloader.load("meshes/" + mesh, (obj:THREE.Group)=>
        {
            this.group = obj;
            let mat = new THREE.MeshNormalMaterial() as THREE.Material;
            mat.side = THREE.DoubleSide;
            mat = new THREE.MeshStandardMaterial({color:0xa2a2a2});
            for (let mesh of this.group.children)
            {
                (mesh as THREE.Mesh).material = mat;
            }

            this.scene.add(this.group);
            this.scene.background = new THREE.Color(0xffffff);
            this.initRenderer();
            this.animate();
        });
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
        let time = new Date().getTime();
        this.renderer.autoClear = false;
        this.renderer.clear();
        this.renderer.render(this.scene, this.camera);
        let elapsed = (new Date().getTime()) - time;
        let s = 0.01;
        this.group.rotateY(s);
    }

  
    init()
    {
        this.input = new Input();
        this.scene = new THREE.Scene();
        var ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.5);
        this.scene.add( ambientLight );

        var lights = [];
        lights[ 0 ] = new THREE.PointLight( 0xffffff, 1, 0 );
        lights[ 1 ] = new THREE.PointLight( 0xffffff, 1, 0 );
        lights[ 2 ] = new THREE.PointLight( 0xffffff, 1, 0 );

        lights[ 0 ].position.set( 0, 200, 0 );
        lights[ 1 ].position.set( 100, 200, 100 );
        lights[ 2 ].position.set( - 100, - 200, - 100 );

        this.scene.add( lights[ 0 ] );
        this.scene.add( lights[ 1 ] );
        this.scene.add( lights[ 2 ] );
            
        this.initMesh();
    }
}