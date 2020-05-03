import * as THREE from 'three';

export const gameConfig = {
    aspectRatio: 16/9,
    sceneBackground: new THREE.Color( 0x605050 ),
    sceneFog: new THREE.Fog(0x605050, 500, 1000),
}


export const cameraConfig = {
    fieldOfView: 70,
    aspectRatio: gameConfig.aspectRatio,
    minDistance: 1,
    maxDistance: 2000,
}

/*

export const spells = {
    fireball: {
        range: 100, //
        dmg: 1000, // hp
        speed: 15, // m/s
    },
    dmgProgressionFunction: (lvl, baseDmg) => {
        return 
    }
}

*/