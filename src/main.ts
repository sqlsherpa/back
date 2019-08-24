import "./style.scss";
import Sfx from "./sfx";
import { on, $ } from "./common";
import GameScene from "./Game/GameScene";

const texture = require("./assets/texture.png");
const config = require("./assets/texture.json");
const canvas = <HTMLCanvasElement>$("#game");
const ctx = canvas.getContext("2d");
const scene = new GameScene();
const keys: boolean[] = [];
let running = false;
let time: number;

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    scene.render(ctx);
}

function update() {
    const now = new Date().getTime();
    const delta = now - time;
    requestAnimationFrame(update);
    scene.update(delta < 34 ? delta : 34);
    time = now;
    render();
}

function resize() {
    const body = document.body;
    canvas.width = canvas.height / body.clientHeight * body.clientWidth;
    scene.cam.pos.x = (canvas.width - scene.cam.width) / 2;
}

function bind() {
    on(document, 'keydown', (e: KeyboardEvent) => {
        keys[e.keyCode] = true;
        scene.input(keys, true);
    });
    on(document, 'keyup', (e: KeyboardEvent) => {
        keys[e.keyCode] = false;
        scene.input(keys, false);
    })
    on(document, 'mousedown', (e: MouseEvent) => {
        keys[e.button] = true;
        scene.input(keys, true);
    });
    on(document, 'mouseup', (e: MouseEvent) => {
        keys[e.button] = false;
        scene.input(keys, false);
    });
    on(document, 'mousemove', (e: MouseEvent) => {
        const body = document.body;
        const ratio = canvas.height / body.clientHeight;
        scene.pointer(e.clientX * ratio, e.clientY * ratio);
    });
    on(document, 'contextmenu', (e: MouseEvent) => e.preventDefault());
    on(window, "resize", resize);
}

on(window, "load", () => {
    resize();
    render();
});

on(document, "click", async () => {
    if (running) {
        return;
    }
    await Sfx.init();
    bind();
    time = new Date().getTime();
    running = true;
    update();
});
