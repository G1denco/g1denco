import kaboom from "https://unpkg.com/kaboom@3000.0.1/dist/kaboom.mjs";

// initialize context
kaboom({
  background: [51, 151, 255] // The RGB code
})

// load assets
loadRoot("https://kaboomjs.com/")
loadSprite("dino", "examples/sprites/dino.png", {
  // The image contains 9 frames layed out horizontally, slice it into individual frames
  sliceX: 9,
  // Define animations
  anims: {
    "idle": {
      // Starts from frame 0, ends at frame 3
      from: 0,
      to: 3,
      // Frame per second
      speed: 5,
      loop: true,
    },
    "run": {
      from: 4,
      to: 7,
      speed: 10,
      loop: true,
    },
    // This animation only has 1 frame
    "jump": 8,
  },
})

let SPEED = 480;
const FLOOR_HEIGHT = 48;

scene("game", () => {

  add([
      rect(width(), 48),
      pos(0, height() - 48),
      outline(4),
      area(),
      body({ isStatic: true }),
      color(127, 200, 255),
  ])

// Add our player character
const player = add([
  sprite("dino"),
  scale(5),
  pos(center()),
  anchor("center"),
  area(),
  body(),
])

player.play("run")

// jump
onKeyPress("space", () => {
    if(player.isGrounded()){
    player.jump(800)
    player.play("jump")
}})

wait(3, () => {
  setGravity(1600)
}) 

player.onGround(() => {
  if (!isKeyDown("left") && !isKeyDown("right")) {
    player.play("run")
  } else {
    player.play("run")
  }
})

function spawnTree() {

    // add tree obj
    add([
        rect(48, rand(32, 96)),
        area(),
        outline(4),
        pos(width(), height() - FLOOR_HEIGHT),
        anchor("botleft"),
        color(255, 180, 255),
        move(LEFT, SPEED),
        "tree",
    ]);

    // wait a random amount of time to spawn next tree
    wait(rand(1, 3), spawnTree);

}

spawnTree()

SPEED = time() / 10 + 200;

player.onCollide("tree", () => {
    burp();
    addKaboom(player.pos);
    go("lose");
});

})

scene("lose", () => {

    add([
        sprite("dino"),
        pos(width() / 2, height() / 2 - 80),
        scale(10),
        anchor("center"),
    ]);

  let tim = time();
    // display score
    add([
        text("YOU LOST!! HAHA"),
        pos(width() / 2, height() / 2 + 80),
        scale(2),
        anchor("center"),
    ]);

    // go back to game with space is pressed
    onKeyPress("space", () => go("game"));
    onClick(() => go("game"));

});


go("game");
