import {
  MeshStandardMaterial,
  MeshNormalMaterial,
  MeshPhongMaterial,
  Color,
  DoubleSide,
} from 'three';

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

export function updateMaterial (group, meshName, material) {
  // const mesh = scene.model.getObjectByName(meshName);
  const mesh = group.getObjectByName(meshName);
  console.log(mesh)
  // mesh.material.color.setHex(colors[matMenu.selectedIndex].value);
  mesh.material = material;
  mesh.material.needsUpdate = true;
}
