var jelly = new Jellyfish;
makeScene(jelly.mesh);

function Jellyfish() {
    const geom = new THREE.ConeGeometry(5,20,32);
    const mat = new THREE.MeshBasicMaterial({color: 0xd1ffe9});
    this.mesh = new THREE.Mesh(geom,mat);
}

function makeScene (...objs) {
    const WIDTH = window.innerWidth;
    const HEIGHT = window.innerHeight;

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(WIDTH, HEIGHT);
    document.body.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(
        20,
        WIDTH / HEIGHT,
        1,
        500
    );
    camera.position.set(0, 0, 100);
    camera.lookAt(new THREE.Vector3(0,0,0));

    var scene = new THREE.Scene();

    objs.forEach(obj => scene.add(obj));
    renderer.render(scene, camera);
}
