import * as THREE from 'three';
window.THREE = THREE;
const ocModule = require('three/examples/js/controls/OrbitControls');

// @ts-ignore
window.THREE.OrbitControls = ocModule.OrbitControls;

export default THREE;