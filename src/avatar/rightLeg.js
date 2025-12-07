import * as THREE from 'three';

export function addRightLeg(bones, materials) {
  const coxa = new THREE.Mesh(
    new THREE.BoxGeometry(0.4, 0.9, 0.4),
    materials.pants
  );
  coxa.position.y = -0.45;
  bones.rightLeg.add(coxa);

  const canela = new THREE.Mesh(
    new THREE.BoxGeometry(0.35, 0.9, 0.35),
    materials.bodyDark
  );
  canela.position.y = -0.45;
  bones.rightKnee.add(canela);

  const pe = new THREE.Mesh(
    new THREE.BoxGeometry(0.4, 0.2, 0.7),
    materials.bodyDark
  );
  // Ajustado para ser relativo ao tornozelo (que está em -0.9 do joelho)
  // Antes era -0.95 do joelho, agora é -0.05 do tornozelo
  pe.position.set(0, -0.05, 0.15);
  bones.rightAnkle.add(pe);
}