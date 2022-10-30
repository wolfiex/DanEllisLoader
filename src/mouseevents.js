import {Vector3,Box3} from 'three'


export const target = new Vector3(0,0,0);
export let mouseX = 0, mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var rotateX = Math.PI/window.innerWidth;
var rotateY = Math.PI/window.innerHeight;



export function onDocumentMouseMove( event ) {


    mouseX = ( event.clientX - windowHalfX );
    mouseY = ( event.clientY - windowHalfY );

    target.x += ( mouseX - target.x ) * .02;
    target.y += ( - mouseY - target.y ) * .02;

    // limit movement
    target.y*=.8



    // single axis rotate
    // target.x = (event.clientX- windowHalfX)*rotateX*100
    // target.y = (event.clientY-windowHalfY)*rotateY*100
    // head.setRotationFromAxisAngle(new THREE.Vector3(0,1,0),target.x)


}




export function readjust (group){
    /// center group objects

    var bbox = 
    new Box3().setFromObject( group )
    .getCenter( group.position )
    // .multiplyScalar( - 1 );
    
    group.children.forEach(c=>
        c.position.set( -bbox.x,-bbox.y,-bbox.z)
        // c.position.set( bbox.x,bbox.y,bbox.z)
    )

    }

/*

    object.lookAt( target );

    */