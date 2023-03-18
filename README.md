# cs174a-brickbreaker
3D Brick Breaker Game

Welcome to our 3D Brick Breaker game, a modern take on the classic arcade game. In this game, players must use a bouncing ball to hit and break all of the bricks to win. The game features a scoreboard and the ability to move around the world.

Object-Oriented Programming
We've abstracted objects into classes to simplify our code and make it more modular. Objects "talk" to each other in the top-level class, Brick_Breaker. We used Tiny Graphics Primitives to create the game's graphics, including cubes for the bricks, walls, and platform, and a subdivision sphere for the ball. Our visual concept is retro-inspired, giving players a nostalgic feel.

Advanced Feature: Collision Detection
Our game includes collision detection to determine when the ball hits a brick or wall. We use an abstraction where all brick slots are at integer coordinates, making it easier to determine which bricks are around the ball. When the ball is heading toward a brick, we damage the block and deflect the ball.

Distribution of Work
Sasan worked on the platform and user interaction, ball movement, game logic, collision detection, and brick textures and state management. Bryan worked on score tracking, the scoreboard, walls, initial brick rendering, and brick state management.

To run the game, follow these steps:

Clone the repository to your local machine
Open the project in a web development IDE such as WebStorm
Run the index.html file to open the game in a React browser page
Please note that you may need to install any necessary dependencies or prerequisites to run the game. Additionally, this game is not currently licensed or copyrighted, but please respect the intellectual property rights of the creators. Enjoy playing our 3D Brick Breaker game!
