import * as THREE from 'three';
import {OrbitControls} from '/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from '/examples/jsm/loaders/GLTFLoader.js';
import GUI from 'lil-gui';

let canvasEl = document.getElementById("three");

let vw = window.innerWidth;
let vh = window.innerHeight;



// En SCENE
const scene = new THREE.Scene();

scene.background = new THREE.Color("#222222");
scene.fog = new THREE.Fog("#000000", 0, 30);

const camera = new THREE.PerspectiveCamera(50, vw/vh, .1, 1000);
const renderer = new THREE.WebGLRenderer({canvas:canvasEl});
renderer.setSize(vw,vh);
renderer.setAnimationLoop(animate);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;



function animate(){

    renderer.render(scene, camera);

    if(kop != undefined){
    kop.rotation.y += .01;
}



}



let cube;
function buildCube(x, y, z, width, boxColor){
    const geometry = new THREE.BoxGeometry(width,width,width);
    const material = new THREE.MeshBasicMaterial({color:boxColor});
    cube = new THREE.Mesh(geometry, material);
    cube.position.set(x,y,z);
    cube.rotation.x = dtr(45);
    cube.rotation.y = dtr(45);
    cube.scale.set(1,1,1);

    scene.add(cube);
}
//buildCube(0,0,-5, 2, "#4444ff");


let plane;
function buildPlane(x, y, z, width, boxColor){
    const geometry = new THREE.PlaneGeometry(width,width,width);
    const material = new THREE.MeshStandardMaterial({color:boxColor, side:THREE.DoubleSide});
    plane = new THREE.Mesh(geometry, material);
    plane.position.set(x,y,z);
    plane.scale.set(1,1,1);
    plane.rotation.x = dtr(90);
    plane.receiveShadow = true,
    scene.add(plane);
}
buildPlane(0,-.01,-4, 100, "#eeeeee");




camera.position.z = 10;
camera.position.y = 5;
const controls = new OrbitControls(camera, canvasEl);


function dtr(d){
    return d * (Math.PI/180);
}




// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 10);
directionalLight.position.set(5, 5, 5);
directionalLight.castShadow = true;
scene.add(directionalLight);


let directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5);
//scene.add(directionalLightHelper);





let kop;
function buildKop(){
let loader = new GLTFLoader();
loader.load(
    'kop-til-three.glb',  // Replace with the actual path to your GLB file
    function (gltf) {
        // Add the loaded GLB model to the scene
        kop = gltf.scene;
        scene.add(kop);

        // Optional: Position or scale the model if necessary
        kop.position.set(0, 0, 0);
        kop.scale.set(25, 25, 25);
        kop.castShadow = true;
        kop.receiveShadow = true;

        kop.traverse(function(child){

            if(child.isMesh){
                child.castShadow = true;
                child.receiveShadow = true;
            }
        
        });

    },
    // Function called while loading is progressing
    function (xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    // Function called when there's an error
    function (error) {
        console.error('An error occurred while loading the GLB model:', error);
    }
);
}

buildKop();




const gui = new GUI();

const folder = gui.addFolder("Light position");
folder.add(directionalLight.position, 'x', -10, 10, .1);
folder.add(directionalLight.position, 'y', -10, 10, .1);
folder.add(directionalLight.position, 'z', -10, 10, .1);



//Juster kamera når vinduet skifter størrelse
function resized(e){
    vw = window.innerWidth;
    vh = window.innerHeight;

    camera.aspect = vw/vh;
    camera.updateProjectionMatrix();
    renderer.setSize(vw,vh);
}

window.addEventListener("resize", resized);
resized(null);