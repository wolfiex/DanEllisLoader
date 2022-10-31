import {
  MeshStandardMaterial,
  MeshNormalMaterial,
  MeshPhongMaterial,
  MeshLambertMaterial,
  MeshPhysicalMaterial,
  MixOperation,
  Color,
  DoubleSide,
  CanvasTexture,
  TextureLoader,
} from 'three';

const textureLoader = new TextureLoader ();

// https://github.com/mrdoob/three.js/tree/master/examples/textures
export function clearcoat (
  THREE,
  normal = 'Carbon_Normal.png',
  map = 'Carbon.png'
) {
  const normalMap = textureLoader.load (normal);
  normalMap.wrapS = THREE.RepeatWrapping;
  normalMap.wrapT = THREE.RepeatWrapping;

  const diffuse = textureLoader.load (map);
  diffuse.encoding = THREE.sRGBEncoding;
  diffuse.wrapS = THREE.RepeatWrapping;
  diffuse.wrapT = THREE.RepeatWrapping;
  diffuse.repeat.x = 10;
  diffuse.repeat.y = 10;

  return new THREE.MeshPhysicalMaterial ({
    // color:THREE.Color('white'),
    roughness: 0.25,
    reflectivity: 1,
    metalness: 1,
    clearcoat: 2.0,
    clearcoatRoughness: 0.1,

    // use map to get actual texture
    // map: diffuse,
    normalMap: normalMap,
  });
}

export function BasicTexture (THREE,normal = 'Carbon_Normal.png',map='scratchedgold.png') {

    const car = textureLoader.load ('Carbon.png');
    car.encoding = THREE.sRGBEncoding;
    car.wrapS = THREE.RepeatWrapping;
    car.wrapT = THREE.RepeatWrapping;
    car.repeat.x = 10;
    car.repeat.y = 10;

    const map6 = textureLoader.load( 'disturb_argb_mip.dds' );
				map6.anisotropy = 4;

                const cubemap2 = textureLoader.load( 'Mountains_argb_mip.dds', function ( texture ) {

					texture.magFilter = THREE.LinearFilter;
					texture.minFilter = THREE.LinearFilter;
					texture.mapping = THREE.CubeReflectionMapping;
					material5.needsUpdate = true;

				} );

    const normalMap = textureLoader.load (normal);
    normalMap.wrapS = THREE.RepeatWrapping;
    normalMap.wrapT = THREE.RepeatWrapping;
  
    const diffuse = textureLoader.load (map);
    diffuse.encoding = THREE.sRGBEncoding;
    diffuse.wrapS = THREE.RepeatWrapping;
    diffuse.wrapT = THREE.RepeatWrapping;
    diffuse.repeat.x = 1;
    diffuse.repeat.y = 1;
  
    return new THREE.MeshPhysicalMaterial ({
      // color:THREE.Color('white'),
      roughness: 0.5,
      reflectivity: 2,
      metalness: 1,
      clearcoat: 2,
      clearcoatRoughness: 1,
      emissive:new Color('#222'),
      emissiveIntensity:.6,
  
      // use map to get actual texture
    //   roughnessMap: diffuse,
    //   map:cubemap2,

    //   normalMap: map6,
      map:car,
    //   alphaMap: diffuse,
      normalMap:normalMap,
      roughnessMap:diffuse,

    blending: THREE.AdditiveBlending,
    depthTest: true,
    transparent: true,
  });
}

export function clearmesh (THREE,normal = 'scratchedgoldnormal.png',map='scratchedgold.png') {


    const normalMap = textureLoader.load (normal);
    normalMap.wrapS = THREE.RepeatWrapping;
    normalMap.wrapT = THREE.RepeatWrapping;
  
    const diffuse = textureLoader.load (map);
    diffuse.encoding = THREE.sRGBEncoding;
    diffuse.wrapS = THREE.RepeatWrapping;
    diffuse.wrapT = THREE.RepeatWrapping;
    diffuse.repeat.x = 10;
    diffuse.repeat.y = 10;
  
    return new THREE.MeshPhysicalMaterial ({
      emissive:new THREE.Color('black'),
      emissiveIntensity:.02,

      roughness: .25,
      reflectivity: 1.,
      metalness: 1,
      clearcoat: 1.0,
      clearcoatRoughness: 0,
      // use map to get actual texture
      map: diffuse,

      normalMap: normalMap,
      alphaMa:diffuse,

    blending: THREE.AdditiveBlending,
    depthTest: true,
    transparent: true,
  });
}


export const emissive_std = new MeshStandardMaterial ({
  wireframe: true,

  emissive: new Color ('red'),
  emissiveIntensity: 0.3,
  roughness: 0.0,
  metalness: 2,
  opacity: 1,
  transparent: true,
  side: DoubleSide,
});

export const normal = new MeshNormalMaterial ();

export function toneMaterial (
  rough = 0,
  metal = 2,
  colour = new Color ('blue'),
  intensity = 0.1,
  opacity = 1
) {
  return new MeshStandardMaterial ({
    emissive: colour,
    emissiveIntensity: intensity,
    roughness: rough,
    metalness: metal,
    opacity: opacity,
    transparent: true,
    side: DoubleSide,
  });
}

export const cubeMaterial3 = new MeshLambertMaterial ({
  color: 0xff6600,
  emissive: 0xff6600,
  // envMap: reflectionCube,
  combine: MixOperation,
  reflectivity: 0.3,
});
export const cubeMaterial2 = new MeshLambertMaterial ({
  color: 0xffee00,
  emissive: 0xffee00,
  // envMap: refractionCube,
  refractionRatio: 0.05, //.95
});
export const cubeMaterial1 = new MeshLambertMaterial ({
  color: 0xffffff,
  // envMap: reflectionCube,
});

export const safety = new MeshStandardMaterial ({
  emissive: new Color ('rgb(144,46,57)'),
  color: new Color ('rgb(144,46,57)'),
  roughness: 0,
  metalness: 0.0,
  opacity: 0.1,
});

export const safety2 = new MeshPhysicalMaterial ({
  emissive: new Color ('rgb(144,46,57)'),
  color: new Color ('rgb(144,46,57)'),
  roughness: 0.7,
  reflectivity: 1,
  metalness: 1,
  clearcoat: 2.0,
  clearcoatRoughness: 1.1,
  // map: diffuse,
  // normalMap: normalMap
});

export const ws = new MeshStandardMaterial ({
  color: new Color ('whitesmoke'),
  roughness: 2,
  metalness: 0.91,
  opacity: 0.1,
});

export const white = new MeshStandardMaterial ({
  roughness: 1.1,
  // metalness: 0.1,
  opacity: 0.1,
});

export const seethrough = new MeshPhongMaterial ({
  color: 0xccddff,
  // envMap: refractionCube,
  refractionRatio: 0.8,
  reflectivity: 0.9,
  metalness: 2,
  roughness: 0,
  opacity: 0.1,
  transparent: true,
});

//   var material = new THREE.MeshStandardMaterial({color: “#000”, roughness: 0});
//   var envMap = new THREE.TextureLoader().load('shinyenvMap.png');
//   envMap.mapping = THREE.SphericalReflectionMapping;
//   material.envMap = envMap;
//   var roughnessMap = new THREE.TextureLoader().load('roughnessMap.png');
//   roughnessMap.magFilter = THREE.NearestFilter;
//   material.roughnessMap = roughnessMap;

////////////

export function updateMaterial (group, meshName, material) {
  // const mesh = scene.model.getObjectByName(meshName);
  const mesh = group.getObjectByName (meshName);
  console.log (mesh);
  // mesh.material.color.setHex(colors[matMenu.selectedIndex].value);
  mesh.material = material;
  mesh.material.needsUpdate = true;
}
