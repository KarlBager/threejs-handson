import * as THREE from 'three';
import {OrbitControls} from '/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from '/examples/jsm/loaders/GLTFLoader.js';
import GUI from 'lil-gui';
import Stats from 'three/addons/libs/stats.module.js';
import {FontLoader} from '/examples/jsm/loaders/FontLoader.js';
import {TextGeometry} from '/examples/jsm/geometries/TextGeometry.js';
import * as ThreeObjects from '/modules/ThreeObjects.js';
import {ColladaLoader} from '/examples/jsm/loaders/ColladaLoader.js'

let canvasEl = document.getElementById("three");

let vw = window.innerWidth;
let vh = window.innerHeight;


// En SCENE
const scene = new THREE.Scene();

scene.background = new THREE.Color("#000000");
scene.fog = new THREE.Fog("#000000", 0, 80);

const camera = new THREE.PerspectiveCamera(50, vw/vh, .1, 1000);
const renderer = new THREE.WebGLRenderer({canvas:canvasEl, antialias:true});
renderer.setSize(vw,vh);
renderer.setAnimationLoop(animate);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;


var stats = new Stats();
document.body.appendChild(stats.dom);


gsap.ticker.add(animate);
let d = 0;

let clock = new THREE.Clock();


function animate(){
    d = gsap.ticker.deltaRatio(60);

   
    if(kop != undefined){
    kop.rotation.y += .01;
    }
    


    if(trooper){

        // twRotateX += (rotateX - twRotateX) / 10 * d;
        // twRotateY += (rotateY - twRotateY) / 10 * d;

    //Update mixer with clock – to sync animations
        mixer.update(clock.getDelta());
        
    }

stats.update();


renderer.render(scene, camera);
}



function dtr(d){
    return d * (Math.PI/180);
}



//Stars
function createStars(){
    const points = [];
    const radius = 500;
    for(var i = 0; i<1000; i++){
        var angle = dtr(Math.random() * 360);
        var x = radius * Math.cos(angle);
        var z = radius * Math.sin(angle);
        var y = Math.random() * 250;
        points.push(new THREE.Vector3(x,y,z));
    }    

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.PointsMaterial({color:"#ffffff", fog:false});
    var stars = new THREE.Points(geometry, material);
    scene.add(stars);
    return stars;
    
}

var stars = createStars();


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



// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
directionalLight.position.set(5, 10, 5);
directionalLight.castShadow = true;
scene.add(directionalLight);


let directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5);
scene.add(directionalLightHelper);


const directionalLight2 = new THREE.DirectionalLight(0xffffff, 10);
directionalLight2.position.set(-5, 10, -5);
directionalLight2.castShadow = true;
scene.add(directionalLight2);


let directionalLightHelper2 = new THREE.DirectionalLightHelper(directionalLight2, 5);
scene.add(directionalLightHelper2);



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
        kop.rotation.y = 0.2;
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
        //console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    // Function called when there's an error
    function (error) {
        console.error('An error occurred while loading the GLB model:', error);
    }
);


return kop;
}

let kop = buildKop();



var trooper;
let mixer;
let animationSettings = {speed: 10};
function buildTrooper(){
    let loader = new ColladaLoader().setPath('/examples/models/collada/stormtrooper/');
    loader.load(
        'stormtrooper.dae',  // Replace with the actual path to your GLB file
        function (collada) {
            // Add the loaded GLB model to the scene
            trooper = collada.scene;
            scene.add(trooper);
    
            // Optional: Position or scale the model if necessary
            trooper.position.set(3, 0, 0);
            trooper.scale.set(1, 1, 1);
            trooper.rotation.z = dtr(180);



            //Animation
            mixer = new THREE.AnimationMixer(trooper);
            let animations = trooper.animations;
            mixer.clipAction(animations[0]).play();



    
            trooper.traverse(function(child){
    
                if(child.isMesh){
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            
            });
    
        },
        // Function called while loading is progressing
        function (xhr) {
            //console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        // Function called when there's an error
        function (error) {
            console.error('An error occurred while loading the GLB model:', error);
        }
    );
    

    }
    buildTrooper();










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

// //Custom camera controls
// function mousemove(e){
//     //console.log("mousemove", e.clientX, e.clientY);
//     camera.position.x = (e.clientX - vw/2) * .01;
//     camera.position.y = (e.clientY/vh) * 4.5;
// }
// window.addEventListener("mousemove", mousemove);

