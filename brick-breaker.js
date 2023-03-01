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
        };

        // *** Materials
        this.materials = {
            shiny: new Material(new defs.Phong_Shader(1),
                {ambient: 0.2, diffusivity: 0.8, specularity: 0.5, color: hex_color("#80FFFF")}),
            matte: new Material(new defs.Phong_Shader(1),
                {ambient: 0.8, diffusivity: 0.2, color: hex_color("#80FFFF")}),
        }

        this.initial_camera_location = Mat4.look_at(vec3(16, 16, 50), vec3(16, 16, 0), vec3(0, 1, 0));
    }

    make_control_panel() {
        // Draw the scene's buttons, setup their actions and keyboard shortcuts, and monitor live measurements.
        this.key_triggered_button("View solar system", ["Control", "0"], () => this.attached = () => null);
        this.new_line();
        this.key_triggered_button("Attach to planet 1", ["Control", "1"], () => this.attached = () => this.planet_1);
        this.key_triggered_button("Attach to planet 2", ["Control", "2"], () => this.attached = () => this.planet_2);
        this.new_line();
        this.key_triggered_button("Attach to planet 3", ["Control", "3"], () => this.attached = () => this.planet_3);
        this.key_triggered_button("Attach to planet 4", ["Control", "4"], () => this.attached = () => this.planet_4);
        this.new_line();
        this.key_triggered_button("Attach to moon", ["Control", "m"], () => this.attached = () => this.moon);
    }


    display(context, program_state) {
        if (!context.scratchpad.controls) {
            this.children.push(context.scratchpad.controls = new defs.Movement_Controls());
            // Define the global camera and projection matrices, which are stored in program_state.
            program_state.set_camera(this.initial_camera_location);
        }

        program_state.projection_transform = Mat4.perspective(
            Math.PI / 4, context.width / context.height, .1, 1000);

        const light_position = vec4(8, 0, 100, 1);
        // Sun attributes
        // The parameters of the Light are: position, color, size
        program_state.lights = [new Light(light_position, color(1,1,1,1), 10000)];

        const t = program_state.animation_time / 1000, dt = program_state.animation_delta_time / 1000;

        // Wall
        // stretch Y by 16 -> translate Y +16, X -0.5
        const wall_side_model_transform = Mat4.translation(0,16,0).times(Mat4.scale(1,16,1));
        this.shapes.cube.draw(context, program_state, Mat4.translation(-1,0,0).times(wall_side_model_transform),
            this.materials.shiny);
        this.shapes.cube.draw(context, program_state, Mat4.translation(33,0,0).times(wall_side_model_transform),
            this.materials.shiny);
        this.shapes.cube.draw(context, program_state, Mat4.identity(), this.materials.matte);

    }
}
