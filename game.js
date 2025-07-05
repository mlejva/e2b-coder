// Space Invaders Game in JavaScript

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const player = {
    x: canvas.width / 2 - 20,
    y: canvas.height - 60,
    width: 40,
    height: 20,
    color: 'green',
    speed: 5
};

const bullets = [];

const enemies = [];
const enemyRowCount = 5;
const enemyColumnCount = 10;
const enemyWidth = 40;
const enemyHeight = 20;
const enemyPadding = 10;
const enemyOffsetTop = 30;
const enemyOffsetLeft = 30;

// Create enemies
for(let c = 0; c < enemyColumnCount; c++) {
    enemies[c] = [];
    for(let r = 0; r < enemyRowCount; r++) {
        const enemyX = c * (enemyWidth + enemyPadding) + enemyOffsetLeft;
        const enemyY = r * (enemyHeight + enemyPadding) + enemyOffsetTop;
        enemies[c][r] = { x: enemyX, y: enemyY, status: 1 };
    }
}

// Collision detection
function detectCollisions() {
    bullets.forEach((bullet, bulletIndex) => {
        enemies.forEach((column) => {
            column.forEach((enemy) => {
                if (enemy.status === 1) {
                    if (
                        bullet.x < enemy.x + enemyWidth &&
                        bullet.x + bullet.width > enemy.x &&
                        bullet.y < enemy.y + enemyHeight &&
                        bullet.y + bullet.height > enemy.y
                    ) {
                        bullet.toDelete = true;
                        enemy.status = 0;
                    }
                }
            });
        });
    });
    
    // Remove bullets marked for deletion
    for (let i = bullets.length - 1; i >= 0; i--) {
        if (bullets[i].toDelete) {
            bullets.splice(i, 1);
        }
    }
}

// Game loop
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Detect collisions
    detectCollisions();

    // Draw player
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Draw bullets
    bullets.forEach((bullet) => {
        bullet.y -= bullet.speed;
        ctx.fillStyle = bullet.color;
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });

    // Draw enemies
    for(let c = 0; c < enemyColumnCount; c++) {
        for(let r = 0; r < enemyRowCount; r++) {
            if (enemies[c][r].status == 1) {
                const enemyX = enemies[c][r].x;
                const enemyY = enemies[c][r].y;
                ctx.fillStyle = 'red';
                ctx.fillRect(enemyX, enemyY, enemyWidth, enemyHeight);
            }
        }
    }

    requestAnimationFrame(draw);
}

draw();

// Event listeners for player movement and shooting
window.addEventListener('keydown', function(event) {
    switch(event.key) {
        case 'ArrowLeft':
            if (player.x > 0) player.x -= player.speed;
            break;
        case 'ArrowRight':
            if (player.x + player.width < canvas.width) player.x += player.speed;
            break;
        case ' ': // Space bar
            bullets.push({
                x: player.x + player.width / 2 - 2,
                y: player.y,
                width: 4,
                height: 10,
                color: 'yellow',
                speed: 7
            });
            break;
    }
});
