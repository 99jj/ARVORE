// avatar/avatar.js (trecho modificado)
import * as THREE from 'three';
import { createSkeleton } from './skeleton.js';
import { materials } from './materials.js';

import { addTorso } from './torso.js';
import { addNeckAndHead } from './head.js';
import { addLeftArm } from './leftArm.js';
import { addRightArm } from './rightArm.js';
import { addLeftLeg } from './leftLeg.js';
import { addRightLeg } from './rightLeg.js';
import { addLeftHand } from './leftHand.js';
import { addRightHand } from './rightHand.js';
import { createLabCoat } from './labCoat.js';

export function createAvatar() {
  const avatar = new THREE.Group();
  const bones = createSkeleton();
  avatar.add(bones.root);

  // ⭐⭐⭐ MOVA ESTA LINHA PARA CIMA, ANTES de tudo! ⭐⭐⭐
  avatar.bones = bones; // Define BONES PRIMEIRO!

  // Corpo
  addTorso(bones, materials);
  addNeckAndHead(bones, materials);
  addLeftArm(bones, materials);
  addRightArm(bones, materials);
  addLeftLeg(bones, materials);
  addRightLeg(bones, materials);
  addLeftHand(bones);
  addRightHand(bones);

  // Agora sim pode criar o jaleco (avatar.bones já existe!)
 // const labCoat = createLabCoat(avatar);
 // avatar.labCoat = labCoat;

  avatar.position.y = 2.0;
  avatar.mixer = new THREE.AnimationMixer(avatar);

  return avatar;
}