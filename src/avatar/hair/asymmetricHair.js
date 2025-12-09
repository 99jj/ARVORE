import * as THREE from 'three';

// Cabelo Assimétrico / Cyberpunk
export function createAsymmetricHair(color = 0x3d2817) {
  const hairGroup = new THREE.Group();
  const hairMaterial = new THREE.MeshPhongMaterial({ color });

  // 1. Base (Cap)
  const cap = new THREE.Mesh(
    new THREE.SphereGeometry(0.41, 32, 32, 0, Math.PI*2, 0, Math.PI*0.5),
    hairMaterial
  );
  cap.position.set(0, 0.3, 0);
  hairGroup.add(cap);

  // 2. Lado Longo (Direita - Franja caída)
  const longBangGeo = new THREE.BoxGeometry(0.35, 1.4, 0.3);
  const longBang = new THREE.Mesh(longBangGeo, hairMaterial);
  longBang.position.set(0.3, -0.2, 0.25); // Na frente do rosto direito
  longBang.rotation.z = -0.1;
  longBang.rotation.y = -0.1;
  hairGroup.add(longBang);

  // 3. Lado Raspado (Esquerda)
  // Pequenos detalhes ou textura, aqui representados por geometria fina
  const shavedGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.05, 16);
  const shavedSide = new THREE.Mesh(shavedGeo, new THREE.MeshPhongMaterial({ color: 0x222222 })); // Cor de "raspado" mais escuro
  shavedSide.rotation.z = Math.PI / 2;
  shavedSide.position.set(-0.36, 0.4, 0);
  shavedSide.scale.set(1, 0.5, 1);
  // hairGroup.add(shavedSide); // Opcional, talvez conflite com a cor escolhida

  // Vamos manter a mesma cor mas geometria "colada"
  const shortSide = new THREE.Mesh(
    new THREE.BoxGeometry(0.05, 0.6, 0.6),
    hairMaterial
  );
  shortSide.position.set(-0.38, 0.3, 0);
  hairGroup.add(shortSide);

  // 4. Espetos ou volume no topo
  const spikeGeo = new THREE.ConeGeometry(0.08, 0.3, 8);
  const spike1 = new THREE.Mesh(spikeGeo, hairMaterial);
  spike1.position.set(-0.2, 0.75, 0);
  spike1.rotation.z = 0.3;
  hairGroup.add(spike1);

  const spike2 = new THREE.Mesh(spikeGeo, hairMaterial);
  spike2.position.set(-0.1, 0.78, -0.2);
  spike2.rotation.z = 0.2;
  spike2.rotation.x = -0.2;
  hairGroup.add(spike2);

  return hairGroup;
}
