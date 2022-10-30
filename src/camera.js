import {PerspectiveCamera, OrthographicCamera, DirectionalLight,Box3} from 'three';

export function perspective (
  kwargs = [50, window.innerWidth / window.innerHeight, 0.1, 100]
) {

    /*
    fov — Camera frustum vertical field of view.
aspect — Camera frustum aspect ratio.
near — Camera frustum near plane.
far — Camera frustum far plane.

*/

  return new PerspectiveCamera (...kwargs);
}

export function addShadowedLight (x, y, z, color, intensity, scene) {
  const directionalLight = new DirectionalLight (color, intensity);
  directionalLight.position.set (x, y, z);
  scene.add (directionalLight);

  directionalLight.castShadow = true;

  const d = 1;
  directionalLight.shadow.camera.left = -d;
  directionalLight.shadow.camera.right = d;
  directionalLight.shadow.camera.top = d;
  directionalLight.shadow.camera.bottom = -d;

  directionalLight.shadow.camera.near = 1;
  directionalLight.shadow.camera.far = 4;

  directionalLight.shadow.bias = -0.002;
}

export function orthographic (
  kwargs = [
    window.innerWidth / -2,
    window.innerHeight / 2,
    window.innerHeight / 2,
    window.innerHeight / -2,
    1,
    100,
  ]
) {
  /* 
    left — Camera frustum left plane.
    right — Camera frustum right plane.
    top — Camera frustum top plane.
    bottom — Camera frustum bottom plane.
    near — Camera frustum near plane.
    far — Camera frustum far plane.
*/

  return new OrthographicCamera (...kwargs)
}


// export function orthozoom(meshGroup,camera,container){
//     //container is canvas
//     var box = new Box3().setFromObject(meshGroup);

   
//             box.getCenter(meshGroup.position);
//             meshGroup.localToWorld(box);
//             meshGroup.position.multiplyScalar(-1);
//             console.warn(box)


//        //For fitting the object to the screen when using orthographic camera

//            camera.zoom = Math.min(container.offsetWidth / (box.max.x - box.min.x),
//                 container.offsetHeight / (box.max.y - box.min.y)) * 0.4;
//            camera.updateProjectionMatrix();
//            camera.updateMatrix();
// }



/*

camera.position.set(0,0,1)


*/
