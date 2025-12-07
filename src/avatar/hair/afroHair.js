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
  mainVol.position.set(0, 0.4, 0);
  // Scale to flatten slightly if desired, but afro is usually round
  mainVol.scale.set(1, 0.9, 1);
  hairGroup.add(mainVol);

  // Extra details for irregularity
  const bumps = [
    { pos: [0.3, 0.5, 0.3], s: 0.25 },
    { pos: [-0.3, 0.5, 0.3], s: 0.25 },
    { pos: [0, 0.6, -0.2], s: 0.25 },
    { pos: [0.4, 0.4, -0.2], s: 0.25 },
    { pos: [-0.4, 0.4, -0.2], s: 0.25 },
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
