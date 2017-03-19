class Sea {
    constructor() {
        const geom = new THREE.CylinderGeometry(
            600, // radius top
            600, // radius bottom
            800, // height
            40,  // # of segments on radius
            10   // # of segments vertically
        );

        // rotate geometry on x axis
        geom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));

        // create material
        // Phong - smooth shading
        const mat = new THREE.MeshPhongMaterial({
            color: Colors.blue,
            transparent: true,
            opacity: .6,
            shading: THREE.FlatShading
        });

        // to create object in Three.js, need to make a mesh
        // a combination of geometry and material
        this.mesh = new THREE.Mesh(geom, mat);

        // allow sea to receive shadows
        this.mesh.receiveShadow = true;
    }
}

class Cloud {
    constructor() {
        // empty container to hold diff parts of cloud
        this.mesh = new THREE.Object3D();

        // cube geom
        // duplicate to create cloud
        const geom = new THREE.BoxGeometry(20,20,20);

        // simple white material
        const mat = new THREE.MeshPhongMaterial({
            color: Colors.white
        });

        // duplicate geometry random number of times
        // 3-5 clouds
        var nBlocs = 3 + Math.floor(Math.random()*3);
        for (let i = 0; i < nBlocs; i += 1) {
            // create mesh by cloning
            const m = new THREE.Mesh(geom, mat);

            // set position and rotation of each cube randomly
            m.position.x = i * 15;
            m.position.y = Math.random()*10;
            m.position.z = Math.random()*10;
            m.position.y = Math.random()*Math.PI*2;
            m.position.z = Math.random()*Math.PI*2;

            // set size randomly
            const s = .1 + Math.random()*.9;
            m.scale.set(s,s,s);

            // allow each cube to cast and receive shadows
            m.castShadow = true;
            m.receiveShadow = true;

            // add cube to container, this.mesh (Object3D)
            this.mesh.add(m);
        }
    }
}

class Sky {
    constructor() {
        // empty container
        this.mesh = new THREE.Object3D();

        // num of clouds
        this.nClouds = 20;

        // distribute clouds w/ uniform angle
        const stepAngle = Math.PI*2 / this.nClouds;

        // create clouds
        for (let i = 0; i < this.nClouds; i += 1) {
            const c = new Cloud();

            // rotation and position
            const a = stepAngle*i; // angle of cloud
            const h = 750 + Math.random()*200; // distance b/w center and cloud

            // polar -> Cartesian coords
            c.mesh.position.x = Math.cos(a)*h;
            c.mesh.position.y = Math.sin(a)*h;

            // random depths
            c.mesh.position.z = -400 - Math.random()*400;

            // rotate cloud based on position
            c.mesh.rotation.z = a + Math.PI/2;

            // random size
            const s = 1 + Math.random()*2;
            c.mesh.scale.set(s,s,s);

            this.mesh.add(c.mesh);
        }
    }
}

class Airplane {
    constructor() {
        this.mesh = new THREE.Object3D();

        // create cockpit
        const geomCockpit = new THREE.BoxGeometry(60,50,50,1,1,1);
        const matCockpit  = new THREE.MeshPhongMaterial({
            color   : Colors.red,
            shading : THREE.FlatShading
        });
        const cockpit     = new THREE.Mesh(geomCockpit, matCockpit);
        cockpit.castShadow = true;
        cockpit.receiveShadow = true;
        this.mesh.add(cockpit);

        // create engine
        const geomEngine = new THREE.BoxGeometry(20,50,50,1,1,1);
        const matEngine  = new THREE.MeshPhongMaterial({
            color   : Colors.white,
            shading : THREE.FlatShading
        });
        const engine     = new THREE.Mesh(geomEngine, matEngine);
        engine.position.x = 40;
        engine.castShadow = true;
        engine.receiveShadow = true;
        this.mesh.add(engine);

        // create tail
        const geomTail = new THREE.BoxGeometry(15,20,5,1,1,1);
        const matTail  = new THREE.MeshPhongMaterial({
            color   : Colors.red,
            shading : THREE.FlatShading
        });
        const tail     = new THREE.Mesh(geomTail, matTail);
        tail.position.set(-35,25,0);
        tail.castShadow = true;
        tail.receiveShadow = true;
        this.mesh.add(tail);

        // create wing
        const geomWing = new THREE.BoxGeometry(40,8,150,1,1,1);
        const matWing  = new THREE.MeshPhongMaterial({
            color : Colors.red,
            shading : THREE.FlatShading
        });
        const wing = new THREE.Mesh(geomWing, matWing);
        wing.castShadow = true;
        wing.receiveShadow = true;
        this.mesh.add(wing);

        // create propeller
        const geomPropeller = new THREE.BoxGeometry(40,8,150,1,1,1);
        const matPropeller  = new THREE.MeshPhongMaterial({
            color : Colors.brown,
            shading : THREE.FlatShading
        });
        this.propeller = new THREE.Mesh(geomPropeller, matPropeller);
        this.propeller.castShadow = true;
        this.propeller.receiveShadow = true;

        // create blades
        const geomBlade = new THREE.BoxGeometry(1,100,20,1,1,1);
        const matBlade = new THREE.MeshPhongMaterial({
            color: Colors.brownDark,
            shading: THREE.FlatShading 
        });

        const blade = new THREE.Mesh(geomBlade, matBlade);
        blade.position.set(8,0,0);
        blade.castShadow = true;
        blade.receiveShadow = true;
        this.propeller.add(blade);
        this.propeller.position.set(50,0,0);
        this.mesh.add(this.propeller);
    }
}