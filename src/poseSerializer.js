// Pose Serialization and Storage
export class PoseSerializer {
  /**
   * Serialize a vector into a plain object with x, y, z properties
   * @param {THREE.Vector3|THREE.Euler} vec - Vector or Euler to serialize
   * @returns {Object} Serialized {x, y, z}
   */
  static serializeVector(vec) {
    return {
      x: parseFloat(vec.x.toFixed(4)),
      y: parseFloat(vec.y.toFixed(4)),
      z: parseFloat(vec.z.toFixed(4))
    };
  }

  /**
   * Get current pose from all bones
   * @param {Object} bones - Bones object with all skeleton parts
   * @returns {Object} Complete pose data
   */
  static getCurrentPose(bones) {
    const serialize = PoseSerializer.serializeVector;

    const pose = {
      leftArm: {
        shoulder: serialize(bones.leftArm.rotation),
        elbow: serialize(bones.leftElbow.rotation),
        forearm: serialize(bones.leftForearm.rotation),
        wrist: serialize(bones.leftWrist.rotation)
      },
      rightArm: {
        shoulder: serialize(bones.rightArm.rotation),
        elbow: serialize(bones.rightElbow.rotation),
        forearm: serialize(bones.rightForearm.rotation),
        wrist: serialize(bones.rightWrist.rotation)
      },
      body: {
        root: serialize(bones.root.rotation),
        pelvis: serialize(bones.pelvis.rotation),
        spine: serialize(bones.spine.rotation),
        neck: serialize(bones.neck.rotation),
        head: serialize(bones.head.rotation)
      },
      legs: {
        leftLeg: serialize(bones.leftLeg.rotation),
        leftKnee: serialize(bones.leftKnee.rotation),
        leftAnkle: serialize(bones.leftAnkle.rotation),
        rightLeg: serialize(bones.rightLeg.rotation),
        rightKnee: serialize(bones.rightKnee.rotation),
        rightAnkle: serialize(bones.rightAnkle.rotation)
      },
      leftFingers: {},
      rightFingers: {}
    };

    // Dedos
    ['left', 'right'].forEach(side => {
      pose[`${side}Fingers`] = {};
      Object.entries(bones[`${side}HandFingers`] || {}).forEach(([name, joints]) => {
        if (!joints) return;
        pose[`${side}Fingers`][name] = {
          base: serialize(joints.base.rotation),
          prox: serialize(joints.prox.rotation),
          mid: joints.mid ? serialize(joints.mid.rotation) : null,
          dist: serialize(joints.dist.rotation)
        };
      });
    });

    return pose;
  }

  /**
   * Apply pose to all bones
   * @param {Object} pose - Pose data to apply
   * @param {Object} bones - Bones object to apply to
   */
  static applyPose(pose, bones) {
    if (!pose) return;

    const applyRotation = (bone, rot) => {
      if (bone && rot) bone.rotation.set(rot.x, rot.y, rot.z);
    };

    // Aplica braços
    applyRotation(bones.leftArm, pose.leftArm?.shoulder);
    applyRotation(bones.leftElbow, pose.leftArm?.elbow);
    applyRotation(bones.leftForearm, pose.leftArm?.forearm);
    applyRotation(bones.leftWrist, pose.leftArm?.wrist);

    applyRotation(bones.rightArm, pose.rightArm?.shoulder);
    applyRotation(bones.rightElbow, pose.rightArm?.elbow);
    applyRotation(bones.rightForearm, pose.rightArm?.forearm);
    applyRotation(bones.rightWrist, pose.rightArm?.wrist);

    // Aplica Corpo
    if (pose.body) {
      applyRotation(bones.root, pose.body.root);
      applyRotation(bones.pelvis, pose.body.pelvis);
      applyRotation(bones.spine, pose.body.spine);
      applyRotation(bones.neck, pose.body.neck);
      applyRotation(bones.head, pose.body.head);
    }

    // Aplica Pernas
    if (pose.legs) {
      applyRotation(bones.leftLeg, pose.legs.leftLeg);
      applyRotation(bones.leftKnee, pose.legs.leftKnee);
      applyRotation(bones.leftAnkle, pose.legs.leftAnkle);
      applyRotation(bones.rightLeg, pose.legs.rightLeg);
      applyRotation(bones.rightKnee, pose.legs.rightKnee);
      applyRotation(bones.rightAnkle, pose.legs.rightAnkle);
    }

    // Aplica dedos
    ['left', 'right'].forEach(side => {
      const fingerPoses = pose[`${side}Fingers`] || {};
      Object.entries(fingerPoses).forEach(([name, rotations]) => {
        const joints = bones[`${side}HandFingers`]?.[name];
        if (!joints) return;
        applyRotation(joints.base, rotations.base);
        applyRotation(joints.prox, rotations.prox);
        if (joints.mid) applyRotation(joints.mid, rotations.mid);
        applyRotation(joints.dist, rotations.dist);
      });
    });
  }

  /**
   * Copy pose to clipboard
   * @param {Object} pose - Pose to copy
   */
  static async copyToClipboard(pose) {
    try {
      await navigator.clipboard.writeText(JSON.stringify(pose, null, 2));
      alert('✅ Pose copiada!');
    } catch {
      alert('❌ Erro ao copiar');
    }
  }

  /**
   * Paste pose from clipboard
   * @returns {Promise<Object>} Parsed pose object or null
   */
  static async pasteFromClipboard() {
    try {
      const text = await navigator.clipboard.readText();
      const pose = JSON.parse(text);
      alert('✅ Pose colada!');
      return pose;
    } catch {
      alert('❌ JSON inválido');
      return null;
    }
  }
}
