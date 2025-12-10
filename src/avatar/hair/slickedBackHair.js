import * as THREE from 'three';

// Penteado pra trás (Slicked Back / Pomp)
export function createSlickedBackHair(color = 0x3d2817) {
  const hairGroup = new THREE.Group();
  const hairMaterial = new THREE.MeshPhongMaterial({ color });

  // 1. Topo principal (achatado nas laterais, alto no meio)
  const topGeo = new THREE.CylinderGeometry(0.38, 0.42, 0.7, 32, 1, false, 0, Math.PI);
  const top = new THREE.Mesh(topGeo, hairMaterial);
  top.position.set(0, 0.35, -0.1); 
  top.rotation.z = Math.PI / 2; // Deitado ao longo do eixo X (errado, queremos ao longo do Z)
  // Correção: Cylinder padrão é vertical (Y). 
  // Vamos usar Sphere deformada.
  
  const mainDome = new THREE.Mesh(
    new THREE.SphereGeometry(0.42, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.5),
    hairMaterial
  );
  mainDome.scale.set(0.9, 1.0, 1.1); // Esticado para trás
  mainDome.position.set(0, 0.3, -0.05);
  hairGroup.add(mainDome);

  // 2. Topete frontal (Volume extra na frente)
  const pompGeo = new THREE.SphereGeometry(0.2, 32, 16);
  const pomp = new THREE.Mesh(pompGeo, hairMaterial);
  pomp.scale.set(1.8, 0.6, 1.2);
  pomp.position.set(0, 0.65, 0.2); // Bem na frente e alto
  pomp.rotation.x = -0.2;
  hairGroup.add(pomp);

  // 3. Laterais raspadas/curtas (Tight sides)
  const sideGeo = new THREE.BoxGeometry(0.1, 0.5, 0.6);
  
  const sideL = new THREE.Mesh(sideGeo, hairMaterial);
  sideL.position.set(-0.38, 0.3, -0.1);
  hairGroup.add(sideL);

  const sideR = new THREE.Mesh(sideGeo, hairMaterial);
  sideR.position.set(0.38, 0.3, -0.1);
  hairGroup.add(sideR);

  // 4. Nuca (Ducktail ou simples)
  const napeGeo = new THREE.BoxGeometry(0.5, 0.4, 0.2);
  const nape = new THREE.Mesh(napeGeo, hairMaterial);
  nape.position.set(0, 0.1, -0.42);
  nape.rotation.x = 0.2;
  hairGroup.add(nape);

  return hairGroup;
}
