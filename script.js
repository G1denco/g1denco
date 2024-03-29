// import kaboom lib
import kaboom from "https://unpkg.com/kaboom@3000.0.1/dist/kaboom.mjs";

// Extend our game with multiple scenes
// Start game
kaboom({
  background: [51, 151, 255]
})
// Load assets
loadRoot("https://kaboomjs.com/")
loadSprite("bean", "sprites/bean.png")
loadSprite("grass", "sprites/grass.png")
loadSprite("steel", "sprites/steel.png")
loadSprite("jumpy", "sprites/jumpy.png")
loadSprite("portal", "sprites/portal.png")
loadSprite("spike", "sprites/spike.png")
setGravity(1200)
const SPEED = 480
// Design 2 levels
const LEVELS = [
  [
    "  @  ^ >",
    "=========",
  ],
  [
    "  @      >",
    "===   =   =",
  ],
  [
    "                ==========",
    "               ==                              >",
    "  @  ^        ==            ^^  ===============",
    "======================     ====",
  ],
  [
    "      =====^^==",
    "     =          =",
    "    =",
    "   =                                              ^^  ^^  ^^  ^^  ^^  ^^  ^^  ^^  ^^  ^^^^",
    "   =                                            *****************************************",
    "  =                                           ======",
    "@=               ^^^^^                    =====",
    "=    =======      ==========================",
    "",
    "",
    "",
    "",
    "                    ^   ^   ^   ^   ^   ^                >",
    "            ========================================",
  ],
]
// Define a scene called "game". The callback will be run when we go() to the scene
// Scenes can accept argument from go()
scene("game", ({ levelIdx, score }) => {
  // Use the level passed, or first level
  const level = addLevel(LEVELS[levelIdx || 0], {
    tileWidth: 64,
    tileHeight: 64,
    pos: vec2(100, 200),
    tiles: {
      "@": () => [
        sprite("bean"),
        area(),
        body(),
        anchor("bot"),
        "player",
      ],
      "=": () => [
        sprite("grass"),
        area(),
        body({ isStatic: true }),
        anchor("bot"),
      ],
      "*": () => [
        sprite("steel"),
        area(),
        body({ isStatic: true }),
        anchor("bot"),
      ],
      "^": () => [
        sprite("spike"),
        area(),
        anchor("bot"),
        "danger",
      ],
      ">": () => [
        sprite("portal"),
        area(),
        anchor("bot"),
        "portal",
      ],
    },
  })
  // Get the player object from tag
  const player = level.get("player")[0]
  // Movements
  onKeyPress("space", () => {
    if (player.isGrounded()) {
      player.jump()
    }
  })
  player.onUpdate(() => {
    // Set the viewport center to player.pos
    camPos(player.worldPos())
  })
  onKeyDown("left", () => {
    player.move(-SPEED, 0)
  })
  onKeyDown("right", () => {
    player.move(SPEED, 0)
  })
  player.onCollide("danger", () => {
    player.pos = level.tile2Pos(0, 0)
    // Go to "lose" scene when we hit a "danger"
    go("lose")
  })
  onKeyPress("f", (c) => {
    setFullscreen(!isFullscreen())
  })
  // Fall death
  player.onUpdate(() => {
    if (player.pos.y >= 800) {
      go("lose")
    }
  })
  // Enter the next level on portal
  player.onCollide("portal", () => {
    if (levelIdx < LEVELS.length - 1) {
      // If there's a next level, go() to the same scene but load the next level
      go("game", {
        levelIdx: levelIdx + 1,
        score: score,
      })
    } else {
      // Otherwise we have reached the end of game, go to "win" scene!
      go("win", { score: score })
    }
  })
})
// Score counter text
scene("lose", () => {
  add([
    text("You Lose,              Press F to go into fullscreen mode."),
    pos(12),
  ])
  // Press any key to go back
  onKeyPress(start)
})
scene("win", ({ score }) => {
  add([
    text("YOU WON!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", {
      width: width(),
    }),
    pos(12),
  ])
  onKeyPress(start)
})
function start() {
  // Start with the "game" scene, with initial parameters
  go("game", {
    levelIdx: 0,
    score: 0,
  })
}
start()