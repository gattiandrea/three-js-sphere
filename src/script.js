import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

/**
 * Base
 */

// Text loader
const textureLoader = new THREE.TextureLoader();
const alphaMap = textureLoader.load("/texture/alpha.webp");

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Object
const geometry = new THREE.SphereBufferGeometry(1, 64, 64);

// Materials
var material = new THREE.MeshStandardMaterial({
  color: "#222",
  transparent: true,
  side: THREE.DoubleSide,
  alphaTest: 0.5,
  opacity: 1,
  roughness: 1,
});
material.alphaMap = alphaMap;
material.alphaMap.magFilter = THREE.NearestFilter;
material.alphaMap.wrapT = THREE.RepeatWrapping;
material.alphaMap.repeat.y = 1;

//Mesh
const mesh = new THREE.Mesh(geometry, material);
mesh.rotation.z = -Math.PI / 4;
scene.add(mesh);

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Lights
const light = new THREE.SpotLight("#fff", 0.8);
light.position.y = 100;

light.angle = 1.05;

light.decacy = 2;
light.penumbra = 1;

light.shadow.camera.near = 10;
light.shadow.camera.far = 1000;
light.shadow.camera.fov = 30;

scene.add(light);

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 3;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Animate
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  mesh.material.alphaMap.offset.y = elapsedTime * 0.1;

  //Move lights
  light.position.x = Math.sin(elapsedTime * 0.01) * 200;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
