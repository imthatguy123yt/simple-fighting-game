const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const gravity = 0.5;

class Fighter {
    constructor(x, y, imageSrc) {
        this.position = { x: x, y: y };
        this.velocity = { x: 0, y: 0 };
        this.width = 80;
        this.height = 100;
        this.health = 100;
        this.image = new Image();
        this.image.src = imageSrc;
        this.isAttacking = false;
    }

    draw() {
        ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
    }

    update() {
        this.draw();

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        if (this.position.y + this.height + this.velocity.y >= canvas.height) {
            this.velocity.y = 0;
            this.position.y = canvas.height - this.height;
        } else {
            this.velocity.y += gravity;
        }
    }

    attack() {
        this.isAttacking = true;
        setTimeout(() => {
            this.isAttacking = false;
        }, 200);
    }
}

const player1 = new Fighter(100, 0, "p1.png");
const player2 = new Fighter(800, 0, "p2.png");

const keys = {};

window.addEventListener("keydown", (e) => {
    keys[e.key] = true;

    // P1 attack
    if (e.key === "f") player1.attack();
    // P2 attack
    if (e.key === "l") player2.attack();
});

window.addEventListener("keyup", (e) => {
    keys[e.key] = false;
});

function rectangularCollision(p1, p2) {
    return (
        p1.position.x < p2.position.x + p2.width &&
        p1.position.x + p1.width > p2.position.x &&
        p1.position.y < p2.position.y + p2.height &&
        p1.position.y + p1.height > p2.position.y
    );
}

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    player1.update();
    player2.update();

    // Player 1 controls
    player1.velocity.x = 0;
    if (keys["a"]) player1.velocity.x = -5;
    if (keys["d"]) player1.velocity.x = 5;
    if (keys["w"] && player1.velocity.y === 0) player1.velocity.y = -12;

    // Player 2 controls
    player2.velocity.x = 0;
    if (keys["ArrowLeft"]) player2.velocity.x = -5;
    if (keys["ArrowRight"]) player2.velocity.x = 5;
    if (keys["ArrowUp"] && player2.velocity.y === 0) player2.velocity.y = -12;

    // Collision detection
    if (player1.isAttacking && rectangularCollision(player1, player2)) {
        player2.health -= 10;
        document.getElementById("p2Health").style.width = player2.health + "%";
        player1.isAttacking = false;
    }

    if (player2.isAttacking && rectangularCollision(player2, player1)) {
        player1.health -= 10;
        document.getElementById("p1Health").style.width = player1.health + "%";
        player2.isAttacking = false;
    }

    // Win condition
    if (player1.health <= 0) {
        alert("Player 2 Wins!");
        window.location.reload();
    }

    if (player2.health <= 0) {
        alert("Player 1 Wins!");
        window.location.reload();
    }
}

animate();
