// https://tympanus.net/codrops/2016/04/26/the-aviator-animating-basic-3d-scene-threejs/

function init() {
    // set up scene, camera, renderer
    createScene();

    // add lights
    createLights();

    // add objects
    createPlane();
    createSea();
    createSky();

    // animate pilot hair
    airplane.pilot.updateHairs();

    // animate waves
    sea.moveWaves();

    document.addEventListener('mousemove', handleMouseMove, false);

    loop();
}

// scene vars
var scene,
    camera, fieldOfView, aspectRatio, near, far, HEIGHT, WIDTH,
    renderer, container;

function createScene() {
    HEIGHT = window.innerHeight;
    WIDTH  = window.innerWidth;

    scene = new THREE.Scene();

    // fog effect to scene
    // fog (hexColor, near, far)
    scene.fog = new THREE.Fog(Colors.bg, 100, 950);

    // create camera
    aspectRatio = WIDTH / HEIGHT;
    fieldOfView = 60;
    near = 1;
    far  = 10000;
    camera = new THREE.PerspectiveCamera(
        fieldOfView,
        aspectRatio,
        near,
        far
    );

    camera.position.x = 0;
    camera.position.y = 100;
    camera.position.z = 200;

    // create renderer
    renderer = new THREE.WebGLRenderer({
        // allow transparency to show gradient bg
        // defined in CSS
        alpha: true,

        // activate anti-aliasing
        // however, less performant
        antialias: true
    });

    renderer.setSize(WIDTH, HEIGHT);

    // enable shadow rendering
    renderer.shadowMap.enabled = true;

    // add DOM element
    container = document.getElementById('container');
    container.appendChild(renderer.domElement);

    // update camera and renderer size on window resize
    window.addEventListener('resize', handleWindowResize, false);
}

function handleWindowResize() {
    // update height and width of renderer and camera
    HEIGHT = window.innerHeight;
    WIDTH  = window.innerWidth;
    renderer.setSize(WIDTH, HEIGHT);
    camera.aspect = WIDTH / HEIGHT;
    camera.updateProjectionMatrix();
}

// light vars
var hemisphereLight, shadowLight;

function createLights() {
    // hemisphere light = gradient colored light
    // first param = sky color
    // second param = ground color
    // third param = light intensity
    hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, 0.9);

    // directional light
    shadowLight = new THREE.DirectionalLight(0xffffff, 0.9);

    // set direction of light
    shadowLight.position.set(150, 350, 350);

    // allow shadow casting
    shadowLight.castShadow = true;

    // define visible area of projected shadow
    shadowLight.shadow.camera.left = -400;
    shadowLight.shadow.camera.right = 400;
    shadowLight.shadow.camera.top = 400;
    shadowLight.shadow.camera.bottom = -400;
    shadowLight.shadow.camera.near = 1;
    shadowLight.shadow.camera.far = 1000;

    // define resolution of shadow
    shadowLight.shadow.camera.width = 2048;
    shadowLight.shadow.camera.height = 2048;

    // ambient light softens shadows
    const ambientLight = new THREE.AmbientLight(0xdc8874, .5);

    // add to scene to activate
    scene.add(hemisphereLight);
    scene.add(shadowLight);
    scene.add(ambientLight);
}

var sea;
function createSea() {
    sea = new Sea();

    // push to bottom of scene
    sea.mesh.position.y = -600;
    scene.add(sea.mesh);
}

var sky;
function createSky() {
    sky = new Sky();
    sky.mesh.position.y = -600;
    scene.add(sky.mesh);
}

var airplane;
function createPlane() {
    airplane = new Airplane();
    airplane.mesh.scale.set(.25,.25,.25);
    airplane.mesh.position.y = 100;
    scene.add(airplane.mesh);
}

function loop() {
    // rotate propeller, sea, and sky
    airplane.propeller.rotation.x += .3;
    sea.mesh.rotation.z += .005;
    sky.mesh.rotation.z += .01;

    updatePlane();
    renderer.render(scene, camera);
    requestAnimationFrame(loop);
}

var mousePos = {
    x: 0, y: 0
};
function handleMouseMove(e) {
    // convert mouse position value received 
    // to normalized value b/w -1 and 1
    // inverse for vertical axis b/c 2D y-axis goes opposite direction of 3D y-axis
    mousePos.x = -1 + (e.clientX / WIDTH) * 2;
    mousePos.y = 1 - (e.clientY / HEIGHT) * 2;
}

// update plane frame
function updatePlane() {
    // move plane b/w -100 and 100 horizontally
    // 25-175 vertically
    // depending on normalized mouse pos
    var targetX = normalize(mousePos.x, -1, 1, -100, 100);
    var targetY = normalize(mousePos.y, -1, 1, 25, 175);

    // move plane at each frame by adding fraction of remaining distance
    airplane.mesh.position.y = (targetY - airplane.mesh.position.y)*.0128;

    // rotate plane proportionally to remaining distance
    airplane.propeller.rotation.z = (targetY - airplane.mesh.position.y)*.0128;
    airplane.propeller.rotation.x = (airplane.mesh.position.y - targetY)*.0064;

    airplane.propeller.rotation.x += .3;
}

function normalize(v, vmin, vmax, tmin, tmax) {
    // ensures relative position, nv, w/in -1 and 1
    var nv = Math.max(Math.min(v, vmax), vmin);
    var dv = vmax - vmin;
    var pc = (nv - vmin)/dv;
    var dt = tmax - tmin;
    var tv = tmin + pc*dt;
    return tv;
}
window.addEventListener('load', init, false);