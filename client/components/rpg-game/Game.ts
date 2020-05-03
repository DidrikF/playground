import * as THREE from 'three';
const lodash = require('lodash');

const OrbitControls = require('three-orbit-controls')(THREE)
// const FBXLoader = require('three-fbx-loader');
import * as FBXLoader from 'three-fbx-loader';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';



// import cannon from 'cannon';

import Stats from 'stats-js';

// import FBXLoader from 'somewhere';
// import OrbitControls from 'somewhere';

import { gameConfig, cameraConfig } from './configs';
import keyCodes from './keycodes';
import { Vector3 } from 'three';

export type Player = {
    object?: THREE.Mesh;
    name?: string;
    speed?: number;
    rotationSpeed?: number;
    cameraPosition?: any;
    direction?: number;
    root?: any;
}

/**
 * 0. Basic structure
 * 1. Create plane
 * 2. Add physics
 * 3. Add ball
 * 4. Add controls of ball
 */


export default class Game {
    /** Main game objects */
    scene: THREE.Scene;
    cameras: { [cameraName: string]: THREE.Camera }
    activeCamera: any;
    lights: { [lightName: string]: THREE.Light };
    renderer: THREE.WebGLRenderer;
    loader: any;
    controls: any;
    container: HTMLElement;
    keyboard: any;

    files: string[];

    /** Player objects */
    player: Player;

    /** Reusable Assets */
    textures: THREE.Texture[];

    /** Other */
    clock: THREE.Clock;
    stats: any;

    cube: THREE.Mesh;

    constructor(containerElm: HTMLElement) {

        this.clock = new THREE.Clock();
    
        this.container = containerElm;

        this.files = [
            'girl.fbx',
            
        ]

        this.init();
    }




    async init() {


        this.initScene();
        this.initWorld();
        this.initLights();
        this.initCameras();
        this.initRenderer();
        this.initControls();


        try {
            const err = await this.initAssets();
            console.log("result from initAssets: ", err)
        } catch (error) {
            console.error('Failed to load assets with error: ', error);   
            return;
        }

        this.initCamera();

        this.initStats()

        this.setupResizeListener();
        this.setupPlayerMovement();
        this.animate(0);
    }   

    initScene() {
        this.scene = new THREE.Scene();
        this.scene.background = gameConfig.sceneBackground;
        this.scene.fog = gameConfig.sceneFog;
    }

    initWorld() {
        const groundMesh = new THREE.Mesh( 
            new THREE.PlaneBufferGeometry( 20, 20 ), 
            new THREE.MeshPhongMaterial( { color: 0x444444, depthWrite: false } ) 
        );
        groundMesh.rotation.x = - Math.PI / 2;
		groundMesh.position.y = -2;
		groundMesh.receiveShadow = true;
        this.scene.add( groundMesh );
    }

    addAxis() {
        
    }


    initLights() {
        const hemisphereLight = new THREE.HemisphereLight( 0xffffff, 0x444444 );
		hemisphereLight.position.set( 0, 200, 0 );
		this.scene.add( hemisphereLight );

		const directionalLight = new THREE.DirectionalLight( 0xffffff );
		directionalLight.position.set( 0, 200, 100 );
        directionalLight.castShadow = true;
        
        // What does this do?
		directionalLight.shadow.mapSize.width = 2048; 
		directionalLight.shadow.mapSize.height = 2048;
        
        // What does this do?
        directionalLight.shadow.camera.top = 3000;
		directionalLight.shadow.camera.bottom = -3000;
		directionalLight.shadow.camera.left = -3000;
		directionalLight.shadow.camera.right = 3000;
		directionalLight.shadow.camera.far = 3000;
        
        this.scene.add( directionalLight );
    }

    

    initCameras() {
        this.cameras = {};

        this.cameras['main'] = new THREE.PerspectiveCamera(
            cameraConfig.fieldOfView,
            cameraConfig.aspectRatio,
            cameraConfig.minDistance,
            cameraConfig.maxDistance
        );

        this.cameras['main'].position.set(6, 6, 6); 
        this.cameras['main'].lookAt(this.scene.position);            
    }

    initRenderer() {
        this.renderer = new THREE.WebGLRenderer( { antialias: true } );
        this.renderer.setPixelRatio( window.devicePixelRatio );
    
        this.updateRendererSize();

		this.renderer.shadowMap.enabled = true;
		this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
        this.renderer.shadowMapDebug = true;
        
        this.container.appendChild( this.renderer.domElement );
    }

    initControls () {
        this.controls = new OrbitControls(this.cameras['main'], this.renderer.domElement);
        this.controls.minDistance = 1;
        this.controls.maxDistance = 1000;

        this.keyboard = {};
    }

    initAssets() {
        this.loader = new FBXLoader();

                
        return new Promise((resolve, reject) => {
            // loadObjects(this.files, this.loader, this.scene);
            
            this.loader.load('./fbx-assets/handgun-bin.fbx', (object) => {
                console.log("object: ", object)
                object.mixer = new THREE.AnimationMixer(object);
                object.castShadow = true;
                object.name = 'Girl';
                object.traverse(child => {
                    if (child.isMesh) {
                        child.castShadow = true;
                        child.receiveShadow = true;
                    }
                })

                
                
                // object.position.set(0, 0, 0);
                // object.scale.set( 2, 2, 2);
                
                this.scene.add(object);
                
                this.player = {
                    name: 'Girl',
                    speed: 3,
                    rotationSpeed: Math.PI / 2,
                    object: object,
                    root: object.mixer.getRoot(),
                };

                resolve();
            }, (progressEvent) => {
                console.log(progressEvent);
            }, (error) => {
                console.error(error)
                reject(error);
            })

        })

    }

    initCamera() {
        const wideCamera = new THREE.Object3D();
        wideCamera.position.set(4, 4, 4);
        wideCamera.parent = this.player.object; // so now the position is relative to the player object?
        
        this.player.cameraPosition = wideCamera;
    }

    initStats() {
        this.stats = new Stats();
        this.stats.showPanel(0);
        this.container.appendChild( this.stats.dom );
    }

    updateRendererSize() { // call something else
        // this.camera.aspect = window.innerWidth / window.innerHeight;
		// this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerWidth * 1/gameConfig.aspectRatio);
    }

    setupPlayerMovement() {
        window.addEventListener('keydown', (e: KeyboardEvent) => {            
            switch(e.key) {
                case 'w':
                    this.keyboard.w = true;
                    break;
                case 's': 
                    this.keyboard.s = true;
                    break;

                case 'd':
                    this.keyboard.d = true;
                    break;

                case 'a':
                    this.keyboard.a = true;
                    break;
            }
        });

        window.addEventListener('keyup', (e: KeyboardEvent) => {
            switch(e.key) {
                case 'w':
                    this.keyboard.w = false;
                    break;
                case 's':
                    this.keyboard.s = false;
                    break;
                case 'd':
                    this.keyboard.d = false;
                    break;
                case 'a': 
                    this.keyboard.a = false;
                    break;
            }

        });
    }


    setupResizeListener() {
        const resizeHandler = lodash.debounce(() => {
            this.updateRendererSize();
        }, 200);

        window.addEventListener('resize', resizeHandler);
    }



    movePlayer(dt){
        this.player.direction = this.player.object.rotation.y % (2*Math.PI);

        // console.log(this.player.object)

        // console.log( 'direction: ', this.player.direction)

        const amountToMove = this.player.speed * dt;
        const amountToMoveInX = Math.cos(this.player.direction) * amountToMove;
        const amountToMoveInZ = Math.sin(this.player.direction) * amountToMove;
        if (this.keyboard.w && !this.keyboard.s) {
            this.player.object.position.x -= amountToMoveInX;
            this.player.object.position.z += amountToMoveInZ;
        } else if (this.keyboard.s && !this.keyboard.w) {
            this.player.object.position.x += amountToMoveInX;
            this.player.object.position.z -= amountToMoveInZ;
        }

        if (this.keyboard.d && !this.keyboard.a) {
            this.player.object.rotation.y -= this.player.rotationSpeed * dt;
        } else if (this.keyboard.a && ! this.keyboard.d) {
            this.player.object.rotation.y += this.player.rotationSpeed * dt;            
        }

	}

    animate(time: number) {
        const cameraFade =  0.01; // what is this? move elsewhere
        const dt = this.clock.getDelta();
        
        this.stats.begin();

        this.movePlayer(dt);

        /* Not working, how to do this? 
        this.cameras['main'].position.lerp(
            this.player.cameraPosition.getWorldPosition(new THREE.Vector3()),
            cameraFade
        );
        */

        const newCameraPosition = this.player.cameraPosition.getWorldPosition(new THREE.Vector3());


        if (true) {
            this.controls.update();
        } else {
            this.cameras['main'].position.set(newCameraPosition.x, newCameraPosition.y, newCameraPosition.z); 
            const playerPosition = this.player.object.position.clone();
            playerPosition.y += 1; // look over the player
            this.cameras['main'].lookAt(playerPosition);

        }



        this.renderer.render( this.scene, this.cameras['main'] );

        this.stats.end();

        window.requestAnimationFrame((time) => this.animate(time));
    }

}


class PlayerControls {

}


/*
const loadObjects = (files, loader, scene) => {
    files.forEach(fileName => {
        loader.load(`fbx-assets/${fileName}`, (object) => {

        });
    }, null, onLoadObjectsError);
}

const onLoadObjectsError = (e) => {
    console.error('Load objects failed with error: ', e);
}
*/

/** Not used atm, but will need later 
getMousePosition(clientX, clientY){
    const pos = new THREE.Vector2();
    pos.x = (clientX / this.renderer.domElement.clientWidth) * 2 - 1;
    pos.y = -(clientY / this.renderer.domElement.clientHeight) * 2 + 1;
    return pos;
}
*/




/* Add a box
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({
    color: 'green'
});
this.cube = new THREE.Mesh(geometry, material);

this.cube.position.set(
    0,
    0,
    0
);
this.cube.scale.set(
    1,
    1,
    1
);

this.scene.add(this.cube);

*/



    /*
    addPlayer() {
        this.player = {
            name: 'Sphere',
            speed: 3,
            rotationSpeed: Math.PI / 2,
        };

        const geometry = new THREE.BoxGeometry(4, 1, 2);
        const material = new THREE.MeshBasicMaterial({ color: 0xff0ff0 }); // new THREE.MeshNormalMaterial( {wireframe: true} );

        this.player.object = new THREE.Mesh( geometry, material );
        // this.player.object.geometry.faces[ 1 ].color.setHex( 0x00ffff ); 

        this.player.object.position.set(0, 0, 0);
        this.player.object.scale.set( 1, 1, 1);

        const wideCamera = new THREE.Object3D();
        wideCamera.position.set(4, 4, 4);
        wideCamera.parent = this.player.object; // so now the position is relative to the player object?
        
        this.player.cameraPosition = wideCamera;
        
        // this.activeCamera = wideCamera; // not needed atm
          
        this.scene.add(this.player.object);
    }


    initPlayerPosition(){
        //cast down
        
        this.player.object.position.x = 0;
        this.player.object.position.y = 0;
        this.player.object.position.z = 0;
        
        
        
        // const dir = new THREE.Vector3(0,-1,0);
        // const pos = this.player.object.position.clone();
        // pos.z = 0;
        // const raycaster = new THREE.Raycaster(pos, dir);
		// const gravity = 30;
		// const box = this.environmentProxy;
		
		// const intersect = raycaster.intersectObject(box);
		// if (intersect.length>0){
			// this.player.object.position.y = pos.y - intersect[0].distance;
		// }
    }
    */
    