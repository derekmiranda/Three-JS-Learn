const THREE = require('three');
const OrbitControls = require('three-orbit-controls')(THREE);
import Jellyfish from './Jellyfish';

var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;
var renderer, scene, camera, controls;

function makeScene(target, ...objs) {
    // renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(WIDTH, HEIGHT);
    renderer.shadowMap.enabled = true; // enable shadow rendering
    document.body.appendChild(renderer.domElement);

    // camera
    camera = new THREE.PerspectiveCamera(
        20,
        WIDTH / HEIGHT,
        1,
        500
    );
    camera.position.set(0, 0, -140);
    // camera.lookAt(new THREE.Vector3(0, 0, 0));

    // add controls
    controls = new OrbitControls(camera);

    // scene
    scene = new THREE.Scene();

    // light
    // const dirLight = new THREE.DirectionalLight(colors.white, .9);
    // dirLight.target = target;
    // dirLight.position.set(0,-.1,0);
    // scene.add(dirLight);
    var ambientLight = new THREE.AmbientLight(0x000000);
    scene.add(ambientLight);

    // point lights
    const topLight = new THREE.PointLight(0xffffff, 1, 0);
    const btmLight = new THREE.PointLight(0xccccee, 1, 0);

    topLight.position.set(0, 50, 0);
    btmLight.position.set(0, -70, 0);

    scene.add(topLight);
    scene.add(btmLight);

    // add objects
    scene.add(target);
    objs.forEach(obj => scene.add(obj));
    renderer.render(scene, camera);

    // animation loop
    animate();

    // update camera and renderer size on window resize
    window.addEventListener('resize', () => {
        // update height and width of renderer and camera
        HEIGHT = window.innerHeight;
        WIDTH = window.innerWidth;
        renderer.setSize(WIDTH, HEIGHT);
        camera.aspect = WIDTH / HEIGHT;
        camera.updateProjectionMatrix();
    },
        false);
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

var jelly = new Jellyfish(20, 20, 10);
makeScene(jelly.mesh);