// src/avatar/hair/mediumHair.js
import * as THREE from 'three';

// Cabelo masculino até o pescoço
export function createMediumHair(color = 0x8b4513) {
  const hairGroup = new THREE.Group();
  const hairMaterial = new THREE.MeshPhongMaterial({ color });

  // Parte superior (cobre a cabeça) - ajustado
  const top = new THREE.Mesh(
    new THREE.SphereGeometry(0.42, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.5),
    hairMaterial
  );
  top.position.set(0, 0.3, -0.05); // Movido para trás e para cima
  hairGroup.add(top);

  // Cabelo na nuca (até o pescoço)
  const back = new THREE.Mesh(
    new THREE.BoxGeometry(0.45, 0.5, 0.15),
    hairMaterial
  );
  back.position.set(0, -0.05, -0.35);
  hairGroup.add(back);

  // Cabelo dos lados (esquerdo) - mais curto e mais para trás
  const sideL = new THREE.Mesh(
    new THREE.BoxGeometry(0.12, 0.4, 0.2),
    hairMaterial
  );
  sideL.position.set(-0.35, -0.05, 0.05);
  hairGroup.add(sideL);

  // Cabelo dos lados (direito)
  const sideR = new THREE.Mesh(
    new THREE.BoxGeometry(0.12, 0.4, 0.2),
    hairMaterial
  );
  sideR.position.set(0.35, -0.05, 0.05);
  hairGroup.add(sideR);

  return hairGroup;
}