// src/avatar/skills/jump.js

export function setupJump(avatar, physicsWorld) {
    let isJumping = false;
    let canJump = true;
    const jumpForce = 5; // Adjust this value to control jump height
    const jumpCooldown = 500; // milliseconds before can jump again

    function jump() {
        if (!canJump || !physicsWorld || !avatar.userData.physicsBody) return;

        // Check if player is on the ground (not moving upward significantly)
        const currentVel = physicsWorld.getBodyVelocity(avatar);
        if (Math.abs(currentVel.y) > 0.5) {
            console.log('Cannot jump while in air');
            return;
        }

        // Apply upward impulse to the physics body
        physicsWorld.setBodyVelocity(avatar, currentVel.x, jumpForce, currentVel.z);

        isJumping = true;
        canJump = false;

        // Reset jump after cooldown
        setTimeout(() => {
            canJump = true;
            isJumping = false;
        }, jumpCooldown);
    }

    return {
        jump,
        isJumping: () => isJumping
    };
}
