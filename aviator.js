// https://tympanus.net/codrops/2016/04/26/the-aviator-animating-basic-3d-scene-threejs/

const Colors = {
	red:0xf25346,
	white:0xd8d0d1,
	brown:0x59332e,
	pink:0xF5986E,
	brownDark:0x23190f,
	blue:0x68c3c0,
    bg:0xf7d9aa
};

window.addEventListener('load', init, false);

function init() {
    // set up scene, camera, renderer
    createScene();

    // add lights
    createLights();

    // add objects
    createPlane();
    createSea();
    createSky();

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
    hemisphereLight = new THREE.HemispherLight(0xaaaaaa, 0x000000, 0.9);

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

    // add to scene to activate
    scene.add(hemisphereLight);
    scene.add(shadowLight);
}