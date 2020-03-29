import React, { FC, useState, useEffect } from 'react';

import * as THREE from 'three';
const OrbitControls = require('three-orbit-controls')(THREE)
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import './sass/three-js-practive.sass';

const random = {
    range(min, max) {
        return min + Math.random() * (max-min);
    },
    pick(arr) {
        return arr[Math.round((arr.length - 1) * Math.random())]
    }
}

const palette = [
    '#00bdaa',
    '#400082',
    '#fe346e',
    '#f1e7b6'
]

const settings = {
    animate: true,
    context: 'webgl',
    attributes: {antialias: true} // smooths edges
};

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/ window.innerHeight, 0.1, 1000);
const aspectRatio = window.innerWidth / window.innerHeight;
/*
const camera = new THREE.OrthographicCamera(
    -aspectRatio * window.innerWidth / - 2, 
    aspectRatio * window.innerWidth / 2, 
    window.innerHeight / 2, 
    window.innerHeight / - 2,
    -1000, 
    1000
);
*/

camera.position.set(0, 0, 200); 
camera.lookAt(scene.position);
// camera.position.set(0, 0, 2);

const controls = new OrbitControls(camera);

const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);


renderer.setClearColor('hsl(0, 100%, 80%)', 1.0);



// const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );

const ambietLight = new THREE.AmbientLight('#ff0000')
const directionalLight = new THREE.DirectionalLight('white', 1);

// directionalLight.position.set(0, 0, 2);

scene.add(ambietLight);
scene.add(directionalLight);
/*
const pointLight = new THREE.PointLight('#45caf7', 1, 15.5);
pointLight.position.set(2, 2, -4).multiplyScalar(1.5);
scene.add(pointLight);
*/

const manyCubesScene = () => {
    for (let i = 0; i < 40; i++) {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshStandardMaterial({
            color: random.pick(palette),
        });
        const cube = new THREE.Mesh(geometry, material);
        
        cube.position.set(
            random.range(-1.25, 1), 
            random.range(-1.25, 1.5), 
            random.range(-1.25, 1)
        );
    
        cube.scale.set(
            random.range(0.5, 1), 
            random.range(0.5, 1), 
            random.range(0.5, 1)
        )
    
        cube.scale.multiplyScalar(0.6);
    
        scene.add(cube);
    }
}



const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({
    color: random.pick(palette),
});
const cube = new THREE.Mesh(geometry, material);

cube.position.set(
    0,
    0,
    0
);
cube.scale.set(
    1,
    1,
    1
);

scene.add(cube);


var loader = new GLTFLoader();

loader.load( 'a_heros_revolver/scene.gltf', function ( gltf ) {

	scene.add( gltf.scene );

}, undefined, function ( error ) {

	console.error( error );

} );




const resizeScene = ({ pixelRatio, viewportWidth, viewportHeight }) => {
    /*
    const aspect = viewportWidth / viewportHeight;
    
    const zoom = 1.5;

    camera.left = zoom * aspect;
    camera.right = zoom * aspect;
    camera.top = zoom;
    camera.bottom = -zoom;

    camera.near = -100;
    camera.far = 100;

    camera.position.set(zoom, zoom, zoom);
    camera.lookAt(new THREE.Vector3());

    renderer.setSize(viewportWidth, viewportHeight);
    */
}

window.addEventListener('resize', () => {
    resizeScene({
        pixelRatio: 1,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
    });
});

let x = 0;
let direction = 1;

const renderScene = () => {

    // cube.rotation.x += 0.01;
    // cube.rotation.y += 0.01;

    // controls.update();

    // scene.rotation.x += 0.01;
    // scene.rotation.y += 0.02;
    // scene.rotation.z += 0.04;

    if (direction === 1 && x > 4) {
        direction = -1;
    } else if (direction === -1 && x < -4) {
        direction = 1;
    }

    x += direction * 0.01;

    const y = direction * Math.sqrt(16 -  Math.pow(x, 2));

    cube.position.set(
        x,
        y,
        0
    );

    renderer.render(scene, camera);
    requestAnimationFrame(renderScene);
}

requestAnimationFrame(renderScene);




