import * as THREE from 'three';

// Ponytail Hair
export function createPonytailHair(color = 0x3d2817) {
    const hairGroup = new THREE.Group();
    const hairMaterial = new THREE.MeshPhongMaterial({ color });

    // Top part (covers head pulled back)
    const top = new THREE.Mesh(
        new THREE.SphereGeometry(0.41, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.5),
        hairMaterial
    );
    top.position.set(0, 0.3, 0);
    hairGroup.add(top);

    // The knot or tie
    const tie = new THREE.Mesh(
        new THREE.SphereGeometry(0.1, 16, 16),
        hairMaterial
    );
    tie.position.set(0, 0.4, -0.35); // Behind the head
    hairGroup.add(tie);

    // The ponytail
    const tail = new THREE.Mesh(
        new THREE.ConeGeometry(0.15, 0.6, 16),
        hairMaterial
    );
    tail.position.set(0, 0.1, -0.45); // Coming out of the knot and going down
    tail.rotation.x = -0.5; // Tilted back/down
    hairGroup.add(tail);

    return hairGroup;
}
