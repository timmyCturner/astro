
    import * as THREE from '/node_modules/three/build/three.module.js';
    import { OrbitControls } from './node_modules/three/examples/jsm/controls/OrbitControls.js';
    import {SpaceShip} from './js/spaceship.js';
    import { GLTFLoader } from './node_modules/three/examples/jsm/loaders/GLTFLoader.js';
    let camera, scene, renderer, controls, clock;
    let Ship;
    let Belt;
    let Ammo;
    let Score = 0;
    let Game_over = false;
    let Target;
    let mesh,mixer;
    let intersected;
    let idleAction, walkAction, runAction;
    let idleWeight, walkWeight, runWeight;
    let actions, settings;
    const matrix = new THREE.Matrix4();
    const loader = new GLTFLoader();
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2( 1, 1 );

    const color = new THREE.Color();
    const white = new THREE.Color().setHex( 0xffffff );

    init();
    animate();

    function init() {

      camera = new THREE.PerspectiveCamera( 10, window.innerWidth / window.innerHeight, 0.1, 1000 );
      camera.position.set( 0, 0, 50 );

      clock = new THREE.Clock();

      scene = new THREE.Scene();

      //=========================Lighting================================
      const light = new THREE.HemisphereLight( 0xffffff, 0x333333 );
      light.position.set( 0, 0, 0 );
      // scene.add( light );
      //const light = new THREE.AmbientLight( 0x404040 ); // soft white light
      scene.add( light );
      var pointlight = new THREE.PointLight(0xa0a0a0);
      pointlight.position.set(20, 40, 20);
      scene.add(pointlight)

      const dirLight = new THREE.DirectionalLight( 0xffffff );
      dirLight.position.set( - 3, 10, - 10 );
      dirLight.castShadow = true;
      dirLight.shadow.camera.top = 2;
      dirLight.shadow.camera.bottom = - 2;
      dirLight.shadow.camera.left = - 2;
      dirLight.shadow.camera.right = 2;
      dirLight.shadow.camera.near = 0.1;
      dirLight.shadow.camera.far = 40;
      scene.add( dirLight );

      scene.fog = new THREE.Fog( 0x333333, 25, 300 );
      //==========================Load==============================
      //scene.background = new THREE.Color( 0x25037c );
      loadSpaceShip()
      Belt = new THREE.Group();
      loadInitAsteroid()
      Belt.start_time = 0;
      Ammo =  new Object()
      Ammo.group = new THREE.Group()
      scene.add(Ammo.group)
      loadLaser()
      //===========================render=========================
      renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
      renderer.setPixelRatio( window.devicePixelRatio );
      renderer.setSize( window.innerWidth, window.innerHeight );
      renderer.setClearColor( 0x000000, 0 ); // the default
      document.body.appendChild( renderer.domElement );

      controls = new OrbitControls( camera, renderer.domElement );
      controls.enableDamping = false;
      controls.enableZoom = false;
      controls.enablePan = false;
      let x = 0;
      let y = 0;
      let z = 0;
      Target = {
        x,y,z
      }
      // console.log(Target);
      // //controls.screenSpacePanning = false
      // console.log(controls);
      controls.mouseButtons = {
      	LEFT: '',
      	MIDDLE: THREE.MOUSE.DOLLY,
      	RIGHT: THREE.MOUSE.PAN
      }


      window.addEventListener( 'resize', onWindowResize );
      document.addEventListener( 'mousemove', onMouseMove );
      document.addEventListener("click", fireCannon);
      document.onkeypress = KeyCheck;
      document.onkeydown = KeyCheck;
      controls.update()
    }

    function loadSpaceShip(){
      loader.load(
     	// resource URL
     	'/assets/SPACE_Fin1.glb',
     	// called when the resource is loaded
     	function ( gltf ) {
         console.log(gltf.scene);
         Ship = gltf.scene;
         Ship.rotation.x = -Math.PI/2+.5

         //Ship.rotation.z = Math.PI
         Ship.position.y=-2
     		scene.add( Ship );
    })
  }
  function loadLaser(){
    loader.load(
    // resource URL
    '/assets/beam.glb',
    // called when the resource is loaded
    function ( gltf ) {
         Ammo.laser= gltf.scene
      } );
  }
    function onWindowResize() {

      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();

      renderer.setSize( window.innerWidth, window.innerHeight );

    }

    function onMouseMove( event ) {

      event.preventDefault();

      mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
      mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

      shipMove()
    }

    function KeyCheck()
    {
        var KeyID = event.keyCode;

        switch(KeyID)
        {
          //left
          case 37:
          left();
          break;

          case 65:
          left();
          break;

          //up
          case 38:
          up();
          break

          case 87:
          up();
          break

          //right
          case 39:
          right();
          break;

          case 68:
          right();
          break;

          //down
          case 40:
          down();
          break;

          case 83:
          down();
          break;
     }
   }
    function shipMove(){
      Ship.rotation.x = ((mouse.y/(2*Math.PI))+(-Math.PI/2+.5))
      Ship.rotation.z =  -(mouse.x/(Math.PI))
      //Ship.rotation.y = (mouse.x/(2*Math.PI))
      //console.log(Ship.rotation);
      Ship.rotation.y = (Ship.rotation.x-(Math.PI/2+.5))+(Ship.rotation.z-Math.PI)
      //Ship.rotation.y = -Math.sin(mouse.x,mouse.y)/2
    }

    function animate() {

      requestAnimationFrame( animate );

      controls.update();
      //console.log(Belt);
      if (Belt){
        //console.log(Belt);
        if (!Game_over)
            intersectedRay();

      }
      //updateLaserPosistions
      if (!Game_over)
      addAsteroids()
      moveAsteroids()
      updateLasers()
      updateExplode()
      if(Game_over){
        const canvas = document.querySelector('canvas')
        if (canvas.getAttribute('restart') ==  "true"){
          document.querySelector('.game_over').classList.add('hidden')
          Game_over = undefined
          canvas.setAttribute('restart',false)
          document.querySelector('h1 span').setAttribute('value',0)
        }
      }
      // Get the time elapsed since the last frame, used for mixer update (if not in single step mode)
      let mixerUpdateDelta = clock.getDelta();
      // Update the animation mixer, and render this frame
      if (mixer){
          mixer.update( mixerUpdateDelta );
      }
      //render();
      renderer.render( scene, camera );


    }
    /*==========================Fire=====================*/
    function fireCannon(){
      // console.log('fire');
      // console.log(intersected);
      // console.log(Belt);
      if (!Game_over){
        fireLaser()
        if (intersected){
          if (!intersected.object.parent.explode){
            intersected.object.parent.explode = true
            intersected.object.parent.weight = false
            intersected.object.parent.start = clock.getElapsedTime()
            // console.log(document.querySelector("h1 span"));
            let value = parseInt(document.querySelector("h1 span").getAttribute('value'))+100
            // console.log(value);
            document.querySelector("h1 span").setAttribute('value',value)
            document.querySelector("h1 span").innerText = value
          }
        }
      }
    }

    function fireLaser(){
      const ammo = Ammo.laser.clone()
      //belt.position.set(getRandomInt(max)-max/2,getRandomInt(max)-max/2,-getRandomInt(max)-max/2)
      //getRandomInt(max)-max/2
      ammo.position.set(Ship.position.x,Ship.position.y,Ship.position.z)
      ammo.scale.set(2,2,2)

      //ammo.rotation.set(Math.PI/4,Math.PI/4,0)

      ammo.rotation.x = (mouse.y/(2*Math.PI))+(Math.PI/4)
      ammo.rotation.z =  0//-(mouse.x/(Math.PI))+(Math.PI/4)
      ammo.rotation.y = -(mouse.x/(Math.PI))+(Math.PI/4)//-Math.sin(mouse.x,mouse.y)/2

      ammo.mouse = mouse.clone()
      //console.log(mouse);
      Ammo.group.add(ammo)

    }
    /*==================Animamations=====================*/
    function updateLasers(){
      //console.log(Ammo);
      const max_diff=1;
      const t = clock.getElapsedTime()
      for (var i =0;i<Ammo.group.children.length;i++)
      {
        //console.log(Ammo.group.children[i]);
        const rotation_t = Ammo.group.children[i].rotation
        //console.log(rotation_t);
        Ammo.group.children[i].position.x+=Ammo.group.children[i].mouse.x/max_diff//(rotation_t.x/max_diff)
        Ammo.group.children[i].position.y+=Ammo.group.children[i].mouse.y/max_diff
        //Ammo.group.children[i].position.y+=(rotation_t.y/max_diff)
        Ammo.group.children[i].position.z-=1
      }
    }
    function updateExplode(){

      if (Belt){
        //console.log(Belt.children);
        const total = Belt.children.length
        for (let i=0;i<Belt.children.length;i++){
            if (Belt.children[i].explode){
              if (Belt.children[i].explode == true){
                explode(Belt.children[i])

              }
              if ((Belt.children[i].start+0.5)<clock.getElapsedTime()){
                Belt.remove(Belt.children[i])
              }
            }
        }

      }


    }
    function explode(astro,to){
      const total = astro.children.length
      const diff = 50;
      for (let i =1;i<total-1;i++){
        astro.children[i].position.x+=(Math.sin(i/total)/diff)
        astro.children[i].position.y+=(Math.cos(2*i/total)/diff)
        astro.children[i].position.z+=(Math.tan(2*i/(total))/diff)
      }
    }
    /*==========================Targeting======================*/
    function intersectedRay(){
      raycaster.setFromCamera( mouse, camera );

      const intersection = raycaster.intersectObject( Belt );

      if ( intersection.length > 0 ) {

        intersected = intersection[ 0 ];

      }
    }
    /*============================Ateroid Feild=================================*/
    function loadInitAsteroid(){
      loader.load(
      // resource URL
      '/assets/astro2.glb',
      // called when the resource is loaded
      function ( gltf ) {
        Belt.model = gltf.scene.clone()
        loadAsteroid(40,true)
      } );
     //console.log(Belt);
     scene.add( Belt );
    }
    function loadAsteroid(num,first){

        //*=====================Feild of view===================*/
       const max = 80
       console.log(num);
       if (num>30){
         num = 30
       }
       for (let i =0;i<num;i++)
       {
         const belt = Belt.model.clone()
         belt.position.set(getRandomInt(max)-max/2,getRandomInt(max)-max/2,-150-getRandomInt(max)-max/2)
         belt.rotation.set(getRandomInt(360),getRandomInt(360),getRandomInt(360))
         //getRandomInt(max)-max/2
         //belt.position.set(0,0,-20)
         if(!first){
           belt.spawn_time=clock.getElapsedTime()
         }
         else{
           belt.spawn_time=0
         }
         Belt.add(belt)

       }

    }
    function addAsteroids(){
      if (Belt){
        const t = clock.getElapsedTime()
        if ((Belt.start_time+2)<t){
          loadAsteroid(10+(parseInt(t)/2), false)
          Belt.start_time=t
          // console.log(t);
        }
      }
    }
    function moveAsteroids(){
      if (Belt){
        //console.log(Belt.children);
        //const total = Belt.children.length
        for (let i=0;i<Belt.children.length;i++){
          Belt.children[i].position.z+=1;
          if (Belt.children[i].spawn_time+5<clock.getElapsedTime()){
            //console.log('DELETE');
            Belt.remove(Belt.children[i])
          }
          //intersects with ship
          if (Belt.children[i].weight != false){

            if ((Math.abs(Belt.children[i].position.x-Ship.position.x)<5)&&
                (Math.abs(Belt.children[i].position.y-Ship.position.y)<2)&&
                (Math.abs(Belt.children[i].position.z-Ship.position.z)<2))
            {
              // console.log(Belt.children[i].position);
              // console.log((Math.abs(Belt.children[i].position.x-Ship.position.x))<1)
              //console.log(((Belt.children[i].position.y < (Ship.position.y+1))||(Belt.children[i].position.y > (Ship.position.y-1))));
              //console.log(((Belt.children[i].position.z > (Ship.position.z+1))||(Belt.children[i].position.z < (Ship.position.z-1))));
              //console.log(Ship.position.x);
              document.querySelector('.game_over').classList.remove('hidden')
              Game_over = true
            }
          }
        }
      }
    }
    /*=======================Render loop==========================*/
    function render() {

      renderer.render( scene, camera );

    }
    //**********Helper functions********************//
    function getRandomInt(max) {
      return Math.floor(Math.random() * max);
    }
    function getRandomRad(max) {
      return Math.floor(Math.random() * max)/(2*Math.PI);
    }
    function activateAllActions() {
      console.log('activateAllActions');
      actions.forEach( function ( action ) {
        console.log('play');
        action.play();

      } );

    }
    function deactivateAllActions() {
      console.log('deactivateAllActions');
      actions.forEach( function ( action ) {

        action.stop();

      } );

    }

    //*=====================Movment===============*//
    function up(){
      if (Ship.position.y<2){
        camera.position.set(camera.position.x,(camera.position.y-0.25),camera.position.z)
        Ship.position.y+=0.25
      }
    }
    function down(){
      if (Ship.position.y>-2){
        camera.position.set(camera.position.x,(camera.position.y+0.25),camera.position.z)
        Ship.position.y-=0.25
      }
      //camera.update()
    }
    function left(){
      if (Ship.position.x>-3){
        camera.position.set((camera.position.x-0.25),(camera.position.y),camera.position.z)
        Ship.position.x-=0.25
      }
      //camera.target = Target
      //camera.update()
    }
    function right(){
      if (Ship.position.x<3){
        camera.position.set((camera.position.x+0.25),(camera.position.y),camera.position.z)
        Ship.position.x+=0.25
      }
    }
