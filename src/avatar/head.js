// src/avatar/head.js
import * as THREE from 'three';
import { materials } from './materials.js';

export function addNeckAndHead(bones, materials) {
  const { skin, eyeWhite, eyeBlack, mouth } = materials;

  // Pescoço
  const pescoco = new THREE.Mesh(
    new THREE.CylinderGeometry(0.15, 0.15, 0.3, 16),
    skin
  );
  pescoco.position.y = 0.15;
  bones.neck.add(pescoco);

  // Cabeça
  const cabeca = new THREE.Mesh(
    new THREE.SphereGeometry(0.4, 32, 32),
    skin
  );
  cabeca.position.y = 0.2;
  bones.head.add(cabeca);

  // Olhos
  const olhoE = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 16), eyeWhite);
  olhoE.position.set(-0.15, 0.3, 0.35);
  bones.head.add(olhoE);

  const pupilaE = new THREE.Mesh(new THREE.SphereGeometry(0.04, 16, 16), eyeBlack);
  pupilaE.position.set(-0.15, 0.3, 0.39);
  bones.head.add(pupilaE);

  const olhoD = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 16), eyeWhite);
  olhoD.position.set(0.15, 0.3, 0.35);
  bones.head.add(olhoD);

  const pupilaD = new THREE.Mesh(new THREE.SphereGeometry(0.04, 16, 16), eyeBlack);
  pupilaD.position.set(0.15, 0.3, 0.39);
  bones.head.add(pupilaD);

  // Nariz
  const nariz = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.15, 8), skin);
  nariz.rotation.x = Math.PI / 2;
  nariz.position.set(0, 0.2, 0.42);
  bones.head.add(nariz);

  // Boca
  const boca = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.05, 0.05), mouth);
  boca.position.set(0, 0.05, 0.38);
  bones.head.add(boca);

  // Orelhas
  const orelhaE = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), skin);
  orelhaE.scale.set(0.5, 1, 0.3);
  orelhaE.position.set(-0.4, 0.2, 0);
  bones.head.add(orelhaE);

  const orelhaD = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), skin);
  orelhaD.scale.set(0.5, 1, 0.3);
  orelhaD.position.set(0.4, 0.2, 0);
  bones.head.add(orelhaD);
}