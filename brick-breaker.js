import {defs, tiny} from './examples/common.js';

const {
    Vector, Vector3, vec, vec3, vec4, color, hex_color, Matrix, Mat4, Light, Shape, Material, Scene,
} = tiny;

export class BrickBreaker extends Scene {
    constructor() {
        // constructor(): Scenes begin by populating initial values like the Shapes and Materials they'll need.
        super();

        // At the beginning of our program, load one of each of these shape definitions onto the GPU.
        this.shapes = {
            cube: new defs.Cube(),
            platform: new defs.Cube,

        };
        this.dir = 0;

        // *** Materials
        this.materials = {
            shiny: new Material(new defs.Phong_Shader(1),
                {ambient: 0.5, diffusivity: 0.8, specularity: 0.9, color: hex_color("#80FFFF")}),
            matte: new Material(new defs.Phong_Shader(1),
                {ambient: 0.3, diffusivity: 0, color: hex_color("#80FFFF")}),
        }

        this.initial_camera_location = Mat4.look_at(vec3(16, 16, 50), vec3(16, 16, 0), vec3(0, 1, 0));

        this.brickHealth = [
            [2,1,2,1,1,2,1,2],
            [2,2,2,2,2,2,2,2],
            [2,2,2,2,2,2,2,1],
            [2,2,2,2,2,2,2,2],
            [2,2,2,2,2,2,2,2],
            [2,2,2,2,2,2,2,2],
            [2,2,2,2,2,2,2,2],
            [2,2,2,2,2,2,1,2],
        ];

        this.brickColors = [];
        for (let i = 0; i < 8; i++) {
            let row= [];
            for (let j = 0; j < 8; j++) {
                // row.push(color(Math.random()/2+0.5, Math.random()/2+0.5, Math.random()/2+0.5, 1.0));
                row.push(color(Math.random(), Math.random(), Math.random(), 1.0));
            }
            this.brickColors.push(row);
        }

    }

    make_control_panel() {
        // Draw the scene's buttons, setup their actions and keyboard shortcuts, and monitor live measurements.

        this.key_triggered_button("Left", ["ArrowLeft"], () => {(this.dir >= -2) ? (this.dir -= 1) : null});
        this.key_triggered_button("Right", ["ArrowRight"], () => {(this.dir <= 2) ? (this.dir += 1) : null});
        this.new_line();
    }


    display(context, program_state) {
        if (!context.scratchpad.controls) {
            this.children.push(context.scratchpad.controls = new defs.Movement_Controls());
            // Define the global camera and projection matrices, which are stored in program_state.
            program_state.set_camera(this.initial_camera_location);
        }

        program_state.projection_transform = Mat4.perspective(
            Math.PI / 4, context.width / context.height, .1, 1000);

        const light_position = vec4(16, 16, 50, 1);
        // Sun attributes
        // The parameters of the Light are: position, color, size
        program_state.lights = [new Light(light_position, color(1,1,1,1), 10000)];

        const t = program_state.animation_time / 1000, dt = program_state.animation_delta_time / 1000;

        // Wall
        // stretch Y by 16 -> translate Y +16, X -0.5
        const wall_side_model_transform = Mat4.translation(0,16,0).times(Mat4.scale(1,16,1));
        const wall_top_model_transform = Mat4.translation(16,33,0).times(Mat4.scale(18,1,1));
        this.shapes.cube.draw(context, program_state, Mat4.translation(-1,0,0).times(wall_side_model_transform),
            this.materials.shiny);
        this.shapes.cube.draw(context, program_state, Mat4.translation(33,0,0).times(wall_side_model_transform),
            this.materials.shiny);
        this.shapes.cube.draw(context, program_state, wall_top_model_transform,
            this.materials.shiny);

        // Bricks
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                this.shapes.cube.draw(context, program_state, Mat4.translation(9 + 2 * j, 13 + 2 * i, 0),
                    (this.brickHealth[i][j] === 1 ? this.materials.matte : this.materials.shiny).override(this.brickColors[i][j]))
            }
        }

        //this.shapes.cube.draw(context, program_state, Mat4.identity(), this.materials.matte);



        var platform_transform = Mat4.identity();
        platform_transform = Mat4.translation(16,1,0).times(platform_transform.times(Mat4.scale(4,1,1)));
        platform_transform = platform_transform.times(Mat4.translation(this.dir, 0, 0));
        this.shapes.platform.draw(context, program_state, platform_transform, this.materials.shiny);

    }
}
