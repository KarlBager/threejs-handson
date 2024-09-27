import * as THREE from 'three';
import {OrbitControls} from '/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from '/examples/jsm/loaders/GLTFLoader.js';
import GUI from 'lil-gui';

let canvasEl = document.getElementById("three");

let vw = window.innerWidth;
let vh = window.innerHeight;



// En SCENE
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, vw/vh, .1, 1000);
const renderer = new THREE.WebGLRenderer({canvas:canvasEl});
renderer.setSize(vw,vh);

renderer.setAnimationLoop(animate);

function animate(){

    renderer.render(scene, camera);

    //cube.rotation.x += .01;
    //cube.rotation.y += .01;

    //camera.rotation.z += dtr(1);

    //kop.rotation.z += dtr(1);
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
    const material = new THREE.MeshBasicMaterial({color:boxColor});
    plane = new THREE.Mesh(geometry, material);
    plane.position.set(x,y,z);
    plane.scale.set(1,1,1);

    scene.add(plane);
}
//buildPlane(0,0,-4, 2, "#44ff44");


/*
const gui = new GUI();

const folder = gui.addFolder("Plane position");
folder.add(plane.position, 'x', -10, 10, .1);
folder.add(plane.position, 'y', -10, 10, .1);
folder.add(plane.position, 'z', -10, 10, .1);

folder.add(plane.rotation, 'x', dtr(-180), dtr(180), .01);
folder.add(plane.rotation, 'y', dtr(-180), dtr(180), .1);
folder.add(plane.rotation, 'z', dtr(-180), dtr(180), .1);
*/


let line;
function buildLine(x, y, z, width, boxColor){
    const points = [];
    points.push[new THREE.Vector3(0,0,0)];
    points.push[new THREE.Vector3(-10,0,0)];
    points.push[new THREE.Vector3(-5,0,0)];
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({color:boxColor});
    line = new THREE.Line(geometry, material);
    line.position.set(x,y,z)

    scene.add(line);
}

buildLine(0,0,0, 2, "#44ff44");


camera.position.z = 10;
const controls = new OrbitControls(camera, canvasEl);


function dtr(d){
    return d * (Math.PI/180);
}


// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);




function buildKop(){
let kop;
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