import * as THREE from 'three'; // 0.146.0 min
import {createNoise3D} from 'simplex-noise';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
// import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass.js';
// import { SimplifyModifier } from 'three/addons/modifiers/SimplifyModifier.js';

const width = window.innerWidth;
const height = window.innerHeight;

console.error (THREE.REVISION, width, height);

import {get_renderer, toneMapping} from './render.js';
import {
  perspective,
  orthographic,
  orthozoom,
  addShadowedLight,
} from './camera.js';
import {multistl, loader, stlmaterial} from './stl.js';
import {
  cubeMaterial3,
  emissive_std,
  normal,
  seethrough,
  toneMaterial,
  updateMaterial,
  white,
  safety,
  safety2,
  cubeMaterial1,
  cubeMaterial2,
  ws,
  clearcoat,
  clearmesh,
  BasicTexture,
} from './materials.js';
import {onDocumentMouseMove, target, readjust} from './mouseevents.js';

import {msphere} from './test.js';
import {Color, Group} from 'three';

const camera = perspective ([
  50,
  width/height,
  0.01,
  1000,
]);

//orthographic ([-10,10,30,-0,0,100]);
let [canvas, renderer, scene, orbitControls, clock, stats] = get_renderer (
  'canvas#loader',
  camera
);

const texture = toneMapping (THREE, renderer, scene, 'sunset.webp');

const model = new THREE.Group ();
const head = new THREE.Group ();
const lhs = new THREE.Group ({name: 'lhs'});
const rhs = new THREE.Group ({name: 'rhs'});

model.add (head);
scene.add (model);

var dir = 'MeetDan/';
var filelist = 'visor,inner,outer,lhs,rhs,body,helmet,helmetin'
  .split (',')
  .map (m => `${dir}${m}.stl`);

filelist.forEach (f => {
  loader.load (f, function (geometry) {
    var material = normal; //stlmaterial(geometry)
    var mesh = new THREE.Mesh (geometry, material, {
      castShadow: true,
      receiveShadow: true,
    });
    mesh.name = f.match (/[^\/\.]+.stl/g)[0].split ('.stl')[0];
    mesh.geometry.computeVertexNormals ();

    switch (mesh.name) {
      case 'outer':
        mesh.material = safety2;
        mesh.geometry.scale (1.0, 1.0, 2);
        mesh.position.z -= 2.5;
        // mesh.position.y -=0.5
        break;
      case 'visor':
        mesh.material = toneMaterial ();
        break;

      case 'inner':
        // mesh.material = cubeMaterial3
        mesh.geometry.scale (1, 1, 0.96);
        mesh.material = clearcoat (THREE);
        break;
      case 'lhs':
        var bbox = new THREE.Box3 ()
          .setFromObject (mesh)
          .getCenter (new THREE.Vector3 (mesh.position));

        var norm = [bbox.x, 1.3 * bbox.y, bbox.z];
        mesh.position.set (...norm.map (d => -d));
        // add an object as pivot point to the sphere

        lhs.add (mesh);
        lhs.position.set (...norm); //bbox.x,bbox.y,bbox.z)
        mesh.material = clearmesh (THREE);
        return 0;
        break;
      case 'rhs':
        var bbox = new THREE.Box3 ()
          .setFromObject (mesh)
          .getCenter (new THREE.Vector3 (mesh.position));
        var norm = [bbox.x, 1.3 * bbox.y, bbox.z];
        mesh.position.set (...norm.map (d => -d));
        rhs.add (mesh);
        rhs.position.set (...norm);
        mesh.material = clearmesh (THREE);
        return 0;
        break;
      case 'helmetin':
        mesh.material = clearmesh (THREE);
        break;
      case 'body':
        mesh.material = clearmesh (THREE);
      default:
      // code block
    }

    'lhs,rhs,body'.split (',').includes (mesh.name)
      ? model.add (mesh)
      : head.add (mesh);
  });
});

loader.load ('MeetDan/outerbrainsimple.stl', function (geometry) {
  var material = normal.clone();
//   material.flatShading = true
//   material.wireframe = true;
  var mesh = new THREE.Mesh (geometry, material, {
    castShadow: true,
    receiveShadow: true,
    
  });
  var s = 0.05;
  // mesh.rotation.set(Math.PI/2,0,Math.PI*.75)
  mesh.rotateZ (0.5 * Math.PI);
  mesh.position.y -= 1;
  mesh.position.x -= 0.5;
  mesh.scale.set (s, s, s);
  scene.add (mesh);

//   const modifier = new SimplifyModifier();
//   const newgeom = modifier.modify( geometry, 0.1)


  var material = clearmesh (THREE);
  material.wireframe = true;
  var mesh = new THREE.Mesh (geometry, material, {
    castShadow: true,
    receiveShadow: true,
  });
  var s = 0.025;

  mesh.rotateX (-0.5 * Math.PI);
  mesh.position.y += 11;
  mesh.position.z -= 1;
  mesh.scale.set (s, s, s);
  head.add (mesh);
});

loader.load ('MeetDan/innerbrain.stl', function (geometry) {
  var material = normal;
  material.wireframe = true;
  var mesh = new THREE.Mesh (geometry, material, {
    castShadow: true,
    receiveShadow: true,
  });
  var s = 0.025;
  // mesh.rotation.set(Math.PI/2,0,Math.PI*.75)
  // mesh.rotateY(-0.5*Math.PI)
  // mesh.rotateZ(0.5 *Math.PI)
  mesh.rotateX (-0.5 * Math.PI);
  mesh.position.y += 11;
  mesh.position.z -= 1;
  mesh.scale.set (s, s, s);
  head.add (mesh);
});

setTimeout (() => {
  model.add (lhs);
  model.add (rhs);
  scene.add (model);

  addShadowedLight (10, 10, -40, 'white', 11, scene);

  var shinywhite = white;
  shinywhite.emissive = new THREE.Color ('white');
  shinywhite.color = new THREE.Color ('white');
  shinywhite.metalness = 0;
  shinywhite.roughness = 1;
  shinywhite.emissiveIntensity = 110;

  // updateMaterial(model,'outer',)
  updateMaterial (model, 'helmetin', white);



  readjust (head);
  camera.position.set (0, -5, -40);
  camera.lookAt (head.position);
  // model.position.set (0, -10, 0);
  scene.rotateY (Math.PI);

  // model.rotateY(-Math.PI/4)
  addEventListener ('mousemove', onDocumentMouseMove);

  // head.remove(head.getObjectByName('helmetin'))

  //finish loading
  render ();
}, 1500);

window.c = camera;
window.m = model;

//   mesh.position.set (x, y, z);
//   mesh.rotation.set (i, j, k);
//   mesh.scale.set (scale, scale, scale);

window.h = head;







/////////////////////////

var objects_margin =width/ 1000;
var nobj = 200/2;

 var span = nobj*objects_margin
 var wsc = span/100;

//Array
var waveobjects = new Array ();
var elapsed



// ---------------- PARTICLES ----------------
const tloader = new THREE.TextureLoader ();
var particleTexture = tloader.load ('../Sprites/firefly.png');
var spriteMaterial = new THREE.SpriteMaterial ({
  map: particleTexture,
  transparent: true,
//   opacity: .41,
//   color: 0x000000,
  color: new THREE.Color('whitesmoke'),
  side: THREE.FrontSide, 
  blending: THREE.AdditiveBlending,
  depthWrite:false,
  vertexColors:true,
  castShadow: true,
  receiveShadow: true,
});

var simplex = createNoise3D();
var particleSystem = new THREE.Group ();
for (var x = 0; x < nobj*2; x++) {
  for (var z = 0; z < nobj; z++) {
    // Sprite creation
    if (z%2) continue

    // var mat  = spriteMaterial.clone()
    // mat.opacity = (z/nobj)
    var mesh = new THREE.Sprite (spriteMaterial);

    var wscm = wsc*2*(0.1+(z/nobj)**4)

    if (wscm < 0.05) continue
    // if (wscm > 4) continue
    mesh.scale.set (wscm, wscm, wscm); // scale
    mesh.position.x = (x + Math.random ()) * objects_margin; // POSITION X
    mesh.position.y = 0;
    mesh.position.z = z*objects_margin//*(z * objects_margin);

    //POSITION Y
    particleSystem.add (mesh);
    waveobjects.push (mesh);
  }
}

particleSystem.position.set(-span*1,-8,-1.5*span)
// particleSystem.rotateZ(-0.1)
particleSystem.rotateX(Math.PI/9)

scene.add (particleSystem);

window.s = mesh;

function tween(){
    for(var i = 0 ; i < waveobjects.length ; i++)
      {
        var p = waveobjects[i].position
        p.y = (1.2*(p.x/span)**2) * simplex(p.x/10,p.z/10, elapsed/10) * 3;

    // // jitter
    //   if (Math.random()>.5){
    //   waveobjects[i].position.x+= 0.5*(Math.random()-.5)
    //   waveobjects[i].position.z+= 0.5*(Math.random()-.5)
    //   }

      }
}


tween = setInterval(tween, 100);

var renderPass = new RenderPass( scene, camera );
// var bokehPass = new BokehPass( scene, camera, {
//     focus: 1e-4,
//     aperture:	1e-5,
//     maxblur:	0.2,
//     width: width,
//     height: height
// } );
// bokehPass.needsSwap = true;

var composer = new EffectComposer( renderer );
composer.addPass( renderPass );				
// composer.addPass( bokehPass );

function render (mouseevent) {
  requestAnimationFrame (render,renderer.domElement);
//   renderer.render (scene, camera);
composer.render( 0.1 )

  const delta = clock.getDelta ();

  target.z = camera.position.z; // assuming the camera is located at ( 0, 0, z );
  head.lookAt (target);

  const swing = Math.PI / 4 * -Math.sin (Date.now () * 0.005) * 0.8;

  lhs.rotation.set (swing, 0, 0);
  rhs.rotation.set (2 * Math.PI - swing, 0, 0);

  elapsed = clock.elapsedTime;
  
  orbitControls.update ();
  stats.update ();
}
