import * as THREE from 'three';// 0.146.0 min
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import {makebg} from './scriptbg.js';
import {lineMesh,tube,ring} from './lines.js'

const background = makebg ();
// var texture = new THREE.Texture (background);
var texture = new THREE.TextureLoader().load( 'sunset.webp' );

// var pic = 'code.png'
// const loader = new THREE.CubeTextureLoader();
// loader.setPath( '' );

//  texture = loader.load( [
// 	pic, pic,pic,pic,pic,pic
// ] );

console.log(texture)

texture.mapping = 

// THREE.UVMapping
// THREE.CubeReflectionMapping
// THREE.CubeRefractionMapping
// THREE.EquirectangularReflectionMapping
THREE.EquirectangularRefractionMapping
// THREE.CubeUVReflectionMapping


// texture.wrapS = THREE.RepeatWrapping;
// texture.wrapT = THREE.RepeatWrapping;
// texture.repeat.set( 4, 4 );
// texture.magFilter=THREE.NearestFilter
// // texture.anisotropy = 1
texture.generateMipmaps=true


texture.needsUpdate = true;

const width = window.innerWidth;
const height = window.innerHeight;

console.error (THREE.REVISION,width, height);
const canvas = document.querySelector ('canvas#loader');

var renderer = new THREE.WebGLRenderer ({
  canvas: canvas,
  antialias: true,
  alpha: true,
});
renderer.setPixelRatio (window.devicePixelRatio > 1 ? 2 : 1);
renderer.setSize (width, height);
renderer.toneMapping = 
THREE.CineonToneMapping//
// THREE.ACESFilmicToneMapping;
// renderer.toneMappingExposure = 1; 
// renderer.outputEncoding = THREE.sRGBEncoding;
//   renderer.setClearColor (0x000000, 0);

// Set CustomToneMapping to Uncharted2
				// source: http://filmicworlds.com/blog/filmic-tonemapping-operators/

				THREE.ShaderChunk.tonemapping_pars_fragment = THREE.ShaderChunk.tonemapping_pars_fragment.replace(
					'vec3 CustomToneMapping( vec3 color ) { return color; }',
					`#define Uncharted2Helper( x ) max( ( ( x * ( 0.15 * x + 0.10 * 0.50 ) + 0.20 * 0.02 ) / ( x * ( 0.15 * x + 0.50 ) + 0.20 * 0.30 ) ) - 0.02 / 0.30, vec3( 0.0 ) )
					float toneMappingWhitePoint = 1.0;
					vec3 CustomToneMapping( vec3 color ) {
						color *= toneMappingExposure;
						return saturate( Uncharted2Helper( color ) / Uncharted2Helper( vec3( toneMappingWhitePoint ) ) );
					}`
				);




const camera = new THREE.PerspectiveCamera (
  150,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set (5, 0, 0);

const orbitControls = new OrbitControls(camera, renderer.domElement)
orbitControls.enableDamping = true
// orbitControls.autoRotate = true


// const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(328, {
//     generateMipmaps: true,
//     minFilter: THREE.LinearMipmapLinearFilter,
// })
// const cubeCamera = new THREE.CubeCamera(.1, 20, cubeRenderTarget)




const scene = new THREE.Scene ()
// environment: texture,
Object.entries({
    background: texture,// background
    environment:texture,//item
//  mapping:   THREE.EquirectangularReflectionMapping
}).forEach((e)=>scene[e[0]]=e[1])

scene.backgroundBlurriness = 1
scene.needsUpdate = true
 console.log(scene)



// const geometry = new THREE.BoxGeometry (10, 1, 1);

const geometry = new THREE.SphereGeometry(3)
const material = new THREE.MeshStandardMaterial({
    // envMap: cubeRenderTarget.texture,
    // envMap:'none',
    // color:new THREE.Color('black'),
    emissive:new THREE.Color('red'),
    emissiveIntensity:0.0,  
    roughness: .0,
  metalness:2,
  opacity:1,
transparent:  true,
  side: THREE.DoubleSide
})


const cube = new THREE.Mesh (geometry, material, {castShadow: true});
// cube.add(cubeCamera)
scene.add (cube);

camera.lookAt (cube.position);


scene.add(lineMesh())
// scene.add(tube(material))
// scene.add(ring(material))

let segment = ring(material)
segment.rotateY(Math.PI)
scene.add(segment)


// const light1 = new THREE.PointLight()
// light1.position.set(10, 10, 10)
// scene.add(light1)


const light = new THREE.AmbientLight (0x404040); // soft white light
scene.add (light);

// renderer.render (scene, camera);
background.style.filter = '';
background.style.opacity = 0.1;
background.remove()
console.log (canvas);

var clock = new THREE.Clock()
function render () {
  requestAnimationFrame (render);
  // console.log("rendered");
  const delta = clock.getDelta()
    // scene.rotateZ(-3.2 * delta)

    segment.rotateZ(3.*delta)
    if (Math.random()>.7)
    segment.position.z  = ((segment.position.z + 0.03)%4)
    console.log(segment.position)

    if (scene.backgroundBlurriness>.1){
    scene.backgroundBlurriness -= 2e-3
    // cube.material.opacity = scene.backgroundBlurriness - .01
    cube.material.needsUpdate=true
    scene.needsUpdate = true
    }
    // console.log(scene.backgroundBlurriness )

  orbitControls.update()
//   cubeCamera.update(renderer, scene)
  renderer.render (scene, camera);
}

render ();
