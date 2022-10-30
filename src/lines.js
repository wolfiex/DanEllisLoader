// npm i git+https://github.com/wolfiex/THREE.MeshLine.git

import {MeshLine, MeshStandardMaterial,MeshLineMaterial, MeshLineRaycast} from 'three.meshline';
import {Color, Mesh, BufferGeometry, BufferAttribute, Vector3} from 'three';


import * as THREE from 'three'





function lineMesh (envMap){

  const nbrOfPoints = 1000;
  const tau = 2*Math.PI/nbrOfPoints
const points = [];
for (let i = 0; i < nbrOfPoints; i++) {
  points.push (Math.cos (i*tau ) * 2, Math.sin (i* tau),(i-500)/200);
}

console.log (points);

const vertices = new Float32Array (points);
const geometry = new BufferGeometry ();

geometry.setAttribute ('position', new BufferAttribute (vertices, 3));

console.log (geometry);
const line = new MeshLine ();
line.setGeometry (geometry, {dashArray:[2,1,1,2],width:1})




// Build the material with good parameters to animate it.
const material = new MeshLineMaterial ({
  transparent: false,
  lineWidth: .21,
  color: new Color ('red'),
  dashArray: 0, // always has to be the double of the line
  dashOffset: 0, // start the dash at zero
  dashRatio: 0.75, // visible length range min: 0.99, max: 0.5
});

console.error(material,envMap)

const materialPhong = new THREE.MeshPhongMaterial({
  envMap,
  color: '#aaaaaa',
});

const materialShader = new THREE.ShaderMaterial({
  uniforms: THREE.UniformsUtils.clone(THREE.ShaderLib.phong.uniforms),
  vertexShader: THREE.ShaderLib.phong.vertexShader,
  fragmentShader: THREE.ShaderLib.phong.fragmentShader,
  lights: true
});

materialShader.envMap = envMap;
materialShader.combine = THREE.MultiplyOperation;
materialShader.uniforms.envMap.value = envMap;
materialShader.uniforms.diffuse.value = new THREE.Color('#aaaaaa');
//76,4,70


material.envMap = envMap
// Build the Mesh
return new Mesh (line, material);
}
// lineMesh.position.x = -4.5;




function tube(material,r=1){

  const nbrOfPoints = 1000;
  const tau = 2*Math.PI/nbrOfPoints
const points = [];
for (let i = 0; i < nbrOfPoints; i++) {
  points.push (new THREE.Vector3(Math.cos (i*tau ) * 2, Math.sin (i* tau),(500-i)/200));
}



const curve = new THREE.CatmullRomCurve3( points)

const geometry = new THREE.TubeGeometry(curve,40,.1,4);
// const material = new THREE.MeshNormalMaterial({
//   side: THREE.DoubleSide
// });

 return new THREE.Mesh(geometry, material);


}



function ring(material){

  let inner = 1.2
  let outer = inner+.1
  let theta = 30 
  let phi = 1
  let start = 0
  let end = Math.PI 


const geometry = new THREE.RingGeometry( inner,outer,theta,phi,start,end );
// const material = new THREE.MeshBasicMaterial( { color: 0xffff00, side: THREE.DoubleSide } );
let m = material.clone()

return  new THREE.Mesh( geometry, m );
}

export {lineMesh,tube,ring};
