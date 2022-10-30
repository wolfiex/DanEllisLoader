import './style.css';


import * as THREE from 'three';

import {rings} from './circledata.js'
import {lineMesh} from './lines.js'
import {fitCameraToCenteredObject} from './fitCamera.js'
console.warn(rings)
// import * as dat from 'lil-gui';


import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {
  GPUComputationRenderer,
} from 'three/examples/jsm/misc/GPUComputationRenderer.js';
import {
  DepthOfFieldEffect,
  EffectComposer,
  EffectPass,
  RenderPass,
  VignetteEffect,
  GlitchEffect,
  NoiseEffect,
  BlendFunction,
  ChromaticAberrationEffect,
  ScanlineEffect,
} from 'postprocessing';
import Stats from 'stats.js';
var stats = new Stats ();
stats.showPanel (0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.getElementById ('instruction').appendChild (stats.dom);

class Sizes extends THREE.EventDispatcher {
  constructor () {
    super ();
    this.update ();
    window.addEventListener ('resize', () => {
      this.update ();
    });
  }


  update () {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.aspect = this.width / this.height;
    this.pixelRatio = Math.min (window.devicePixelRatio, 2);
    this.dispatchEvent ({type: 'resize', target: this});
  }
}

// Canvas
const canvas = document.querySelector ('canvas.webgl');

// Sizes
const sizes = new Sizes ();

// Scene
const scene = new THREE.Scene ();

// Camera
/*
fov — Camera frustum vertical field of view.
aspect — Camera frustum aspect ratio.
near — Camera frustum near plane.
far — Camera frustum far plane.

https://wejn.org/2020/12/cracking-the-threejs-object-fitting-nut/


left — Camera frustum left plane.
right — Camera frustum right plane.
top — Camera frustum top plane.
bottom — Camera frustum bottom plane.
near — Camera frustum near plane.
far — Camera frustum far plane.
*/

// const camera = new THREE.PerspectiveCamera (80, sizes.aspect, 0.1, 500);
// camera.position.set (-50, -50, -100).normalize ().multiplyScalar (320);

const vbsize= 200

const camera = new THREE.OrthographicCamera(-vbsize,vbsize,-vbsize/sizes.aspect,vbsize/sizes.aspect, 1, 100 );

camera.position.set (-0, -0, -50)
camera.lookAt(0,0,0)
// .normalize ()

// .multiplyScalar (320);
scene.add (camera);




scene.add(lineMesh);
camera.lookAt(lineMesh)


// fitCameraToCenteredObject(camera,lineMesh,undefined,OrbitControls)


// Controls
const controls = new OrbitControls (camera, canvas);

controls.target.y = 60;
const controlparams = {
  maxDistance: 800,
  // minPolarAngle: -0.3,
  // maxPolarAngle: Math.PI / 2 - 0.1,
  enablePan: true,
  enableDamping: true,
  autoRotate: false,
};

for (const [key, value] of Object.entries (controlparams)) {
  controls[key] = value;
}

// Renderer
const renderer = new THREE.WebGLRenderer ({
  canvas: canvas,
  powerPreference: 'high-performance',
  antialias: true,
  stencil: false,
  depth: true,
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.physicallyCorrectLights = true;
renderer.outputEncoding = THREE.sRGBEncoding; // need for encoding
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.5;
renderer.setSize (sizes.width, sizes.height);
renderer.setPixelRatio (sizes.pixelRatio);

// Composer
const composer = new EffectComposer (renderer, {
  multisampling: renderer.capabilities.isWebGL2 && sizes.pixelRatio === 1
    ? 2
    : undefined,
});





// const depthOfFieldEffect = new DepthOfFieldEffect(camera, {
//   focusDistance: 0.0,
//   focalLength: .6048,
//   bokehScale: 0.60,
//   height: 480,
// })

const renderPass = new RenderPass (scene, camera);
composer.addPass (renderPass);

// const chromaticAberrationEffect = new ChromaticAberrationEffect();

// const glitchEffect = new GlitchEffect({
//   chromaticAberrationOffset: chromaticAberrationEffect.offset
// });
// const noiseEffect = new NoiseEffect({
//   blendFunction: BlendFunction.COLOR_DODGE
// });

// noiseEffect.blendMode.opacity.value = 0.1;
// const scanlineEffect = new ScanlineEffect({
//   blendFunction: BlendFunction.MULTIPLY,
//   // opacity:.325,
//   density:0.75//.0001,

// // });

// scanlineEffect.blendMode.opacity.value = 0.15;
// noiseEffect.blendMode.opacity.value = 0.04;

// console.log(scanlineEffect,noiseEffect)

// const glitchPass = new EffectPass(camera, glitchEffect);//noiseEffect
// const chromaticAberrationPass = new EffectPass(camera, chromaticAberrationEffect);
// composer.addPass(glitchPass);
// const depthOfFieldPass = new EffectPass(camera, depthOfFieldEffect)
// composer.addPass(depthOfFieldPass);

// composer.addPass (new EffectPass (camera, scanlineEffect,noiseEffect,depthOfFieldEffect));// composer.addPass(chromaticAberrationPass);

// composer.addPass (new EffectPass (camera, new VignetteEffect ()));

// Floor
// const plane = new THREE.Mesh (
//   new THREE.PlaneGeometry (3000, 3000),
//   new THREE.MeshStandardMaterial ({
//     roughness: 1,
//     metalness: 0.7,
//   })
// );
// plane.rotation.x = -Math.PI / 2;
// plane.position.y = -40;
// plane.receiveShadow = true;
// scene.add (plane);

// Lights

const light = new THREE.AmbientLight( 0x404040 ); // soft white light
light.position.set(0,0,0)
scene.add( light );

// const light = new THREE.PointLight( 0xff0000, 1000, 100 );
// light.position.set( 0, 0, 0 );
// scene.add( light );



const directionalLight = new THREE.DirectionalLight (new THREE.Color('white'), 1);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set (2048, 2048);
var lights = {
  near: .1,
  far: 800,
  left: -350,
  right: 350,
  top: 350,
  bottom: -350,
};

for (const [key, value] of Object.entries (lights)) {
  directionalLight.shadow.camera[key] = value;
}

directionalLight.position.set (0,0,0).normalize ().multiplyScalar (1);
scene.add (directionalLight);

const directionalLight2 = new THREE.DirectionalLight ('#ffffff', 4);
directionalLight2.castShadow = true;
directionalLight2.shadow.mapSize.set (2048, 2048);

for (const [key, value] of Object.entries (lights)) {
  directionalLight2.shadow.camera[key] = value;
}

directionalLight2.position.set (3, 2, 0.35).normalize ().multiplyScalar (200);
scene.add (directionalLight2);

scene.add(new THREE.CameraHelper(directionalLight.shadow.camera))


const ambientLight = new THREE.AmbientLight ('#ffffff', 1);
scene.add (ambientLight);

// Background colors
const bgColorLinear = new THREE.Color ('#111').convertSRGBToLinear ();
// plane.material.color = bgColorLinear;
renderer.setClearColor (bgColorLinear);
scene.fog = new THREE.Fog (bgColorLinear, 500, 800);

//////////////







function updateMesh() {
  // Check if the dash is out to stop animate it.
  if (lineMesh.material.uniforms.dashOffset.value < -2) return;

  // Decrement the dashOffset value to animate the path with the dash.
  lineMesh.material.uniforms.dashOffset.value -= 0.01;
}







/////////////

// Resizing
sizes.addEventListener ('resize', () => {
  camera.aspect = sizes.aspect;
  camera.updateProjectionMatrix ();

  renderer.setSize (sizes.width, sizes.height);
  renderer.setPixelRatio (sizes.pixelRatio);

  composer.setSize (sizes.width, sizes.height);
});

// Toggle animation
let isAnimationActive = true;
window.addEventListener ('keyup', event => {
  if (event.key === ' ') {
    isAnimationActive = !isAnimationActive;
  }
});

// Animate
let elapsed = 0;
const clock = new THREE.Clock ();
window.t = clock;

const tick = () => {
  stats.begin ();
  // time since last call to getDelta
  // updateMesh()
  const deltaTime = clock.getDelta ();

  // // GPU Compute
  // if (isAnimationActive) {
  //   particleset.forEach (p => p.update (deltaTime));
  // }

  // Add a bit of a vertical wave
  const elapsed = clock.elapsedTime / 4;

  // Update controls
  controls.update ();
  // Render
  composer.render ();
  stats.end ();

  window.requestAnimationFrame (tick);
};

window.c = camera;

tick ();
