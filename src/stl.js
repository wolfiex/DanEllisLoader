import {STLLoader} from 'three/addons/loaders/STLLoader.js';
import {Mesh, MeshPhongMaterial, Group,Color} from 'three';

export const loader = new STLLoader ();
let group = new Group ();

export function stl (
  location,
  material = undefined,
  x = 0,
  y = 0,
  z = 0,
  i = -Math.PI / 2,
  j = Math.PI / 2,
  k = 0,
  scale = 0
) {
  // Colored binary STL


  loader.load (location, d=> load(d,material));
}

function load (geometry,material,location) {
    
  let meshMaterial = material;

  if (!material) {
        stlmaterial(geometry)
  }

  const mesh = new Mesh (geometry, meshMaterial);

//   mesh.position.set (x, y, z);
//   mesh.rotation.set (i, j, k);
//   mesh.scale.set (scale, scale, scale);

  mesh.castShadow = true;
  mesh.receiveShadow = true;

  // scene.add( mesh );
  mesh.name = location.match (/[^\/\.]+.stl/g)[0].split ('.stl')[0];
  // console.log(mesh.name,group)
  group.add (mesh);
}

export function stlmaterial(geometry){

    try {
    if (geometry.hasColors) {
     return MeshPhongMaterial ({
        opacity: geometry.alpha,
        vertexColors: true,
      });

    } else {throw 'ml'};
  } catch (err) {
    // console.error ('STL load', err);
    return new MeshPhongMaterial ({
      color: new Color('green'),//0xaaaaaa,
      specular: 0x111111,
      shininess: 200,
    });
  }
}



export function multistl (dir, filelist) {
  console.log (dir, filelist);
  group = new Group ();

  filelist.forEach (m => {
    console.log (stl (`/${dir}${m}.stl`));
  });

  console.log ('model', group.children);

  return group;
}
