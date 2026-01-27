import * as THREE from 'three';

export class PrimitiveManager {
    constructor(scene) {
        this.scene = scene;
        this.material = new THREE.MeshStandardMaterial({
            color: 0x888888,
            roughness: 0.5,
            metalness: 0.1
        });
    }

    createPrimitive(type) {
        switch (type.toLowerCase()) {
            case 'cube': return this.createCube();
            case 'sphere': return this.createSphere();
            case 'cylinder': return this.createCylinder();
            default:
                console.error("Unknown primitive type:", type);
                return null;
        }
    }

    createCube() {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const cube = new THREE.Mesh(geometry, this.material.clone());
        cube.position.set(0, 0.5, 0);
        cube.castShadow = true;
        cube.receiveShadow = true;
        this.scene.add(cube);
        console.log('Cube added');
        return cube;
    }

    createSphere() {
        const geometry = new THREE.SphereGeometry(0.5, 32, 32);
        const sphere = new THREE.Mesh(geometry, this.material.clone());
        sphere.position.set(0, 0.5, 0);
        sphere.castShadow = true;
        sphere.receiveShadow = true;
        this.scene.add(sphere);
        console.log('Sphere added');
        return sphere;
    }

    createCylinder() {
        const geometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
        const cylinder = new THREE.Mesh(geometry, this.material.clone());
        cylinder.position.set(0, 0.5, 0);
        cylinder.castShadow = true;
        cylinder.receiveShadow = true;
        this.scene.add(cylinder);
        console.log('Cylinder added');
        return cylinder;
    }
}
