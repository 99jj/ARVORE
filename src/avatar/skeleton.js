import * as THREE from 'three';

export function createSkeleton() {
  const bones = {};

  bones.root = new THREE.Bone();
  bones.root.position.y = 0;

  bones.pelvis = new THREE.Bone();
  bones.root.add(bones.pelvis);

  bones.spine = new THREE.Bone();
  bones.pelvis.add(bones.spine);

  bones.neck = new THREE.Bone();
  bones.spine.add(bones.neck);
  bones.neck.position.y = 1.5;

  bones.head = new THREE.Bone();
  bones.neck.add(bones.head);
  bones.head.position.y = 0.3;

  // ========== LEFT ARM (Shoulder -> Elbow -> Forearm -> Hand) ==========
  // Shoulder to elbow
  bones.leftArm = new THREE.Bone();
  bones.spine.add(bones.leftArm);
  bones.leftArm.position.set(-0.6, 1.3, 0);
  bones.leftArm.name = 'leftArm';

  // Elbow joint (braço encurtado 1/6)
  bones.leftElbow = new THREE.Bone();
  bones.leftArm.add(bones.leftElbow);
  bones.leftElbow.position.set(0, -0.4, 0); // Ajustado para braço 0.67
  bones.leftElbow.name = 'leftElbow';

  // Forearm (elbow to wrist) - antebraço 0.73
  bones.leftForearm = new THREE.Bone();
  bones.leftElbow.add(bones.leftForearm);
  bones.leftForearm.position.set(0, -0.55, 0); // Ajustado para antebraço 0.73
  bones.leftForearm.name = 'leftForearm';

  // Hand (wrist) - ajustado para ficar fora do antebraço
  bones.leftHand = new THREE.Bone();
  bones.leftForearm.add(bones.leftHand);
  bones.leftHand.position.set(0, -0.15, 0); // Igual ao ARVORE
  bones.leftHand.name = 'leftHand';

  // ========== RIGHT ARM (Shoulder -> Elbow -> Forearm -> Hand) ==========
  // Shoulder to elbow
  bones.rightArm = new THREE.Bone();
  bones.spine.add(bones.rightArm);
  bones.rightArm.position.set(0.6, 1.3, 0);
  bones.rightArm.name = 'rightArm';

  // Elbow joint (braço encurtado 1/6)
  bones.rightElbow = new THREE.Bone();
  bones.rightArm.add(bones.rightElbow);
  bones.rightElbow.position.set(0, -0.4, 0); // Ajustado para braço 0.67
  bones.rightElbow.name = 'rightElbow';

  // Forearm (elbow to wrist) - antebraço 0.73
  bones.rightForearm = new THREE.Bone();
  bones.rightElbow.add(bones.rightForearm);
  bones.rightForearm.position.set(0, -0.55, 0); // Ajustado para antebraço 0.73
  bones.rightForearm.name = 'rightForearm';

  // Hand (wrist) - ajustado para ficar fora do antebraço
  bones.rightHand = new THREE.Bone();
  bones.rightForearm.add(bones.rightHand);
  bones.rightHand.position.set(0, -0.15, 0); // Igual ao ARVORE
  bones.rightHand.name = 'rightHand';

  // ========== LEGS ==========
  bones.leftLeg = new THREE.Bone();
  bones.pelvis.add(bones.leftLeg);
  bones.leftLeg.position.set(-0.25, 0, 0);

  bones.rightLeg = new THREE.Bone();
  bones.pelvis.add(bones.rightLeg);
  bones.rightLeg.position.set(0.25, 0, 0);

  bones.leftKnee = new THREE.Bone();
  bones.leftLeg.add(bones.leftKnee);
  bones.leftKnee.position.y = -0.9;

  // ANKLE BONES
  bones.leftAnkle = new THREE.Bone();
  bones.leftKnee.add(bones.leftAnkle);
  bones.leftAnkle.position.y = -0.9; // Position at bottom of shin

  bones.rightKnee = new THREE.Bone();
  bones.rightLeg.add(bones.rightKnee);
  bones.rightKnee.position.y = -0.9;

  bones.rightAnkle = new THREE.Bone();
  bones.rightKnee.add(bones.rightAnkle);
  bones.rightAnkle.position.y = -0.9; // Position at bottom of shin

  return bones;
}