import * as THREE from '/node_modules/three/build/three.module.js';
import { GLTFLoader } from '/node_modules/three/examples/jsm/loaders/GLTFLoader.js';
  export class Asteroids {

  constructor(scene,belt,matrix){

     //const texture = new THREE.TextureLoader().load( '/assets/textures/Earth.002_diffuse.jpeg' );
     //const material = new THREE.MeshBasicMaterial( { map: texture } );
     const loader = new GLTFLoader();

     loader.load(
    	// resource URL
    	'/assets/astro1.glb',
    	// called when the resource is loaded
    	function ( gltf ) {

        const geometry = new THREE.IcosahedronGeometry( 0.5, 3 );
        const material = new THREE.MeshPhongMaterial( { color: 0xffffff } );
        const amount = 5;
        const count = Math.pow( amount, 3 );
        const max = 20
        const color = new THREE.Color();
        const white = new THREE.Color().setHex( 0xffffff );
        belt = new THREE.InstancedMesh( geometry, material, count );

        let i = 0;
        const offset = ( amount - 1 ) / 2;



        for ( let x = 0; x < amount; x ++ ) {

          for ( let y = 0; y < amount; y ++ ) {

            for ( let z = 0; z < amount; z ++ ) {

              matrix.setPosition( getRandomInt(max)-max/2, getRandomInt(max)-max/2, -getRandomInt(max)-max);

              belt.setMatrixAt( i, matrix );
              belt.setColorAt( i, color );

              i ++;

            }

          }

        }

        scene.add( belt );



      })



   }


  }
  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }
