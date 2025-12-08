import * as THREE from 'three';

// Afro Hair
export function createAfroHair(color = 0x1c1c1c) {
  const hairGroup = new THREE.Group();
  const hairMaterial = new THREE.MeshPhongMaterial({ color });

  // Main voluminous sphere
  const mainVol = new THREE.Mesh(
    new THREE.SphereGeometry(0.55, 32, 32),
    hairMaterial
  );
  // Head is at Y=0.2. Radius 0.4.
  // Afro center was (0, 0.4, 0).
  // Front of head is Z=0.4.
  // Afro radius 0.55 -> Front Z=0.55. Clipping face by 0.15.
  // Move back to -0.1 or -0.15.
  mainVol.position.set(0, 0.45, -0.15);
  // Scale to flatten slightly if desired, but afro is usually round
  mainVol.scale.set(1, 0.95, 1);
  hairGroup.add(mainVol);

  // Extra details for irregularity
  const bumps = [
    { pos: [0.35, 0.55, 0.15], s: 0.25 },
    { pos: [-0.35, 0.55, 0.15], s: 0.25 },
    { pos: [0, 0.7, -0.2], s: 0.25 },
    { pos: [0.45, 0.45, -0.25], s: 0.25 },
    { pos: [-0.45, 0.45, -0.25], s: 0.25 },
  ];

  bumps.forEach(({ pos, s }) => {
    const bump = new THREE.Mesh(
      new THREE.SphereGeometry(s, 16, 16),
      hairMaterial
    );
    bump.position.set(pos[0], pos[1], pos[2]);
    hairGroup.add(bump);
  });

  return hairGroup;
}
