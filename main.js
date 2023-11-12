import * as THREE from 'three';
import './style.css';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import gsap from 'gsap';
// scene 
const scene = new THREE.Scene();

// Create our sphere
const  geometry = new THREE.SphereGeometry(3, 64, 64);
const material = new THREE.MeshStandardMaterial({
  color: '#00ff83',
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// sizes 
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}
// Light 
const light = new THREE.PointLight(0xffffff, 100, 100);
light.position.set(0, 10, 10);
scene.add(light);

// Camera 
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height,);
camera.position.z=20;
scene.add(camera);

// Renderer 
const canvas = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setPixelRatio(2);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;
controls.enableZoom = false;
controls.autoRotate = true;
controls.autoRotateSpeed = 5;
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);

// Resize 
window.addEventListener('resize', () => {
  //update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  //update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  //update renderer
  renderer.setSize(sizes.width, sizes.height);
  // renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
});

const loop = () => {
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(loop);
}
loop();

// timeline magic

const tl = gsap.timeline({
  defaults: {
    duration: 1
  }
});

tl.fromTo(mesh.scale, {z: 0, x: 0, y: 0}, {z: 1, x: 1, y: 1});
tl.fromTo('nav', {y: '-100%'}, {y: '0%'});
tl.fromTo('.title', {opacity: 0}, {opacity: 1});

// mouse animation color
let mouseDown = false;
let rgb = [];

window.addEventListener('mousedown', () => {
  mouseDown = true;
})
window.addEventListener('mouseup', () => {
  mouseDown = false;
})

window.addEventListener('mousemove', (e) => {
  if(mouseDown){
    rgb = [
      Math.round(e.pageX/sizes.width * 255),
      Math.round(e.pageY/sizes.width * 255),
      150
    ];
    //lets animate
    let newColor = new THREE.Color(`rgb(${rgb.join(',')})`);
    gsap.to(mesh.material.color, {
      r: newColor.r,
      g: newColor.g,
      b: newColor.b
    })
  }
})