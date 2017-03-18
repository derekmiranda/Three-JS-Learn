// https://aerotwist.com/tutorials/getting-started-with-three-js/

// scene size
const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;

// camera attributes
const VIEW_ANGLE = 45;
const ASPECT = WIDTH/HEIGHT;
const NEAR = 0.1;
const FAR = 10000;

// WebGL Renderer, camera, scene
const renderer = new THREE.WebGLRenderer();
const camera = new THREE.PerspectiveCamera(
    VIEW_ANGLE,
    ASPECT,
    NEAR,
    FAR
);
const scene = new THREE.Scene();

scene.add(camera);
renderer.setSize(WIDTH, HEIGHT);

// Add renderer to document
document.getElementById('container').appendChild(renderer.domElement);

// sphere vars
const RADIUS = 50;
const SEGMENTS = 16;
const RINGS = 16;

// sphere material
// Lambert - matte surface
const sphereMaterial = new THREE.MeshLambertMaterial({
    color: 0xCC0000
});

// new mesh w/ sphere geometry
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(
        RADIUS,
        SEGMENTS,
        RINGS
    ),
    sphereMaterial
);

// move back sphere Z-wise
sphere.position.z = -300;

// changes to geometry
sphere.geometry.verticesNeedUpdate = true;
sphere.geometry.normalsNeedUpdate  = true;

scene.add(sphere);

// create point light
const pointLight = new THREE.PointLight(0xFFFFFF);

// set position
pointLight.position.x = 10;
pointLight.position.y = 50;
pointLight.position.z = 130;

scene.add(pointLight);

// schedule first frame
requestAnimationFrame(update);

function update () {
    renderer.render(scene, camera); // draw
    requestAnimationFrame(update);  // Schedule next frame
}