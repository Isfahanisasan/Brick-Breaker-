import { defs, tiny } from "./examples/common.js";

const {
    Vector,
    Vector3,
    vec,
    vec3,
    vec4,
    color,
    hex_color,
    Matrix,
    Mat4,
    Light,
    Shape,
    Material,
    Scene,
} = tiny;

export class Ball {
    constructor() {
        this.difficulty = 1;
        this.pos = vec3(0, 3, 0);
        this.vel = vec3(8, 8, 0);
        // this.acc = vec3(0,0,0)

        this.transform = Mat4.identity();

        this.shape = new defs.Subdivision_Sphere(3);
        this.material = new Material(new defs.Phong_Shader(), {
            ambient: 0.4,
            diffusivity: 0.6,
            color: hex_color("#f5a42a"),
        });
        this.hit = [];
    }

    //  Updates the position, velocity, and acceleration by euler's method
    /* velocity = velocity + acceleration * delta_time
       position = position + velocity * delta_time
    */

    update(dt, start) {
        if (start) {
            this.pos = this.pos.plus(this.vel.times(dt * this.difficulty));
            this.transform = Mat4.identity().times(
                Mat4.translation(this.pos[0], this.pos[1], this.pos[2])
            );
        }
    }

    bindToPlatform(platform, reset) {
        if (reset) {
            this.pos = vec3(platform.pos[0], platform.pos[1] + 2, this.pos[2]);
        }
    }

    checkCollisionWithPlatform(platform) {
        let x = this.pos[0];
        let y = this.pos[1];

        let platform_x = platform.pos[0];
        let platform_y = platform.pos[1];
        //hit on top of platform
        if (y - platform_y < 2 && Math.abs(x - platform_x) < 2) {
            this.vel[1] = -1 * this.vel[1];
        }
        // else if(Math.abs(x - platform_x ) < 2 && (y  - platform_y) < 1){
        //     this.vel[0] = -1 * this.vel[0];
        // }
    }

    checkCollisionWithWalls() {
        if (this.pos[0] > 31) {
            //right side wall
            this.vel[0] = -1 * this.vel[0];
            console.log("right wall hit");
        } else if (this.pos[0] < 1) {
            //left side wall
            this.vel[0] = -1 * this.vel[0];
            console.log("left wall hit");
        }

        //collision with top
        if (this.pos[1] > 31) {
            this.vel[1] = -1 * this.vel[1];
            console.log("ceiling hit");
        }
    }

    // dist(x1,y1, x2,y2){
    //     return Math.sqrt((x2-x1) * (x2-x1) + (y2-y1) * (y2-y1))
    // }
    checkCollisionWithBricks(brickGrid) {
        let brick_positions = brickGrid.brickPosition;
        let brick_health = brickGrid.brickHealth;

        let x = this.pos[0];
        let y = this.pos[1];
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                //top of the brick hit
                if (brick_health[i][j] > 0) {
                    if (
                        Math.abs(x - brick_positions[i][j][0]) < 1 &&
                        Math.abs(y - brick_positions[i][j][1]) <= 2
                    ) {
                        this.vel[1] = -1 * this.vel[1];
                        brick_health[i][j] -= 1;
                        console.log("brick top/bottom hit");
                    } else if (
                        Math.abs(y - brick_positions[i][j][1]) < 1 &&
                        Math.abs(x - brick_positions[i][j][0]) <= 2
                    ) {
                        this.vel[0] = -1 * this.vel[0];
                        brick_health[i][j] -= 1;
                        console.log("brick side hit");
                    }
                }
            }
        }
    }

    // checkIfLost(reset){
    //     // if(!reset && this.pos[1] <= 0) {
    //     //     return !reset;
    //     // }
    //
    //     return (!reset) && (this.pos[1] <= 0);
    // }

    setDifficulty(difficulty) {
        this.difficulty = difficulty;
    }

    // }
    // Displays the ball
    show(context, program_state) {
        this.transform = Mat4.identity().times(
            Mat4.translation(this.pos[0], this.pos[1], this.pos[2])
        );
        this.shape.draw(context, program_state, this.transform, this.material);
    }
}

export class Brick_Grid {
    constructor() {
        this.shape = new defs.Cube();
        this.brickHealth = [
            [2, 2, 2, 2, 2, 2, 2, 2],
            [2, 2, 2, 2, 2, 2, 2, 2],
            [2, 2, 2, 2, 2, 2, 2, 2],
            [2, 2, 2, 2, 2, 2, 2, 2],
            [2, 2, 2, 2, 2, 2, 2, 2],
            [2, 2, 2, 2, 2, 2, 2, 2],
            [2, 2, 2, 2, 2, 2, 2, 2],
            [2, 2, 2, 2, 2, 2, 2, 2],
        ];
        this.brickPosition = [];
        for (let i = 0; i < 8; i++) {
            let row = [];
            for (let j = 0; j < 8; j++) {
                // row.push(color(Math.random()/2+0.5, Math.random()/2+0.5, Math.random()/2+0.5, 1.0));
                row.push(vec3(9 + 2 * j, 13 + 2 * i, 0));
            }
            this.brickPosition.push(row);
        }
        this.brickColors = [];
        for (let i = 0; i < 8; i++) {
            let row = [];
            for (let j = 0; j < 8; j++) {
                // row.push(color(Math.random()/2+0.5, Math.random()/2+0.5, Math.random()/2+0.5, 1.0));
                row.push(
                    color(Math.random(), Math.random(), Math.random(), 1.0)
                );
            }
            this.brickColors.push(row);
        }

        this.materials = {
            shiny: new Material(new defs.Phong_Shader(1), {
                ambient: 0.5,
                diffusivity: 0.8,
                specularity: 0.9,
                color: hex_color("#80FFFF"),
            }),
            matte: new Material(new defs.Phong_Shader(1), {
                ambient: 0.3,
                diffusivity: 0,
                color: hex_color("#80FFFF"),
            }),
        };
    }

    x;

    draw_individual_cube(i, j, context, program_state) {
        if (this.brickHealth[i][j] == 2) {
            let current_brick_pos = this.brickPosition[i][j];
            this.shape.draw(
                context,
                program_state,
                Mat4.identity().times(
                    Mat4.translation(
                        current_brick_pos[0],
                        current_brick_pos[1],
                        current_brick_pos[2]
                    )
                ),
                this.materials.shiny.override(this.brickColors[i][j])
            );
        }
    }

    show(context, program_state) {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (this.brickHealth[i][j] > 0) {
                    this.draw_individual_cube(i, j, context, program_state);
                }
            }
        }
    }
}

export class Platform {
    constructor() {
        // this.platform_transform = (Mat4.scale(4,1,1));
        this.platform_transform = Mat4.identity();
        this.pos = vec3(0, 1, 0);

        (this.shape = new defs.Cube()),
            (this.material = new Material(new defs.Phong_Shader(), {
                ambient: 0.4,
                diffusivity: 0.8,
                specularity: 0.3,
                color: hex_color("#0b518a"),
            }));
    }

    // Displays the table
    show(context, program_state, platform_pos) {
        this.pos[0] = platform_pos;

        this.shape.draw(
            context,
            program_state,
            this.platform_transform.times(
                Mat4.translation(this.pos[0], this.pos[1], this.pos[2])
            ),
            this.material
        );
    }
}

export class Frame {
    constructor() {
        // this.pos = vec3(0,0,0)
        //
        // this.transform = Mat4.identity().times(Mat4.translation(0,-0.1,0)).times(Mat4.scale(5,0.2,9))
        this.wall_side_model_transform = Mat4.translation(0, 16, 0).times(
            Mat4.scale(1, 16, 1)
        );
        this.wall_top_model_transform = Mat4.translation(16, 33, 0).times(
            Mat4.scale(18, 1, 1)
        );

        this.shape = new defs.Cube();
        this.material = new Material(new defs.Phong_Shader(), {
            ambient: 0.4,
            diffusivity: 0.8,
            specularity: 0.3,
            color: hex_color("#0b518a"),
        });
    }

    // Displays the table
    show(context, program_state) {
        // this.shape.draw(context, program_state, this.transform, this.material);
        this.shape.draw(
            context,
            program_state,
            Mat4.translation(-1, 0, 0).times(this.wall_side_model_transform),
            this.material
        );
        this.shape.draw(
            context,
            program_state,
            Mat4.translation(33, 0, 0).times(this.wall_side_model_transform),
            this.material
        );
        this.shape.draw(
            context,
            program_state,
            this.wall_top_model_transform,
            this.material
        );
    }
}

class ScoreDisplay {
    constructor() {
        this.score = 0;

        this.cube = new defs.Cube();
        this.material = new Material(new defs.Phong_Shader(), {
            ambient: 1,
            diffusivity: 0.8,
            specularity: 0,
            color: hex_color("#FFFFFF"),
        });

        this.cathode_dict = {
            0: [
                [0, 1, 1, 0],
                [1, 0, 0, 1],
                [1, 0, 0, 1],
                [1, 0, 0, 1],
                [0, 1, 1, 0],
            ],
            1: [
                [1, 1, 1, 0],
                [0, 0, 1, 0],
                [0, 0, 1, 0],
                [0, 0, 1, 0],
                [1, 1, 1, 1],
            ],
            2: [
                [1, 1, 1, 0],
                [0, 0, 0, 1],
                [0, 1, 1, 0],
                [1, 0, 0, 0],
                [1, 1, 1, 1],
            ],
            3: [
                [1, 1, 1, 0],
                [0, 0, 0, 1],
                [0, 1, 1, 0],
                [0, 0, 0, 1],
                [1, 1, 1, 0],
            ],
            4: [
                [0, 0, 1, 0],
                [0, 1, 0, 0],
                [1, 0, 0, 1],
                [1, 1, 1, 1],
                [0, 0, 0, 1],
            ],
            5: [
                [1, 1, 1, 1],
                [1, 0, 0, 0],
                [1, 1, 1, 1],
                [0, 0, 0, 1],
                [1, 1, 1, 0],
            ],
            6: [
                [0, 1, 1, 1],
                [1, 0, 0, 0],
                [1, 1, 1, 1],
                [1, 0, 0, 1],
                [0, 1, 1, 0],
            ],
            7: [
                [1, 1, 1, 1],
                [0, 0, 0, 1],
                [0, 0, 1, 0],
                [0, 1, 0, 0],
                [0, 1, 0, 0],
            ],
            8: [
                [0, 1, 1, 0],
                [1, 0, 0, 1],
                [0, 1, 1, 0],
                [1, 0, 0, 1],
                [1, 1, 1, 1],
            ],
            9: [
                [1, 1, 1, 1],
                [1, 0, 0, 1],
                [0, 1, 1, 1],
                [0, 0, 0, 1],
                [1, 1, 1, 0],
            ],
        };
    }

    increment(amount) {
        this.score += amount;
    }

    show(context, program_state) {
        let score_temp = this.score;
        let digit = null;
        // let digit_mt = Mat4.scale(0.35,0.35,0.35);
        let digit_mt = Mat4.translation(34, 39, 0).times(
            Mat4.scale(0.35, 0.35, 0.35).times(Mat4.translation(-8, 0, 0))
        );

        do {
            digit = score_temp % 10;
            score_temp = Math.floor(score_temp / 10);

            // Draw the digit
            for (let i = 0; i < 5; i++) {
                for (let j = 0; j < 4; j++) {
                    if (this.cathode_dict[digit][i][j]) {
                        this.cube.draw(
                            context,
                            program_state,
                            digit_mt.times(Mat4.translation(j * 2, i * -2, 0)),
                            this.material
                        );
                    }
                }
            }

            digit_mt = digit_mt.times(Mat4.translation(-10, 0, 0));
        } while (score_temp !== 0);
    }
}

export class BrickBreaker extends Scene {
    constructor() {
        // constructor(): Scenes begin by populating initial values like the Shapes and Materials they'll need.
        super();

        this.frame = new Frame();
        this.platform = new Platform();
        this.ball = new Ball();
        this.brickGrid = new Brick_Grid();
        // At the beginning of our program, load one of each of these shape definitions onto the GPU.
        this.shapes = {
            cube: new defs.Cube(),
            // platform: new defs.Cube,
            // ball: new defs.Subdivision_Sphere(4),
        };
        this.platform_position = 16;
        this.score = new ScoreDisplay();

        this.pause = true;

        // *** Materials
        this.materials = {
            shiny: new Material(new defs.Phong_Shader(1), {
                ambient: 0.5,
                diffusivity: 0.8,
                specularity: 0.9,
                color: hex_color("#80FFFF"),
            }),
            matte: new Material(new defs.Phong_Shader(1), {
                ambient: 0.3,
                diffusivity: 0,
                color: hex_color("#80FFFF"),
            }),
            ball: new Material(new defs.Phong_Shader(), {
                ambient: 1,
                diffusivity: 1,
                color: hex_color("#B08040"),
            }),
        };

        this.initial_camera_location = Mat4.look_at(
            vec3(16, 19, 55),
            vec3(16, 19, 0),
            vec3(0, 1, 0)
        );

        this.brickHealth = [
            [2, 1, 2, 1, 1, 2, 1, 2],
            [2, 2, 2, 2, 2, 2, 2, 2],
            [2, 2, 2, 2, 2, 2, 2, 1],
            [2, 2, 2, 2, 2, 2, 2, 2],
            [2, 2, 2, 2, 2, 2, 2, 2],
            [2, 2, 2, 2, 2, 2, 2, 2],
            [2, 2, 2, 2, 2, 2, 2, 2],
            [2, 2, 2, 2, 2, 2, 1, 2],
        ];

        this.brickColors = [];
        for (let i = 0; i < 8; i++) {
            let row = [];
            for (let j = 0; j < 8; j++) {
                // row.push(color(Math.random()/2+0.5, Math.random()/2+0.5, Math.random()/2+0.5, 1.0));
                row.push(
                    color(Math.random(), Math.random(), Math.random(), 1.0)
                );
            }
            this.brickColors.push(row);
        }

        this.difficulty = 1;
    }

    make_control_panel() {
        // Draw the scene's buttons, setup their actions and keyboard shortcuts, and monitor live measurements.

        this.key_triggered_button("Left", ["ArrowLeft"], () => {
            this.platform_position >= 2 ? (this.platform_position -= 1) : null;
        });
        this.key_triggered_button("Right", ["ArrowRight"], () => {
            this.platform_position <= 30 ? (this.platform_position += 1) : null;
        });
        this.key_triggered_button("start/pause", ["x"], () => {
            this.pause = !this.pause;
        });
        this.key_triggered_button("Easy", ["e"], () => {
            this.ball.setDifficulty(1);
        });
        this.key_triggered_button("Medium", ["m"], () => {
            this.ball.setDifficulty(2);
        });
        this.key_triggered_button("Hard", ["h"], () => {
            this.ball.setDifficulty(3);
        });
        this.new_line();
    }

    display(context, program_state) {
        if (!context.scratchpad.controls) {
            this.children.push(
                (context.scratchpad.controls = new defs.Movement_Controls())
            );
            // Define the global camera and projection matrices, which are stored in program_state.
            program_state.set_camera(this.initial_camera_location);
        }

        program_state.projection_transform = Mat4.perspective(
            Math.PI / 4,
            context.width / context.height,
            0.1,
            1000
        );

        const light_position = vec4(16, 16, -50, 1);
        // Sun attributes
        // The parameters of the Light are: position, color, size
        program_state.lights = [
            new Light(light_position, color(1, 1, 1, 1), 10000),
        ];

        const t = program_state.animation_time / 1000,
            dt = program_state.animation_delta_time / 1000;
        //
        // // Wall
        // // stretch Y by 16 -> translate Y +16, X -0.5
        // const wall_side_model_transform = Mat4.translation(0,16,0).times(Mat4.scale(1,16,1));
        // const wall_top_model_transform = Mat4.translation(16,33,0).times(Mat4.scale(18,1,1));
        // this.shapes.cube.draw(context, program_state, Mat4.translation(-1,0,0).times(wall_side_model_transform),
        //     this.materials.shiny);
        // this.shapes.cube.draw(context, program_state, Mat4.translation(33,0,0).times(wall_side_model_transform),
        //     this.materials.shiny);
        // this.shapes.cube.draw(context, program_state, wall_top_model_transform,
        //     this.materials.shiny);

        // Bricks
        // for (let i = 0; i < 8; i++) {
        //     for (let j = 0; j < 8; j++) {
        //         this.shapes.cube.draw(context, program_state, Mat4.translation(9 + 2 * j, 13 + 2 * i, 0),
        //             (this.brickHealth[i][j] === 1 ? this.materials.matte : this.materials.shiny).override(this.brickColors[i][j]))
        //     }
        // }

        //this.shapes.cube.draw(context, program_state, Mat4.identity(), this.materials.matt

        //platform
        // var ball_platform_transform = Mat4.identity();
        // var platform_transform = Mat4.identity();
        //
        // ball_platform_transform = Mat4.translation(16,1,0);
        // ball_platform_transform = ball_platform_transform.times(Mat4.translation(this.dir, 0, 0));
        //
        //
        // var platform_transform = ball_platform_transform.times(Mat4.scale(4,1,1));
        //
        //
        // var ball_transform = ball_platform_transform.times(Mat4.translation(0,1,0));
        //
        //
        //
        // // var ball_transform = Mat4.identity();
        // if(!this.pause){
        //     ball_transform = ball_transform.times(Mat4.translation(2 * t,2 * t,0));
        // }
        this.frame.show(context, program_state);
        this.platform.show(context, program_state, this.platform_position);

        // this.pause = this.ball.checkIfLost(this.pause);
        //check if lost
        if (this.ball.pos[1] <= -1) {
            this.pause = !this.pause;
            this.ball.bindToPlatform(this.platform, this.pause);
            this.brickGrid.brickHealth = [
                [2, 2, 2, 2, 2, 2, 2, 2],
                [2, 2, 2, 2, 2, 2, 2, 2],
                [2, 2, 2, 2, 2, 2, 2, 2],
                [2, 2, 2, 2, 2, 2, 2, 2],
                [2, 2, 2, 2, 2, 2, 2, 2],
                [2, 2, 2, 2, 2, 2, 2, 2],
                [2, 2, 2, 2, 2, 2, 2, 2],
                [2, 2, 2, 2, 2, 2, 2, 2],
            ];
        }

        this.ball.checkCollisionWithWalls();
        this.ball.checkCollisionWithPlatform(this.platform);

        this.ball.update(dt, !this.pause);
        this.ball.bindToPlatform(this.platform, this.pause);
        this.ball.show(context, program_state);

        this.ball.checkCollisionWithBricks(this.brickGrid);
        this.brickGrid.show(context, program_state);

        this.score.show(context, program_state);

        // if(this.pause){
        //     ball_transform = platform_transform;
        // }
        // else{
        //     ball_transform = ball_transform.times(Mat4.translation(1,1,0))
        // }
        // this.shapes.ball.draw(context, program_state, ball_transform, this.materials.ball);
        // this.shapes.platform.draw(context, program_state, platform_transform, this.materials.shiny);
    }
}
