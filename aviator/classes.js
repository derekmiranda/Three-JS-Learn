class Sea {
    constructor() {
        var geom = new THREE.CylinderGeometry(
            600, // radius top
            600, // radius bottom
            800, // height
            40,  // # of segments on radius
            10   // # of segments vertically
        );

        // important: merging vertices --> ensure continuity of waves
        geom.mergeVertices();

        this.waves = geom.vertices.map((v, i) => {
            return {
                x: v.x,
                y: v.y,
                z: v.z,
                // random angle
                ang: Math.random()*Math.PI*2,
                // random distance
                amp: 5 + Math.random()*15,
                // random angular speed
                speed: 0.016 + Math.random() * 0.032
            }
        });

        // rotate geometry on x axis
        geom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));

        // create material
        // Phong - smooth shading
        var mat = new THREE.MeshPhongMaterial({
            color: Colors.blue,
            transparent: true,
            opacity: .8,
            shading: THREE.FlatShading
        });

        // to create object in Three.js, need to make a mesh
        // a combination of geometry and material
        this.mesh = new THREE.Mesh(geom, mat);

        // allow sea to receive shadows
        this.mesh.receiveShadow = true;
    }

    moveWaves() {
        // update cylinder vertices
        this.mesh.geometry.vertices.forEach((v, i) => {
            var vprops = this.waves[i];

            // update position of vertex
            v.x = vprops.x + Math.cos(vprops.ang)*vprops.amp;
            v.y = vprops.y + Math.sin(vprops.ang)*vprops.amp;

            // increment angle for next frame
            vprops.ang += vprops.speed;
        });

        // tell renderer that sea geometry has changed
        // to maintain best performance,
        // three.js caches geometries and ignores any changes
        // unless this line is added
        this.mesh.geometry.verticesNeedUpdate = true;

        sea.mesh.rotation.z += .005;
    }
}

class Cloud {
    constructor() {
        // empty container to hold diff parts of cloud
        this.mesh = new THREE.Object3D();

        // cube geom
        // duplicate to create cloud
        var geom = new THREE.BoxGeometry(20,20,20);

        // simple white material
        var mat = new THREE.MeshPhongMaterial({
            color: Colors.white
        });

        // duplicate geometry random number of times
        // 3-5 clouds
        var nBlocs = 3 + Math.floor(Math.random()*3);
        for (var i = 0; i < nBlocs; i += 1) {
            // create mesh by cloning
            var m = new THREE.Mesh(geom, mat);

            // set position and rotation of each cube randomly
            m.position.x = i * 15;
            m.position.y = Math.random()*10;
            m.position.z = Math.random()*10;
            m.position.y = Math.random()*Math.PI*2;
            m.position.z = Math.random()*Math.PI*2;

            // set size randomly
            var s = .1 + Math.random()*.9;
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
        var stepAngle = Math.PI*2 / this.nClouds;

        // create clouds
        for (var i = 0; i < this.nClouds; i += 1) {
            var c = new Cloud();

            // rotation and position
            var a = stepAngle*i; // angle of cloud
            var h = 750 + Math.random()*200; // distance b/w center and cloud

            // polar -> Cartesian coords
            c.mesh.position.x = Math.cos(a)*h;
            c.mesh.position.y = Math.sin(a)*h;

            // random depths
            c.mesh.position.z = -400 - Math.random()*400;

            // rotate cloud based on position
            c.mesh.rotation.z = a + Math.PI/2;

            // random size
            var s = 1 + Math.random()*2;
            c.mesh.scale.set(s,s,s);

            this.mesh.add(c.mesh);
        }
    }
}

class Pilot {
    constructor() {
        this.mesh = new THREE.Object3D();
        this.mesh.name = "Durkle";

        // angle to animate hair
        this.angleHairs = 0;

        // body
        var bodyGeom = new THREE.BoxGeometry(15,15,15);
        var bodyMat = new THREE.MeshPhongMaterial({
            color: Colors.brown,
            shading: THREE.FlatShading
        });
        var body = new THREE.Mesh(bodyGeom, bodyMat);
        body.position.set(2,-12,0);
        this.mesh.add(body);

        // face
        var faceGeom = new THREE.BoxGeometry(4,4,4);
        var faceMat = new THREE.MeshLambertMaterial({color:Colors.pink});
        var face = new THREE.Mesh(faceGeom, faceMat);
        this.mesh.add(face);

        // hair element
        var hairGeom = new THREE.BoxGeometry(4,4,4);
        var hairMat = new THREE.MeshLambertMaterial({color: Colors.brown});
        var hair = new THREE.Mesh(hairGeom, hairMat);
        // align shape of hair to bottom boundary
        // makes it easier to scale
        hair.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0,2,0));

        // container for hair
        var hairs = new THREE.Object3D();

        // container for hairs at top
        this.hairsTop = new THREE.Object3D();

        // create top hairs
        // position on 3 x 4 grid
        for (var i = 0; i < 12; i += 1) {
            var h = hair.clone();
            var col = i % 3;
            var row = Math.floor(i/3);
            var startPosX = -4;
            var startPosZ = -4;
            h.position.set(startPosX + row*4, 0, startPosZ + col*4);
            this.hairsTop.add(h);
        }
        hairs.add(this.hairsTop);

        // side hairs
        var hairSideGeom = new THREE.BoxGeometry(12,4,2);
        hairSideGeom.applyMatrix(new THREE.Matrix4().makeTranslation(-6,0,0));
        var hairSideR = new THREE.Mesh(hairSideGeom, hairMat);
        var hairSideL = hairSideR.clone();
        hairSideR.position.set(8,-2,6);
        hairSideL.position.set(8,-2,-6);
        hairs.add(hairSideR);
        hairs.add(hairSideL);

        // create hairs at back of head
        var hairBackGeom = new THREE.BoxGeometry(2,8,10);
        var hairBack = new THREE.Mesh(hairBackGeom, hairMat);
        hairBack.position.set(-1,-4,0);
        hairs.add(hairBack);
        hairs.position.set(-5,5,0);

        this.mesh.add(hairs);

        // glass
        var glassGeom = new THREE.BoxGeometry(5,5,5);
        var glassMat = new THREE.MeshLambertMaterial({color:Colors.brown});
        var glassR = new THREE.Mesh(glassGeom, glassMat);
        glassR.position.set(6,0,3);
        var glassL = glassR.clone();
        glassL.position.z = -glassR.position.z;

        var glassAGeom = new THREE.BoxGeometry(11,1,11);
        var glassA = new THREE.Mesh(glassAGeom, glassMat);
        this.mesh.add(glassR);
        this.mesh.add(glassL);
        this.mesh.add(glassA);

        // ear
        var earGeom = new THREE.BoxGeometry(2,3,2);
        var earL = new THREE.Mesh(earGeom, faceMat);
        earL.position.set(0,0,-6);
        var earR = earL.clone();
        earR.position.set(0,0,6);
        this.mesh.add(earL);
        this.mesh.add(earR);
    }

    // move hair
    updateHairs() {
        // get hair
        var hairs = this.hairsTop.children;

        // update them according to angleHairs
        var l = hairs.length;
        for (var i = 0; i < l; i += 1) {
            var h = hairs[i];
            // each hair scaled on cyclical basis b/w 75% and 100% of its original size
            h.scale.y = .75 + Math.cos(this.angleHairs + i/3)*.25;
        }

        // increment angle for next frame
        this.angleHairs += .16;
    }
}

class Airplane {
    constructor() {
        this.mesh = new THREE.Object3D();

        // create cockpit
        var geomCockpit = new THREE.BoxGeometry(80,50,50,1,1,1);
        var matCockpit  = new THREE.MeshPhongMaterial({
            color   : Colors.red,
            shading : THREE.FlatShading
        });

        // can access specific vertex thru vertices array in shape
        // moving vertices around
        geomCockpit.vertices[4].y -= 10;
        geomCockpit.vertices[4].z += 20;
        geomCockpit.vertices[5].y -= 10;
        geomCockpit.vertices[5].z -= 20;
        geomCockpit.vertices[6].y += 30;
        geomCockpit.vertices[6].z += 20;
        geomCockpit.vertices[7].y += 30;
        geomCockpit.vertices[7].z -= 20;

        var cockpit = new THREE.Mesh(geomCockpit, matCockpit);
        cockpit.castShadow = true;
        cockpit.receiveShadow = true;
        this.mesh.add(cockpit);

        // create engine
        var geomEngine = new THREE.BoxGeometry(20,50,50,1,1,1);
        var matEngine  = new THREE.MeshPhongMaterial({
            color   : Colors.white,
            shading : THREE.FlatShading
        });
        var engine     = new THREE.Mesh(geomEngine, matEngine);
        engine.position.x = 40;
        engine.castShadow = true;
        engine.receiveShadow = true;
        this.mesh.add(engine);

        // create tail
        var geomTail = new THREE.BoxGeometry(15,20,5,1,1,1);
        var matTail  = new THREE.MeshPhongMaterial({
            color   : Colors.red,
            shading : THREE.FlatShading
        });
        var tail     = new THREE.Mesh(geomTail, matTail);
        tail.position.set(-35,25,0);
        tail.castShadow = true;
        tail.receiveShadow = true;
        this.mesh.add(tail);

        // create wing
        var geomWing = new THREE.BoxGeometry(40,8,150,1,1,1);
        var matWing  = new THREE.MeshPhongMaterial({
            color : Colors.red,
            shading : THREE.FlatShading
        });
        var wing = new THREE.Mesh(geomWing, matWing);
        wing.castShadow = true;
        wing.receiveShadow = true;
        this.mesh.add(wing);

        // create propeller
        var geomPropeller = new THREE.BoxGeometry(40,8,150,1,1,1);
        var matPropeller  = new THREE.MeshPhongMaterial({
            color : Colors.brown,
            shading : THREE.FlatShading
        });
        this.propeller = new THREE.Mesh(geomPropeller, matPropeller);
        this.propeller.castShadow = true;
        this.propeller.receiveShadow = true;

        // create blades
        var geomBlade = new THREE.BoxGeometry(1,100,20,1,1,1);
        var matBlade = new THREE.MeshPhongMaterial({
            color: Colors.brownDark,
            shading: THREE.FlatShading 
        });

        var blade = new THREE.Mesh(geomBlade, matBlade);
        blade.position.set(8,0,0);
        blade.castShadow = true;
        blade.receiveShadow = true;
        this.propeller.add(blade);
        this.propeller.position.set(50,0,0);
        this.mesh.add(this.propeller);

        // add Pilot
        this.pilot = new Pilot();
        this.mesh.add(this.pilot.mesh);
    }
}

