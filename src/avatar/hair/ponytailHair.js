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

  // The knot or tie - moved back to surface
  const tie = new THREE.Mesh(
    new THREE.SphereGeometry(0.1, 16, 16),
    hairMaterial
  );
  // Head center at 0.2 (relative to bone), radius 0.4. Back is ~ -0.4 (relative to head center).
  // Relative to bone (0,0,0) -> Head center is (0, 0.2, 0).
  // Back surface is at Z = -0.4. So relative to bone it is Z = -0.4.
  // Wait, SphereGeometry is centered at origin.
  // top.position is (0, 0.3, 0).
  // Head radius 0.4.
  // Back of head is Z = -0.4.
  // Let's place tie at Z = -0.4, Y = 0.4 (high ponytail).
  tie.position.set(0, 0.4, -0.4);
  hairGroup.add(tie);

  // The ponytail
  const tail = new THREE.Mesh(
    new THREE.ConeGeometry(0.15, 0.6, 16),
    hairMaterial
  );
  // Connect to tie. Tie is at (0, 0.4, -0.4).
  // Cone center is half height? No, ConeGeometry center is at half height.
  // If height is 0.6, center is 0.3 from base.
  // If we rotate it, we need to position it correctly.
  // Rotation -0.5 rad (approx -28 degrees). Tilts back.
  // Tail should start at tie and go down/back.
  // Let's position it slightly lower and further back than the tie.
  // Tie Y=0.4, Z=-0.4.
  // Tail Y=0.2, Z=-0.5.
  tail.position.set(0, 0.2, -0.55);
  tail.rotation.x = -0.8; // More tilt
  hairGroup.add(tail);

  return hairGroup;
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
