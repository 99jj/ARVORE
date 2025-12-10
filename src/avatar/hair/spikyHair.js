// src/avatar/hair/spikyHair.js
import * as THREE from 'three';

// Spiky Hair
export function createSpikyHair(color = 0x1c1c1c) {
  const hairGroup = new THREE.Group();
  const hairMaterial = new THREE.MeshPhongMaterial({ color });

  // Adjusted spike positions and rotations
  const spikes = [
    { pos: [0.2, 0.55, 0.15], rx: -0.2 }, // Higher and tilted back
    { pos: [-0.2, 0.55, 0.15], rx: -0.2 }, // Higher and tilted back
    { pos: [0, 0.6, 0.05], rx: -0.1 }, // Top center
    { pos: [0.15, 0.58, 0.3], rx: -0.4 }, // Front right - tilted back more to point up
    { pos: [-0.15, 0.58, 0.3], rx: -0.4 }, // Front left - tilted back more to point up
    { pos: [0.3, 0.45, 0], rx: Math.PI / 4 }, // Sides
    { pos: [-0.3, 0.45, 0], rx: -Math.PI / 4 }, // Sides
    { pos: [0, 0.45, -0.3], rx: Math.PI / 2 }, // Back
  ];

  // Top part of head
  const top = new THREE.Mesh(
    new THREE.SphereGeometry(0.4, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.5),
    hairMaterial
  );
  top.position.set(0, 0.3, 0);
  hairGroup.add(top);

  // Creating spikes
  spikes.forEach(({ pos, rx }) => {
    const spike = new THREE.Mesh(
      new THREE.ConeGeometry(0.08, 0.3, 16),
      hairMaterial
    );
    spike.position.set(pos[0], pos[1], pos[2]);
    spike.rotation.x = rx;
    hairGroup.add(spike);
  });

  return hairGroup;
}
