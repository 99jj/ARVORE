import * as THREE from 'three';

// Cabelo longo feminino - corrigido e aumentado
export function createLongHair(color = 0x3d2817) {
  const hairGroup = new THREE.Group();
  const hairMaterial = new THREE.MeshPhongMaterial({ color });

  // 1. Base do crânio (esfera principal)
  // Aumentei um pouco o raio e ajustei a posição para cobrir bem
  const topGeometry = new THREE.SphereGeometry(0.44, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.6);
  const top = new THREE.Mesh(topGeometry, hairMaterial);
  top.position.set(0, 0.28, 0); // Centralizado melhor em relação à cabeça
  hairGroup.add(top);

  // 2. Parte de trás (mais longa e larga)
  const backGeometry = new THREE.BoxGeometry(0.65, 1.5, 0.3); // Mais largo (0.65) e mais longo (1.5)
  const back = new THREE.Mesh(backGeometry, hairMaterial);
  back.position.set(0, -0.4, -0.35); // Posição ajustada para cair nas costas
  // Leve rotação para acompanhar a nuca
  back.rotation.x = 0.1;
  hairGroup.add(back);

  // 3. Laterais (Sideburns / cobertura da orelha)
  const sideGeo = new THREE.BoxGeometry(0.2, 0.8, 0.3);

  const sideL = new THREE.Mesh(sideGeo, hairMaterial);
  sideL.position.set(-0.38, 0.0, 0.05);
  sideL.rotation.z = 0.1; // Leve curva para fora
  hairGroup.add(sideL);

  const sideR = new THREE.Mesh(sideGeo, hairMaterial);
  sideR.position.set(0.38, 0.0, 0.05);
  sideR.rotation.z = -0.1;
  hairGroup.add(sideR);

  // 4. Franja (Novo! Para dar acabamento na frente)
  const bangGeo = new THREE.CylinderGeometry(0.42, 0.42, 0.2, 32, 1, true, 0, Math.PI);
  const bangs = new THREE.Mesh(bangGeo, hairMaterial);
  bangs.position.set(0, 0.45, 0); // Alto da testa
  bangs.rotation.x = Math.PI / 2; // Deitado
  bangs.rotation.y = Math.PI; // Virado pra frente
  bangs.scale.set(1, 1, 0.6); // Achatado
  // hairGroup.add(bangs); // Opção simples

  // Franja mais elaborada (tipo cortina)
  const fringeGeo = new THREE.BoxGeometry(0.4, 0.3, 0.1);
  const fringe = new THREE.Mesh(fringeGeo, hairMaterial);
  fringe.position.set(0, 0.55, 0.35);
  fringe.rotation.x = -0.2;
  hairGroup.add(fringe);

  return hairGroup;
}
