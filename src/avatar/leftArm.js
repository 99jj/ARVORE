// src/avatar/leftArm.js
import * as THREE from 'three';

export function addLeftArm(bones, materials) {
  // Braço superior (ombro até cotovelo) - Encurtado 1/6
  const braco = new THREE.Mesh(
    new THREE.BoxGeometry(0.3, 0.67, 0.3),  // 0.8 - 1/6 = 0.67
    materials.bodyDark
  );
  braco.position.y = -0.2; // Ajustado para centralizar
  bones.leftArm.add(braco);

  // Antebraço (cotovelo até pulso) - Aumentado 1/6
  const antebraco = new THREE.Mesh(
    new THREE.BoxGeometry(0.25, 0.73, 0.25),  // 0.6 + 1/6 = 0.73
    materials.skin
  );
  antebraco.position.y = -0.37; // Ajustado para centralizar
  bones.leftElbow.add(antebraco);
}
