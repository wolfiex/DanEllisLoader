

export function msphere(THREE,r){

const geometry = new THREE.SphereGeometry(r)
const material = new THREE.MeshNormalMaterial({

    // emissive:new THREE.Color('red'),
    // emissiveIntensity:1.0,  
    roughness: .0,
  metalness:2,
  opacity:1,
transparent:  true,
  side: THREE.DoubleSide
})

return new THREE.Mesh(geometry, material, {castShadow:true});

}