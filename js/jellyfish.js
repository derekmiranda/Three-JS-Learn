const THREE = require('three');
import colors from './colors';

export default class Jellyfish {
    // const geom = new THREE.ConeGeometry(5,20,32);
    // const mat = new THREE.MeshBasicMaterial({color: colors.mint});
    // this.mesh = new THREE.Mesh(geom,mat);
    constructor(height, radius, nSegments) {
        this.height = height;
        this.radius = radius;
        this.nSegments = nSegments;

        // top of jelly
        const top = height / 2;

        // extra radial distance to prevent weird overlapping
        const extraRadialDist = .01;

        // vertex increments along surface arc
        var points = [];
        const step = 1 / (nSegments - 1);
        for (var i = 0; i < nSegments; i += 1) {
            points.push(
                new THREE.Vector2(
                    extraRadialDist + i * radius * step,
                    top - (i * i) * (step * step) * height
                )
            );
        }
        var geometry = new THREE.LatheGeometry(points);
        // var material = new THREE.MeshPhongMaterial( { color: colors.mint } );
        var material = new THREE.MeshPhongMaterial({
            color: colors.mint,
            side: THREE.DoubleSide,
        });
        this.mesh = new THREE.Mesh(geometry, material);
    }

    ripple() {

    }

}