import pygame
import sys

pygame.init()

WIDTH, HEIGHT = 1000, 500
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Simple Python Fighting Game")

clock = pygame.time.Clock()
gravity = 0.8

WHITE = (255, 255, 255)
GREEN = (0, 255, 0)
RED = (255, 0, 0)

class Fighter:
    def __init__(self, x, y, image_path):
        self.image = pygame.image.load(image_path)
        self.image = pygame.transform.scale(self.image, (100, 120))
        self.rect = self.image.get_rect(topleft=(x, y))
        self.vel_y = 0
        self.speed = 6
        self.jump_power = -18
        self.health = 100
        self.attacking = False

    def move(self, keys, left, right, jump):
        dx = 0

        if keys[left]:
            dx = -self.speed
        if keys[right]:
            dx = self.speed

        if keys[jump] and self.rect.bottom >= HEIGHT:
            self.vel_y = self.jump_power

        self.vel_y += gravity
        self.rect.y += self.vel_y

        if self.rect.bottom >= HEIGHT:
            self.rect.bottom = HEIGHT
            self.vel_y = 0

        self.rect.x += dx

    def draw(self):
        screen.blit(self.image, self.rect)

    def attack(self):
        self.attacking = True

    def reset_attack(self):
        self.attacking = False

player1 = Fighter(200, HEIGHT - 120, "p1.png")
player2 = Fighter(700, HEIGHT - 120, "p2.png")

while True:
    clock.tick(60)
    screen.fill(WHITE)

    keys = pygame.key.get_pressed()

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            pygame.quit()
            sys.exit()

        if event.type == pygame.KEYDOWN:
            if event.key == pygame.K_f:
                player1.attack()
            if event.key == pygame.K_l:
                player2.attack()

    player1.move(keys, pygame.K_a, pygame.K_d, pygame.K_w)
    player2.move(keys, pygame.K_LEFT, pygame.K_RIGHT, pygame.K_UP)

    if player1.attacking and player1.rect.colliderect(player2.rect):
        player2.health -= 10
        player1.reset_attack()

    if player2.attacking and player2.rect.colliderect(player1.rect):
        player1.health -= 10
        player2.reset_attack()

    player1.draw()
    player2.draw()

    pygame.display.update()
