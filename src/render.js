import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {WebGLRenderer, Clock, Scene, AmbientLight} from 'three';
import Stats from 'three/examples/jsm/libs/stats.module';

export function get_renderer (
  canvasid,
  camera,
  w = innerWidth,
  h = innerHeight
) {
  const canvas = document.querySelector (canvasid);
  canvas.width = w
  canvas.height = h;

  const renderer = new WebGLRenderer ({
    canvas: canvas,
    antialias: true,
    alpha: true,
  });
  renderer.setPixelRatio (window.devicePixelRatio > 1 ? 2 : 1);



  renderer.setSize (canvas.width, canvas.height);
  renderer.gammaInput = true;
renderer.gammaOutput = true;

  const orbitControls = new OrbitControls (camera, renderer.domElement);
  orbitControls.enableDamping = true;

  const scene = new Scene ();
  const clock = new Clock ();
  const stats = Stats ();

  const light = new AmbientLight (0x404040); // soft white
  scene.add (light);

  return [canvas, renderer, scene, orbitControls, clock, stats];
}



export function toneMapping (THREE, renderer,scene, background = 'sunset.webp') {
  var texture = new THREE.TextureLoader ().load (background);

  texture.mapping =
    // THREE.UVMapping
    // THREE.CubeReflectionMapping
    // THREE.CubeRefractionMapping
    // THREE.EquirectangularReflectionMapping
    THREE.EquirectangularRefractionMapping;
  // THREE.CubeUVReflectionMapping

  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;

  //

//   renderer.outputEncoding = THREE.sRGBEncoding;

//   renderer.toneMapping = THREE.CineonToneMapping;
  // THREE.ACESFilmicToneMapping;
  // renderer.toneMappingExposure = 1;
  // renderer.outputEncoding = THREE.sRGBEncoding;
  //   renderer.setClearColor (0x000000, 0);

  // Set CustomToneMapping to Uncharted2
  // source: http://filmicworlds.com/blog/filmic-tonemapping-operators/

  THREE.ShaderChunk.tonemapping_pars_fragment = THREE.ShaderChunk.tonemapping_pars_fragment.replace (
    'vec3 CustomToneMapping( vec3 color ) { return color; }',
    `#define Uncharted2Helper( x ) max( ( ( x * ( 0.15 * x + 0.10 * 0.50 ) + 0.20 * 0.02 ) / ( x * ( 0.15 * x + 0.50 ) + 0.20 * 0.30 ) ) - 0.02 / 0.30, vec3( 0.0 ) )
					float toneMappingWhitePoint = 1.0;
					vec3 CustomToneMapping( vec3 color ) {
						color *= toneMappingExposure;
						return saturate( Uncharted2Helper( color ) / Uncharted2Helper( vec3( toneMappingWhitePoint ) ) );
					}`
  );

  Object.entries ({
    background: texture, // background
    environment: texture, //item
    //  mapping:   THREE.EquirectangularReflectionMapping
  }).forEach (e => (scene[e[0]] = e[1]));

  scene.backgroundBlurriness = .15;
  scene.needsUpdate = true;

  return texture
}
function onWindowResize (camera) {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix ();
  
    renderer.setSize (window.innerWidth, window.innerHeight);
  }

function onResize() {
    canvas.style.width = '';
    canvas.style.height = '';
    width = canvas.offsetWidth;
    height = canvas.offsetHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }
  


// export {get_render}r

/*



let [canvas, renderer, scene, orbitControls, clock, stats] = get_renderer('canvas#loader',camera)

function render() {
    requestAnimationFrame(render)
    renderer.render(scene, camera)
    const delta = clock.getDelta()


    orbitControls.update()
    stats.update()

}

render()


*/
