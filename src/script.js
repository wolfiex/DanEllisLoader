import * as THREE from 'three'; // 0.146.0 min

const width = window.innerWidth;
const height = window.innerHeight;

console.error (THREE.REVISION, width, height);

import {get_renderer,toneMapping} from './render.js';
import {perspective,orthographic,orthozoom,addShadowedLight} from './camera.js';
import {multistl,loader,stlmaterial} from './stl.js';
import {emissive_std, normal,toneMaterial,updateMaterial} from './materials.js'
import {onDocumentMouseMove, target,readjust} from './mouseevents.js'

import {msphere} from './test.js';

const camera = perspective([50, window.innerWidth / window.innerHeight, 0.01, 1000])

//orthographic ([-10,10,30,-0,0,100]);
let [canvas, renderer, scene, orbitControls, clock, stats] = get_renderer (
  'canvas#loader',
  camera
);


toneMapping(THREE,renderer,scene,'sunset.webp')


const model = new THREE.Group()
const head = new THREE.Group()
model.add(head)
scene.add(model)


var dir = 'MeetDan/';
var filelist = 'visor,inner,outer,lhs,rhs,body,helmet,helmetin'.split(',').map(m => `${dir}${m}.stl`)

filelist.forEach(f=>{
loader.load(f, function(geometry){
    var material =  normal //stlmaterial(geometry)
    var mesh = new THREE.Mesh(geometry,material,{castShadow:true,receiveShadow:true})
    mesh.name = f.match (/[^\/\.]+.stl/g)[0].split ('.stl')[0]
    mesh.geometry.computeVertexNormals()
    'lhs,rhs,body'.split(',').includes(mesh.name)? model.add(mesh):head.add(mesh)
})
})
// model.position.set(15,-15,0)

// camera.lookAt({
//     "x": 46.118911009865826,
//     "y": -5.912523078614083,
//     "z": 20.93055465363841
// })

setTimeout(() => {
    

scene.add(model)

updateMaterial(model,'visor',toneMaterial())

readjust(head)
camera.position.set (0, -10, 50);
model.position.set (0, -10, 0);
addEventListener('mousemove',onDocumentMouseMove)


},1000)   




         
window.c = camera
window.m = model  
model.rotateY(-Math.PI/4)
  //   mesh.position.set (x, y, z);
  //   mesh.rotation.set (i, j, k);
  //   mesh.scale.set (scale, scale, scale);
  

  

window.h = head

console.log (canvas,head);





function render (mouseevent) {
  requestAnimationFrame (render);
  renderer.render (scene, camera);
  const delta = clock.getDelta ();

  
  target.z = camera.position.z; // assuming the camera is located at ( 0, 0, z );
  head.lookAt(target)
  
  
// //   head.lookAt( target );
// head.rotateX(target.x/1000)
// head.rotateZ(target.y/1000)

// head.setRotationFromAxisAngle(new THREE.Vector3(0,1,0),target.x)
// head.setRotationFromAxisAngle(new THREE.Vector3(0,0,0),target.y)

// console.log(target)

  orbitControls.update ();
  stats.update ();
}

render ();
