// src/avatar/hair/spikyHair.js
import * as THREE from 'three';

// Cabelo espetado (Spiky)
export function createSpikyHair(color = 0x1c1c1c) {
  const hairGroup = new THREE.Group();
  const hairMaterial = new THREE.MeshPhongMaterial({ color });

  // Posições e rotações para os "espinhos"
  const spikes = [
    { pos: [0.2, 0.5, 0.2], rx: 0 },
    { pos: [-0.2, 0.5, 0.2], rx: 0 },
    { pos: [0, 0.55, 0.1], rx: 0 },
    { pos: [0.15, 0.55, 0.35], rx: -0.3 },
    { pos: [-0.15, 0.55, 0.35], rx: -0.3 },
    { pos: [0.3, 0.4, 0], rx: Math.PI / 4 },
    { pos: [-0.3, 0.4, 0], rx: -Math.PI / 4 },
    { pos: [0, 0.4, -0.3], rx: Math.PI / 2 },
  ];

  // Parte superior da cabeça
  const top = new THREE.Mesh(
    new THREE.SphereGeometry(0.4, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.5),
    hairMaterial
  );
  top.position.set(0, 0.3, 0);
  hairGroup.add(top);

  // Criação dos espinhos
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