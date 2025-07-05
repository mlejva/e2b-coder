import * as THREE from 'three';

const canvas = document.getElementById('gameCanvas');
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(canvas.width, canvas.height);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, canvas.width / canvas.height, 0.1, 1000);
camera.position.z = 5;

const playerGeometry = new THREE.BoxGeometry(1, 0.5, 0.5);
const playerMaterial = new THREE.MeshBasicMaterial({ color: 'green' });
const player = new THREE.Mesh(playerGeometry, playerMaterial);
scene.add(player);

// Set up bullet properties
const bulletGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
const bulletMaterial = new THREE.MeshBasicMaterial({ color: 'yellow' });
const bullets = [];

// Set up enemy properties
const enemyGeometry = new THREE.BoxGeometry(1, 0.5, 0.5);
const enemyMaterial = new THREE.MeshBasicMaterial({ color: 'red' });
const enemies = [];
const enemyRowCount = 5;
const enemyColumnCount = 10;
const enemyPadding = 1.5;

// Initialize enemies
for (let c = 0; c < enemyColumnCount; c++) {
    for (let r = 0; r < enemyRowCount; r++) {
        const enemy = new THREE.Mesh(enemyGeometry, enemyMaterial);
        enemy.position.set(c * enemyPadding, 2 - r * enemyPadding, 0);
        enemies.push(enemy);
        scene.add(enemy);
    }
}

// Key state tracking
const keys = {};

// Shooting management
const shootingInterval = 300; // milliseconds
let lastShotTime = 0;

function animate() {
    requestAnimationFrame(animate);

    // Move player
    if (keys['ArrowLeft']) {
        player.position.x -= 0.05;
    }
    if (keys['ArrowRight']) {
        player.position.x += 0.05;
    }

    // Fire bullets
    if (keys[' ']) { // Space bar for shooting
        const currentTime = Date.now();
        if (currentTime - lastShotTime >= shootingInterval) {
            const bullet = new THREE.Mesh(bulletGeometry, bulletMaterial);
            bullet.position.set(player.position.x, player.position.y, player.position.z);
            bullets.push(bullet);
            scene.add(bullet);
            lastShotTime = currentTime;
        }
    }

    // Move bullets
    bullets.forEach((bullet, index) => {
        bullet.position.y += 0.1;
        // Remove bullets that leave the visible area
        if (bullet.position.y > 3) {
            scene.remove(bullet);
            bullets.splice(index, 1);
        }
    });

    renderer.render(scene, camera);
}

animate();

// Event listeners for keydown and keyup
window.addEventListener('keydown', function(event) {
    keys[event.key] = true;
});

window.addEventListener('keyup', function(event) {
    keys[event.key] = false;
});
