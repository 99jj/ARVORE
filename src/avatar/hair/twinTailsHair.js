import * as THREE from 'three';

// Estilo Twin Tails (Chiquinhas) - Clássico Anime/RO
export function createTwinTailsHair(color = 0x3d2817) {
  const hairGroup = new THREE.Group();
  const hairMaterial = new THREE.MeshPhongMaterial({ color });
  const tieMaterial = new THREE.MeshPhongMaterial({ color: 0xFF3366 }); // Lacinhos rosa

  // 1. Base (Franja reta + topo)
  const top = new THREE.Mesh(
    new THREE.SphereGeometry(0.42, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.6),
    hairMaterial
  );
  top.position.set(0, 0.3, 0);
  hairGroup.add(top);

  // Franja Reta (Hime cut style)
  const bangsGeo = new THREE.BoxGeometry(0.5, 0.35, 0.1);
  const bangs = new THREE.Mesh(bangsGeo, hairMaterial);
  bangs.position.set(0, 0.5, 0.35); // Testa alta
  bangs.rotation.x = -0.1;
  hairGroup.add(bangs);

  // 2. Chiquinha Esquerda
  const tailGeo = new THREE.ConeGeometry(0.2, 1.2, 16);
<<<<<<< HEAD
  
=======

>>>>>>> 3833eea3f71772501a5a2d428c85a8510a1cf45f
  const tailL = new THREE.Mesh(tailGeo, hairMaterial);
  tailL.position.set(-0.6, 0.2, -0.1); // Ao lado da cabeça
  tailL.rotation.z = 0.4; // Aberto pra fora
  tailL.rotation.x = 0.2;
  hairGroup.add(tailL);

  // Laço Esquerda
  const tieL = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), tieMaterial);
  tieL.position.set(-0.45, 0.5, -0.05); // Base da chiquinha
  hairGroup.add(tieL);


  // 3. Chiquinha Direita
  const tailR = new THREE.Mesh(tailGeo, hairMaterial);
  tailR.position.set(0.6, 0.2, -0.1);
  tailR.rotation.z = -0.4;
  tailR.rotation.x = 0.2;
  hairGroup.add(tailR);

  // Laço Direita
  const tieR = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), tieMaterial);
  tieR.position.set(0.45, 0.5, -0.05);
  hairGroup.add(tieR);

  return hairGroup;
}
