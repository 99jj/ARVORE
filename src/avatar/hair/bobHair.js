import * as THREE from 'three';

// Bob Hair (short with bangs or straight cut)
export function createBobHair(color = 0x3d2817) {
  const hairGroup = new THREE.Group();
  const hairMaterial = new THREE.MeshPhongMaterial({ color });

  // Top part
  const top = new THREE.Mesh(
    new THREE.SphereGeometry(0.43, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.5),
    hairMaterial
  );
  top.position.set(0, 0.3, 0);
  hairGroup.add(top);

  // Sides and back (straight cut at chin/neck height)
  const back = new THREE.Mesh(
    new THREE.BoxGeometry(0.55, 0.5, 0.2),
    hairMaterial
  );
  back.position.set(0, 0.15, -0.3);
  hairGroup.add(back);

  const sideL = new THREE.Mesh(
    new THREE.BoxGeometry(0.15, 0.5, 0.4),
    hairMaterial
  );
  sideL.position.set(-0.38, 0.15, 0);
  hairGroup.add(sideL);

  const sideR = new THREE.Mesh(
    new THREE.BoxGeometry(0.15, 0.5, 0.4),
    hairMaterial
  );
  sideR.position.set(0.38, 0.15, 0);
  hairGroup.add(sideR);

  // Bangs (optional, can be a box in front)
  const bangs = new THREE.Mesh(
    new THREE.BoxGeometry(0.4, 0.15, 0.1),
    hairMaterial
  );
  bangs.position.set(0, 0.55, 0.35);
  //hairGroup.add(bangs); // Uncomment if you want bangs

  return hairGroup;
    const hairGroup = new THREE.Group();
    const hairMaterial = new THREE.MeshPhongMaterial({ color });

    // Top part
    const top = new THREE.Mesh(
        new THREE.SphereGeometry(0.43, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.5),
        hairMaterial
    );
    top.position.set(0, 0.3, 0);
    hairGroup.add(top);

    // Sides and back (straight cut at chin/neck height)
    const back = new THREE.Mesh(
        new THREE.BoxGeometry(0.55, 0.5, 0.2),
        hairMaterial
    );
    back.position.set(0, 0.15, -0.3);
    hairGroup.add(back);

    const sideL = new THREE.Mesh(
        new THREE.BoxGeometry(0.15, 0.5, 0.4),
        hairMaterial
    );
    sideL.position.set(-0.38, 0.15, 0);
    hairGroup.add(sideL);

    const sideR = new THREE.Mesh(
        new THREE.BoxGeometry(0.15, 0.5, 0.4),
        hairMaterial
    );
    sideR.position.set(0.38, 0.15, 0);
    hairGroup.add(sideR);

    // Bangs (optional, can be a box in front)
    const bangs = new THREE.Mesh(
        new THREE.BoxGeometry(0.4, 0.15, 0.1),
        hairMaterial
    );
    bangs.position.set(0, 0.55, 0.35);
    //hairGroup.add(bangs); // Uncomment if you want bangs

    return hairGroup;
}
