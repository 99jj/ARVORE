// src/avatar/hair/longHair.js
import * as THREE from 'three';

// Cabelo longo feminino
export function createLongHair(color = 0x3d2817) {
  const hairGroup = new THREE.Group();
  const hairMaterial = new THREE.MeshPhongMaterial({ color });

  // Parte superior (cobre a cabeça) - ajustado para não cobrir o rosto
  const top = new THREE.Mesh(
    new THREE.SphereGeometry(0.42, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.5),
    hairMaterial
  );
  top.position.set(0, 0.3, -0.05); // Movido para trás e para cima
  hairGroup.add(top);

  // Cabelo longo nas costas
  const back = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 0.9, 0.15),
    hairMaterial
  );
  back.position.set(0, -0.15, -0.35);
  hairGroup.add(back);

  // Cabelo dos lados (esquerdo)
  const sideL = new THREE.Mesh(
    new THREE.BoxGeometry(0.15, 0.7, 0.2),
    hairMaterial
  );
  sideL.position.set(-0.35, -0.05, 0.05); // Ajustado para não cobrir...
  hairGroup.add(sideL);

  // Cabelo dos lados (direito)
  const sideR = new THREE.Mesh(
    new THREE.BoxGeometry(0.15, 0.7, 0.2),
    hairMaterial
  );
  sideR.position.set(0.35, -0.05, 0.05);
  hairGroup.add(sideR);

  return hairGroup;
}