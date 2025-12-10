import * as THREE from 'three';

// Penteado jogado para o lado (Side Swept)
export function createSideSweptHair(color = 0x3d2817) {
  const hairGroup = new THREE.Group();
  const hairMaterial = new THREE.MeshPhongMaterial({ color });

  // 1. Topo (Base)
  const top = new THREE.Mesh(
    new THREE.SphereGeometry(0.43, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.55),
    hairMaterial
  );
  top.position.set(0, 0.3, 0);
  hairGroup.add(top);

  // 2. Franja lateral (jogada para a Esquerda)
  // Geometria personalizada ou Box rotacionado
  const bangGeo = new THREE.BoxGeometry(0.5, 0.4, 0.15);
  const bangs = new THREE.Mesh(bangGeo, hairMaterial);
  bangs.position.set(-0.15, 0.45, 0.35); // Levemente para a esquerda
  bangs.rotation.z = 0.3; // Inclinado
  bangs.rotation.y = 0.2; // Acompanhando a curva da testa
  hairGroup.add(bangs);

  // 3. Lado Longo (Esquerda)
  const longSideGeo = new THREE.BoxGeometry(0.25, 1.2, 0.3);
  const sideL = new THREE.Mesh(longSideGeo, hairMaterial);
  sideL.position.set(-0.4, -0.2, 0.1);
  sideL.rotation.z = 0.1;
  hairGroup.add(sideL);

  // 4. Lado Curto (Direita - "tucked behind ear")
  const shortSideGeo = new THREE.BoxGeometry(0.1, 0.4, 0.25);
  const sideR = new THREE.Mesh(shortSideGeo, hairMaterial);
  sideR.position.set(0.38, 0.1, 0.1); // Mais alto e recuado
  hairGroup.add(sideR);

  // 5. Costas
  const backGeo = new THREE.BoxGeometry(0.55, 1.0, 0.25);
  const back = new THREE.Mesh(backGeo, hairMaterial);
  back.position.set(-0.1, -0.2, -0.35); // Levemente deslocado para esquerda também
  back.rotation.z = 0.05;
  hairGroup.add(back);

  return hairGroup;
}
