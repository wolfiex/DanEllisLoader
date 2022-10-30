import './style.css';

import * as THREE from 'three';
import * as TweenMax from './TweenMax.min.js';
// import {rings} from './circledata.js';

console.warn (THREE);

function makebg(){

var canvas = document.querySelector ('canvas#background');
canvas.style.width = window.innerWidth;
canvas.style.height = window.innerHeight;
// canvas.style['backgroundColor'] = '#222';

var width = canvas.offsetWidth, height = canvas.offsetHeight;

var colors = [
  new THREE.Color (0xac1122),
  new THREE.Color (0x96789f),
  new THREE.Color (0x535353),
];

var renderer = new THREE.WebGLRenderer ({
  canvas: canvas,
  antialias: true,
  alpha: true,
});
renderer.setPixelRatio (window.devicePixelRatio > 1 ? 2 : 1);
renderer.setSize (width, height);
renderer.setClearColor (0x000000, 0);

var scene = new THREE.Scene ();

var raycaster = new THREE.Raycaster ();
raycaster.params.Points.threshold = 6;

var camera = new THREE.PerspectiveCamera (50, width / height, 0.1, 2000);
camera.position.set (0, 0, 350);

var galaxy = new THREE.Group ();
scene.add (galaxy);

// Create dots
var loader = new THREE.TextureLoader ();
loader.crossOrigin = '';
var dotTexture = loader.load ('img/dotTexture.png');
var dotsAmount = 4000; //3000;

var dotsGeometryPoints = [];
var dotsGeometry = new THREE.BufferGeometry ();
var positions = new Float32Array (dotsAmount * 3);

//camera.rotation.z=0.25

var sizes = new Float32Array (dotsAmount);
var colorsAttribute = new Float32Array (dotsAmount * 3);
for (var i = 0; i < dotsAmount; i++) {
  var vector = new THREE.Vector3 ();

  vector.color = Math.floor (Math.random () * colors.length);
  vector.theta = Math.random () * Math.PI * 2;
  vector.phi =
    (1 - Math.sqrt (Math.random ())) *
    Math.PI /
    2 *
    (Math.random () > 0.5 ? 1 : -1);

  var n = 12;
  vector.x =
    vector.theta * Math.sin (n * vector.theta) * (Math.cos (vector.phi) * 0.9);
  vector.y =
    vector.theta * Math.cos (n * vector.theta) * (Math.cos (vector.phi) * 0.9);
  vector.z = 0.15;

  vector.multiplyScalar (120 + (Math.random () - 0.5) * 5);
  vector.scaleX = 5;

  if (Math.random () > 0.5) {
    moveDot (vector, i);
  }

  dotsGeometryPoints.push (vector);
  vector.toArray (positions, i * 3);
  colors[vector.color].toArray (colorsAttribute, i * 3);
  sizes[i] = 5;
}
dotsGeometry.setFromPoints (dotsGeometryPoints);
dotsGeometry.setAttribute ('size', sizes);

function moveDot (vector, index) {
  var tempVector = vector.clone ();
  tempVector.multiplyScalar ((Math.random () - 0.5) * 0.2 + 1);
  TweenMax.to (vector, Math.random () * 3 + 3, {
    x: tempVector.x,
    y: tempVector.y,
    z: tempVector.z,
    yoyo: true,
    repeat: -1,
    delay: -Math.random () * 3,
    ease: Power0.easeNone,
    onUpdate: function () {
      attributePositions.array[index * 3] = vector.x;
      attributePositions.array[index * 3 + 1] = vector.y;
      attributePositions.array[index * 3 + 2] = vector.z;
    },
  });
}

var bufferWrapGeom = new THREE.BufferGeometry ();
var attributePositions = new THREE.BufferAttribute (positions, 3);
bufferWrapGeom.setAttribute ('position', attributePositions);

var attributeSizes = new THREE.BufferAttribute (sizes, 1);
bufferWrapGeom.setAttribute ('size', attributeSizes);
var attributeColors = new THREE.BufferAttribute (colorsAttribute, 3);
bufferWrapGeom.setAttribute ('color', attributeColors);

// console.warn(bufferWrapGeom.attributes.position.array)
// bufferWrapGeom.attributes.position.array = bufferWrapGeom.attributes.position.array.map(d=>d-99)
// console.warn(bufferWrapGeom.attributes.position.array)

// bufferWrapGeom.attributes.position.needsUpdate=true

var shaderMaterial = new THREE.ShaderMaterial ({
  uniforms: {
    texture: {
      value: dotTexture,
    },
  },
  vertexShader: document.getElementById ('wrapVertexShader').textContent,
  fragmentShader: document.getElementById ('wrapFragmentShader').textContent,
  transparent: true,
});

var wrap = new THREE.Points (bufferWrapGeom, shaderMaterial);
scene.add (wrap);

// Create white segments
var segmentsGeomPoints = [];
var segmentsGeomColours = [];
var segmentsGeom = new THREE.BufferGeometry ();
var segmentsMat = new THREE.LineBasicMaterial ({
  color: 0xffffff,
  transparent: true,
  opacity: 0.3,
  vertexColors: true, //THREE.VertexColors
});

// .vertices.length
for (i = dotsGeometryPoints.length - 1; i >= 0; i--) {
  vector = dotsGeometryPoints[i];
  for (var j = dotsGeometryPoints.length - 1; j >= 0; j--) {
    if (i !== j && vector.distanceTo (dotsGeometryPoints[j]) < 12) {
      segmentsGeomPoints.push (vector);
      segmentsGeomPoints.push (dotsGeometryPoints[j]);
      segmentsGeomColours.push (...colors[vector.color].toArray ());
      segmentsGeomColours.push (...colors[vector.color].toArray ());
    }
  }
}

segmentsGeom.setFromPoints (segmentsGeomPoints);
segmentsGeom.setAttribute (
  'color',
  new THREE.BufferAttribute (new Float32Array (segmentsGeomColours), 3)
);

console.warn (segmentsGeom);

var segments = new THREE.LineSegments (segmentsGeom, segmentsMat);
galaxy.add (segments);

var hovered = [];
var prevHovered = [];

function render () {
  var i;
  dotsGeometry.attributes.position.needsUpdate = true;
  segmentsGeom.attributes.position.needsUpdate = true;

  raycaster.setFromCamera (mouse, camera);
  var intersections = raycaster.intersectObjects ([wrap]);
  hovered = [];
  if (intersections.length) {
    for (i = 0; i < intersections.length; i++) {
      var index = intersections[i].index;
      hovered.push (index);
      if (prevHovered.indexOf (index) === -1) {
        onDotHover (index);
      }
    }
  }
  for (i = 0; i < prevHovered.length; i++) {
    if (hovered.indexOf (prevHovered[i]) === -1) {
      mouseOut (prevHovered[i]);
    }
  }
  prevHovered = hovered.slice (0);
  attributeSizes.needsUpdate = true;
  attributePositions.needsUpdate = true;
  renderer.render (scene, camera);
}

// console.warn('dg',dotsGeometry)
function onDotHover (index) {
  console.warn (index);

  //   dotsGeometry.attributes.position.a
  attributeSizes.array[index] = 1000; //dotsGeometry.attributes.position.array[index]

  //   dotsGeometry.vertices[index].tl = new TimelineMax();
  //   dotsGeometry.vertices[index].tl.to(dotsGeometry.vertices[index], 1, {
  //     scaleX: 10,
  //     ease: Elastic.easeOut.config(2, 0.2),
  //     onUpdate: function(e) {
  //     console.log(e)
  //       attributeSizes.array[index] = dotsGeometry.vertices[index].scaleX;
  //     }
  //   });
}

function mouseOut (index) {
  //   dotsGeometry.vertices[index].tl.to(dotsGeometry.vertices[index], 0.4, {
  //     scaleX: 5,
  //     ease: Power2.easeOut,
  //     onUpdate: function() {
  //       attributeSizes.array[index] = dotsGeometry.vertices[index].scaleX;
  //     }
  //   });

  attributeSizes.array[index] = 1; //dotsGeometry.attributes.position.array[index]
}

function onResize () {
  canvas.style.width = '';
  canvas.style.height = '';
  width = canvas.offsetWidth;
  height = canvas.offsetHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix ();
  renderer.setSize (width, height);
}

var mouse = new THREE.Vector2 (-100, -100);

function onMouseMove (e) {
  var canvasBounding = canvas.getBoundingClientRect ();
  mouse.x = (e.clientX - canvasBounding.left) / width * 2 - 1;
  mouse.y = -((e.clientY - canvasBounding.top) / height) * 2 + 1;
}

//only when in focus window.requestAnimationFrame(callback);
// ticker is driven by this

function animate (mouseEvent) {
  if (mouseEvent) {
    let xpos = mouseEvent.screenX;
    let ypos = mouseEvent.screenY;
    document.hueangle = Math.atan2 (xpos, ypos) * 360;
    document.querySelector (
      'canvas'
    ).style.filter = `hue-rotate(${document.hueangle}deg)`;
    onMouseMove (mouseEvent);
  }
  //throttle back the frames-per-second to 30
  //TweenMax.ticker.fps(25);
//   TweenMax.ticker.addEventListener ('tick', render);
//   setTimeout (() => {
//     console.log ('stop');
//     //to remove the listener later...
//     TweenMax.ticker.removeEventListener ('tick', render);
//   }, 60000);
render()//once only 

}

animate ({screenX: 82, screenY: 102});
// document.addEventListener ('mousemove', animate);

var resizeTm;
window.addEventListener ('resize', function () {
  resizeTm = clearTimeout (resizeTm);
  resizeTm = setTimeout (onResize, 200);
});

canvas.style.filter = ''
return canvas
};


export {makebg}