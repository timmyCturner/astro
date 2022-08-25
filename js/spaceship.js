import * as THREE from './node_modules/three/build/three.module.js';
import { GLTFLoader } from './node_modules/three/examples/jsm/loaders/GLTFLoader.js';
  export class SpaceShip {

  constructor(scene,ship){

     //const texture = new THREE.TextureLoader().load( '/assets/textures/Earth.002_diffuse.jpeg' );
     //const material = new THREE.MeshBasicMaterial( { map: texture } );
     const loader = new GLTFLoader();

     loader.load(
    	// resource URL
    	'/assets/SPACE_Fin1.glb',
    	// called when the resource is loaded
    	function ( gltf ) {
        console.log(gltf.scene);
        ship = gltf.scene;
        ship.rotation.x = Math.PI/2+.5

        ship.rotation.z = Math.PI
        ship.position.y=-2
    		scene.add( ship );

      })

     return this;

   }


  }
