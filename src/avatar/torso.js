// src/avatar/torso.js
import * as THREE from 'three';

export function addTorso(bones, materials) {
  const tronco = new THREE.Mesh(
    new THREE.BoxGeometry(1.0, 1.5, 0.5),
    materials.clothes
  );
  tronco.position.y = 0.75;
  bones.spine.add(tronco);
}