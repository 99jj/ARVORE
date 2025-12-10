import * as THREE from 'three';

// Short curly hair
export function createCurlyHair(color = 0x3d2817) {
  const hairGroup = new THREE.Group();
  const hairMaterial = new THREE.MeshPhongMaterial({ color });

  // Base
  const base = new THREE.Mesh(
    new THREE.SphereGeometry(0.4, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.5),
    hairMaterial
  );
  base.position.set(0, 0.3, 0);
  hairGroup.add(base);

  // Curls (multiple small spheres)
  const curls = [
    { pos: [0, 0.5, 0.2], s: 0.15 },
    { pos: [0.2, 0.45, 0.2], s: 0.15 },
    { pos: [-0.2, 0.45, 0.2], s: 0.15 },
    { pos: [0, 0.4, 0.35], s: 0.15 },
    { pos: [0.3, 0.4, 0], s: 0.15 },
    { pos: [-0.3, 0.4, 0], s: 0.15 },
    { pos: [0, 0.3, -0.2], s: 0.15 },
    { pos: [0.35, 0.3, -0.1], s: 0.15 },
    { pos: [-0.35, 0.3, -0.1], s: 0.15 },
  ];

  curls.forEach(({ pos, s }) => {
    const curl = new THREE.Mesh(
      new THREE.SphereGeometry(s, 16, 16),
      hairMaterial
    );
    curl.position.set(pos[0], pos[1], pos[2]);
    hairGroup.add(curl);
  });

  return hairGroup;

}
