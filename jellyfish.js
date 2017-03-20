var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;
var renderer, scene, camera, controls;

const colors = {
    mint: 0xd1ffe9,
    white: 0xeff5ff
};

function makeScene (target, ...objs) {
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
    camera.position.set(0, 0, 100);
    camera.lookAt(new THREE.Vector3(0,0,0));

    // add controls
    controls = new THREE.OrbitControls(camera);

    // scene
    scene = new THREE.Scene();
    
    // light
    const dirLight = new THREE.DirectionalLight(colors.white, .9);
    dirLight.target = target;
    dirLight.position.set(0,-.1,0);
    scene.add(dirLight);
    console.log(dirLight.position);
    console.log(dirLight.target);

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
        WIDTH  = window.innerWidth;
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

// need to fix height calc
function Jellyfish(height, radius, nSegments) {
    // const geom = new THREE.ConeGeometry(5,20,32);
    // const mat = new THREE.MeshBasicMaterial({color: colors.mint});
    // this.mesh = new THREE.Mesh(geom,mat);

    var points = [];

    const bottom = -10;
    const step = 1/nSegments;
    for ( var i = 0; i < 10; i ++ ) {
        // points.push( new THREE.Vector2( Math.sin( i * 0.5 ) * 10 + 2, ( i - 5 ) * 2 ) );
        points.push( new THREE.Vector2(i*radius*step, i*i*height*step + bottom));
    }
    var geometry = new THREE.LatheGeometry( points );
    // var material = new THREE.MeshPhongMaterial( { color: colors.mint } );
    var material = new THREE.MeshBasicMaterial( { color: colors.mint } );
    this.mesh = new THREE.Mesh( geometry, material );
    this.mesh.receiveShadow = true;
    this.mesh.castShadow = true;
}

var jelly = new Jellyfish(2, 20, 10);
makeScene(jelly.mesh);