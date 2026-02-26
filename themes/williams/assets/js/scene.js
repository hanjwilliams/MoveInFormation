import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js'
//import { SimplexNoise } from 'three/addons/math/SimplexNoise.js';
import { ImprovedNoise } from 'three/addons/math/ImprovedNoise.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { BokehPass } from 'three/addons/postprocessing/BokehPass.js';
import { animate, createTimeline } from 'animejs';

const banner = document.getElementById("three-banner");
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xFFFFFF)
const camera = new THREE.PerspectiveCamera( 75, banner.clientWidth / banner.clientHeight, 0.1, 3000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( banner.clientWidth, banner.clientHeight );
renderer.setClearColor(0x000000);
renderer.logarithmicDepthBuffer = false;

banner.appendChild( renderer.domElement );

//const light = new THREE.PointLight( 0x404040, 50000, 1000, 1);
const light = new THREE.DirectionalLight( 0xffffff, 4 );
light.position.set(400, 400, 200 );
light.castShadow = true;
scene.add( light );
// const pointLightHelper = new THREE.PointLightHelper( light, 5 );
// scene.add( pointLightHelper );

function scrollPercent() {
  // Get scrollTop (cross-browser)
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
 
  // Get viewport height
  const viewportHeight = document.documentElement.clientHeight || window.innerHeight;
 
  // Get document height (cross-browser)
  const documentHeight = Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.offsetHeight,
    document.body.clientHeight,
    document.documentElement.clientHeight
  );
 
  // Calculate scrollable height
  const scrollableHeight = documentHeight - viewportHeight;
 
  // Return percentage (handle edge case where document is shorter than viewport)
  return scrollableHeight > 0 ? (scrollTop / scrollableHeight) * 100 : 0;
}

camera.position.set(0, 700, 500)
camera.rotation.set(-Math.PI / 3, 0, 0);

const cameraMove = createTimeline({
  autoplay: false
});

cameraMove.add(camera.position, {
  y: 30,
  z: -100
}, 0 );
cameraMove.add(camera.rotation, {
  x: Math.PI / 4
}, 100 );

function resize () {
  var width = banner.clientWidth;
  var height = banner.clientHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}
resize();
window.addEventListener('resize', resize, { passive: true });

const perlin = new ImprovedNoise();

// Generate terrain
const geometry = new THREE.PlaneGeometry(5000, 5000, 64, 64)
const vertices = geometry.attributes.position.array

for (let i = 0; i < vertices.length; i += 3) {
  const x = vertices[i]
  const y = vertices[i + 1]
  vertices[i + 2] = perlin.noise(x, y, x*y) * 100;
}

geometry.attributes.position.needsUpdate = true
geometry.computeVertexNormals()

const loader = new THREE.TextureLoader();
const texture = loader.load( '../../img/texture.png' );
texture.colorSpace = THREE.SRGBColorSpace;
 
const material = new THREE.MeshLambertMaterial({
  color: 0xFFFFFF,
  map: texture,
});
const terrain = new THREE.Mesh(geometry, material)
terrain.rotation.x = -Math.PI / 2
scene.add(terrain)

const composer = new EffectComposer( renderer );
const renderPass = new RenderPass( scene, camera );
composer.addPass( renderPass );
const bokehPass = new BokehPass( scene, camera, {
	focus: 5,
	aperture: .025,
	maxblur: .01
} );
composer.addPass( bokehPass );
const outputPass = new OutputPass()
composer.addPass( outputPass );

function animation() {
  requestAnimationFrame(animation)
  //terrain.rotation.z += .0002;
  window.onscroll = () => {
    cameraMove.seek((scrollPercent() / 100) * cameraMove.duration);
  };
  renderer.render( scene, camera );
  
}
animation();
//renderer.setAnimationLoop( animation );