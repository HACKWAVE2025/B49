import { useGameStore } from "../store/gameStore";
export const createGameScene = ({
  Phaser,
  gameRef,
  playerRef,
  obstacleRef,
  gameRunning,
  level,
  setShowQuiz,
  setCurrentQuestion,
  setGameRunning,
  setQuestionsEncountered,
  checkLevelEnd,
  questions,
  setShowCollisionModal, // ✅ add
  setPoints,   
}) => {
  let obstacleTimer;

    const config = {
      type: Phaser.AUTO,
      width: window.innerWidth,
      height: window.innerHeight,
      parent: "phaser-container",
      backgroundColor: "#01010a",
      physics: {
        default: "arcade",
        arcade: { gravity: { y: 2500 }, debug: false },
      },
      scene: { preload, create, update },
    };

    const game = new Phaser.Game(config);
    gameRef.current = game;

    function preload() {
      this.load.image(
        "stars",
        "https://raw.githubusercontent.com/photonstorm/phaser-examples/master/examples/assets/misc/starfield.jpg"
      );
      this.load.image("ground", "https://labs.phaser.io/assets/sprites/platform.png");
      this.load.image("player", "https://labs.phaser.io/assets/sprites/phaser-dude.png");
      this.load.image("obstacle", "https://labs.phaser.io/assets/games/asteroids/asteroid2.png");
    }

    function create() {
      const bg = this.add.tileSprite(0, 0, window.innerWidth, window.innerHeight, "stars");
      bg.setOrigin(0, 0).setScrollFactor(0);

      const ground = this.physics.add.staticGroup();
      ground
        .create(window.innerWidth / 2, window.innerHeight - 50, "ground")
        .setScale(5, 2)
        .refreshBody()
        .setTint(0x222244);

      playerRef.current = this.physics.add
        .sprite(150, window.innerHeight - 150, "player")
        .setScale(1.5)
        .setTint(0x00ff88);

      playerRef.current.setCollideWorldBounds(true);
      this.physics.add.collider(playerRef.current, ground);

      obstacleRef.current = this.physics.add
        .sprite(window.innerWidth + 100, window.innerHeight - 120, "obstacle")
        .setScale(Phaser.Math.FloatBetween(0.8, 1))
        .setTint(0xff4500);
      obstacleRef.current.body.setAllowGravity(false);
      this.physics.add.collider(obstacleRef.current, ground);

      // SPACE key logic
      this.input.keyboard.on("keydown-SPACE", () => {
        const state = useGameStore.getState();
        if (!state.gameRunning || state.showQuiz || document.querySelector(".modal-active")) return;

        const distance = Math.abs(obstacleRef.current.x - playerRef.current.x);
        const onGround = playerRef.current.body.touching.down;

        if (distance < 100 && onGround) {
          const randomQ = questions[Math.floor(Math.random() * questions.length)];
          setGameRunning(false);
          setShowQuiz(true);
          setCurrentQuestion(randomQ);
        } else if (onGround) {
          playerRef.current.setVelocityY(-550);
        }
      });

      // Collision detection
      this.physics.add.collider(playerRef.current, obstacleRef.current, () => {
        if (gameRunning) {
          setGameRunning(false);
          setPoints(0);
          setShowCollisionModal(true);
        }
      });

      obstacleTimer = setInterval(() => {
        if (gameRunning && obstacleRef.current.x < -50) {
          obstacleRef.current.x = window.innerWidth + 100;
        }
      }, 1500);

      this.bg = bg;
    }

  function update() {
    const scene = this;
    if (scene.bg) scene.bg.tilePositionX += 1.5;

    // ✅ Get latest game state from store every frame
    const { gameRunning } = useGameStore.getState();
    if (!gameRunning) return; // stop movement when paused

    if (obstacleRef.current) {
      obstacleRef.current.x -= 6 + level * 0.5; // Increase difficulty per level
      if (obstacleRef.current.x < -50)
        obstacleRef.current.x = window.innerWidth + 100;
    }
  }

  const cleanup = () => {
    clearInterval(obstacleTimer);
    game.destroy(true);
  };

  return { game, cleanup };
};