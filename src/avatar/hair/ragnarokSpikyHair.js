import * as THREE from 'three';

// Estilo inspirado em Ragnarok (Espadachim/Heroi Shonen)
export function createRagnarokSpikyHair(color = 0x3d2817) {
  const hairGroup = new THREE.Group();
  const hairMaterial = new THREE.MeshPhongMaterial({ color });
  const bandMaterial = new THREE.MeshPhongMaterial({ color: 0x4455AA }); // Bandana azul clássica

  // 1. Base principal
  const base = new THREE.Mesh(
    new THREE.SphereGeometry(0.4, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.5),
    hairMaterial
  );
  base.position.set(0, 0.3, 0);
  hairGroup.add(base);

  // 2. Bandana (Goggles ou Faixa)
  const bandGeo = new THREE.TorusGeometry(0.41, 0.05, 8, 32);
  const band = new THREE.Mesh(bandGeo, bandMaterial);
  band.position.set(0, 0.5, 0);
  band.rotation.x = Math.PI / 2;
  hairGroup.add(band);

  // 3. Espetos Grandes (Anime style)
  const spikeGeo = new THREE.ConeGeometry(0.12, 0.6, 8);

  // Central
  const s1 = new THREE.Mesh(spikeGeo, hairMaterial);
  s1.position.set(0, 0.8, -0.1);
  hairGroup.add(s1);

  // Esquerda
  const s2 = new THREE.Mesh(spikeGeo, hairMaterial);
  s2.position.set(-0.25, 0.7, -0.05);
  s2.rotation.z = 0.5;
  hairGroup.add(s2);

  // Direita
  const s3 = new THREE.Mesh(spikeGeo, hairMaterial);
  s3.position.set(0.25, 0.7, -0.05);
  s3.rotation.z = -0.5;
  hairGroup.add(s3);

  // Trás
  const s4 = new THREE.Mesh(spikeGeo, hairMaterial);
  s4.position.set(0, 0.65, -0.35);
  s4.rotation.x = -0.6;
  hairGroup.add(s4);

  // 4. Franja espetada
  const bangSpikeGeo = new THREE.ConeGeometry(0.08, 0.4, 8);
  const b1 = new THREE.Mesh(bangSpikeGeo, hairMaterial);
  b1.position.set(0, 0.45, 0.35);
  b1.rotation.x = 0.8;
  hairGroup.add(b1);

  return hairGroup;
}
