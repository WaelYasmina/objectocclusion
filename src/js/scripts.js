import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils';

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Sets the color of the background
renderer.setClearColor(0xFEFEFE);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

// Sets orbit control to move the camera around
const controls1 = new OrbitControls(camera, renderer.domElement);
controls1.enableDamping = true;
controls1.dampingFactor = 0.12;
controls1.enableZoom = false;

const controls2 = new TrackballControls(camera, renderer.domElement);

controls2.noRotate = true;
controls2.noPan = true;
controls2.noZoom = false;
controls2.zoomSpeed = 1.5;

// Camera positioning
camera.position.set(0, 4, 14);


// Sets a 12 by 12 gird helper
const gridHelper = new THREE.GridHelper(12, 12);
scene.add(gridHelper);

const dLight = new THREE.DirectionalLight(0xFFFFFF, 1);

scene.add(dLight);
dLight.position.set(0, 3, 3);

// const ringGeometry = new THREE.RingGeometry(0.75, 2, 64); 
// const ringMaterial = new THREE.MeshBasicMaterial({color: 0xed2f75, side:THREE.DoubleSide});
// const ring = new THREE.Mesh(ringGeometry, ringMaterial);
// scene.add(ring);
// ring.position.z = 3;

// const boxGeometry = new THREE.BoxGeometry(5, 5); 
// const boxMaterial = new THREE.MeshBasicMaterial({color: 0x8431d6});
// const box = new THREE.Mesh(boxGeometry, boxMaterial);
// scene.add(box);
// box.position.z = 0;

// const planeGeometry = new THREE.PlaneGeometry(8, 8); 
// const planeMaterial = new THREE.MeshBasicMaterial({color: 0x31d6aa, side: THREE.DoubleSide});
// const plane = new THREE.Mesh(planeGeometry, planeMaterial);
// scene.add(plane);
// plane.position.z = -6;

// ring.material.colorWrite = false;

// plane.renderOrder = 0;
// ring.renderOrder = 1;
// box.renderOrder = 2;

const loader = new GLTFLoader();

loader.load('./assets/door.glb', function(glb) {
    const model = glb.scene;
    scene.add(model);
    model.scale.set(0.004, 0.004, 0.004);
    model.position.x = -4;

    const modelClone = SkeletonUtils.clone(model);
    scene.add(modelClone);
    modelClone.position.x = 4;
});

let mixer1;
let model1;

loader.load('./assets/Orc.gltf', function(gltf) {
    model1 = gltf.scene;
    scene.add(model1);
    model1.scale.set(0.6, 0.6, 0.6);
    model1.position.x = 6;
    model1.rotation.y = -Math.PI / 2;

    const animations = gltf.animations;
    mixer1 = new THREE.AnimationMixer(model1);
    const clip = THREE.AnimationClip.findByName(animations, 'Run');
    const action = mixer1.clipAction(clip);
    action.play();

    model1.traverse(function(node) {
        if(node.isMesh)
            node.renderOrder = 2;
    });
});

let mixer2;
let model2;
loader.load('./assets/Chicken.gltf', function(gltf) {
    model2 = gltf.scene;
    scene.add(model2);
    model2.scale.set(0.4, 0.4, 0.4);
    model2.position.x = 0;
    model2.rotation.y = -Math.PI / 2;

    const animations = gltf.animations;
    mixer2 = new THREE.AnimationMixer(model2);
    const clip = THREE.AnimationClip.findByName(animations, 'Walk');
    const action = mixer2.clipAction(clip);
    action.play();

    model2.traverse(function(node) {
        if(node.isMesh)
            node.renderOrder = 2;
    });
});

let mixer3;
let model3;
loader.load('./assets/Velociraptor.glb', function(gltf) {
    model3 = gltf.scene;
    scene.add(model3);
    model3.scale.set(0.4, 0.4, 0.4);
    model3.position.x = -8;
    model3.rotation.y = -Math.PI / 2;

    const animations = gltf.animations;
    mixer3 = new THREE.AnimationMixer(model3);
    const clip = THREE.AnimationClip.findByName(animations, 'Velociraptor_Run');
    const action = mixer3.clipAction(clip);
    action.play();

    model3.traverse(function(node) {
        if(node.isMesh)
            node.renderOrder = 2;
    });
});

const a = new THREE.Mesh(
    new THREE.BoxGeometry(8, 4, 2.2),
    new THREE.MeshBasicMaterial()
);
scene.add(a);
a.position.set(-8.09, 2, 0);
a.material.colorWrite = false;
a.renderOrder = 1;

const b = a.clone();
scene.add(b);
b.position.set(8.09, 2, 0);
b.renderOrder = 1;

const clock = new THREE.Clock();

function animate() {
  const target = controls1.target;
  controls1.update();
  controls2.target.set(target.x, target.y, target.z);
  controls2.update();

    if(mixer1 && mixer2 && mixer3) {
        const delta = clock.getDelta();
        mixer1.update(delta);
        mixer2.update(delta);
        mixer3.update(delta);

        model1.position.x -= 0.03;
        model2.position.x -= 0.03;
        model3.position.x -= 0.03;

        if(model1.position.x < -10)
            model1.position.x = 10;
        if(model2.position.x < -10)
            model2.position.x = 10;
        if(model3.position.x < -10)
            model3.position.x = 10;
    }

    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
