import * as THREE from 'three';

// Mohawk Hair
export function createMohawkHair(color = 0x880000) { // Default punk red
  const hairGroup = new THREE.Group();
  const hairMaterial = new THREE.MeshPhongMaterial({ color });

  // Shaved base (optional, can be just skin, or a thin layer of different color)
  // We assume the head is already there and just add the crest

  // Central crest
  // Made of several cones or a thin curved box
  const strip = new THREE.Mesh(
    new THREE.BoxGeometry(0.1, 0.6, 0.7),
    hairMaterial
  );
  strip.position.set(0, 0.6, -0.1);
  // Curving or rotating to follow the head would be ideal, but simple box works as stylized

  // Better approach: Several segments following the head curve
  const segments = [
    { pos: [0, 0.75, 0.1], s: [0.1, 0.25, 0.2], r: -0.2 },
    { pos: [0, 0.7, -0.1], s: [0.1, 0.25, 0.2], r: 0 },
    { pos: [0, 0.6, -0.25], s: [0.1, 0.25, 0.2], r: 0.5 },
    { pos: [0, 0.45, -0.35], s: [0.1, 0.25, 0.2], r: 1.0 },
  ];

  segments.forEach(({ pos, s, r }) => {
    const seg = new THREE.Mesh(
      new THREE.BoxGeometry(s[0], s[1], s[2]),
      hairMaterial
    );
    seg.position.set(pos[0], pos[1], pos[2]);
    seg.rotation.x = r;
    hairGroup.add(seg);
  });

  // Larger spikes at the top
  const topSpikes = new THREE.Mesh(
    new THREE.BoxGeometry(0.08, 0.3, 0.4),
    hairMaterial
  );
  topSpikes.position.set(0, 0.7, 0);
  hairGroup.add(topSpikes);

  return hairGroup;

}
