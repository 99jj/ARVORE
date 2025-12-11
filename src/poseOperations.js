// Pose Manipulation Operations (Mirror, Reset)
export class PoseOperations {
  /**
   * Mirror pose from one side to another
   * @param {string} sourceSide - Source side ('left' or 'right')
   * @param {Object} bones - Bones object
   */
  static mirrorPose(sourceSide, bones) {
    const targetSide = sourceSide === 'left' ? 'right' : 'left';
    const Source = sourceSide.charAt(0).toUpperCase() + sourceSide.slice(1);
    const Target = targetSide.charAt(0).toUpperCase() + targetSide.slice(1);

    const applyMirror = (sourceBone, targetBone) => {
      if (!sourceBone || !targetBone) return;
      targetBone.rotation.x = sourceBone.rotation.x;
      targetBone.rotation.y = -sourceBone.rotation.y;
      targetBone.rotation.z = -sourceBone.rotation.z;
    };

    // Mirror Arms
    ['Arm', 'Elbow', 'Forearm', 'Wrist'].forEach(part => {
      const sourceBone = bones[`${sourceSide}${part}`];
      const targetBone = bones[`${targetSide}${part}`];
      applyMirror(sourceBone, targetBone);
    });

    // Mirror Fingers
    const sourceFingers = bones[`${sourceSide}HandFingers`] || {};
    const targetFingers = bones[`${targetSide}HandFingers`] || {};

    Object.keys(sourceFingers).forEach(fingerName => {
      const sJoints = sourceFingers[fingerName];
      const tJoints = targetFingers[fingerName];
      if (!sJoints || !tJoints) return;

      applyMirror(sJoints.base, tJoints.base);
      applyMirror(sJoints.prox, tJoints.prox);
      if (sJoints.mid && tJoints.mid) applyMirror(sJoints.mid, tJoints.mid);
      applyMirror(sJoints.dist, tJoints.dist);
    });

    alert(`✅ Mirrored ${Source} to ${Target}`);
  }

  /**
   * Reset all bone rotations and positions to default
   * @param {Object} bones - Bones object
   * @param {Map} initialBonePositions - Map of initial positions
   * @param {Object} defaultPose - Default pose to apply
   */
  static resetPose(bones, initialBonePositions, defaultPose) {
    try {
      // Restore Initial Positions
      if (initialBonePositions) {
        initialBonePositions.forEach((pos, bone) => {
          bone.position.copy(pos);
        });
      }

      // Reset Rotations (Force all to 0,0,0)
      ['root', 'pelvis', 'spine', 'neck', 'head',
        'leftArm', 'leftElbow', 'leftForearm', 'leftWrist',
        'rightArm', 'rightElbow', 'rightForearm', 'rightWrist',
        'leftLeg', 'leftKnee', 'leftAnkle',
        'rightLeg', 'rightKnee', 'rightAnkle'].forEach(name => {
          if (bones[name]) bones[name].rotation.set(0, 0, 0);
        });

      // Reset fingers
      ['left', 'right'].forEach(side => {
        const fingers = bones[`${side}HandFingers`] || {};
        Object.values(fingers).forEach(joints => {
          if (joints.base) joints.base.rotation.set(0, 0, 0);
          if (joints.prox) joints.prox.rotation.set(0, 0, 0);
          if (joints.mid) joints.mid.rotation.set(0, 0, 0);
          if (joints.dist) joints.dist.rotation.set(0, 0, 0);
        });
      });

      // Apply Default Pose if exists
      if (!defaultPose) {
        console.warn('❌ Pose padrão não definida, usando T-pose completo');
      } else {
        // Note: This requires the PoseSerializer import where it's used
        // For now, we just set rotations to 0
      }

      alert('🔄 Resetado para pose padrão e posições iniciais!');
    } catch (err) {
      console.error('❌ Erro no resetPose:', err);
      alert('❌ Erro ao resetar: ' + err.message);
    }
  }
}
