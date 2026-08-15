"use client";

import { useEffect, useRef } from "react";
import Phaser from "phaser";

export default function Game() {
  const gameContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gameContainer.current) return;

    class ArizonaScene extends Phaser.Scene {
      player!: Phaser.GameObjects.Text;
      cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
      wasd!: {
        W: Phaser.Input.Keyboard.Key;
        A: Phaser.Input.Keyboard.Key;
        S: Phaser.Input.Keyboard.Key;
        D: Phaser.Input.Keyboard.Key;
      };

      constructor() {
        super("ArizonaScene");
      }

      create() {
        // DESERT BACKGROUND
        this.add.rectangle(
          640,
          360,
          1280,
          720,
          0xd9a85c
        );

        // SUN
        this.add.circle(
          1100,
          100,
          60,
          0xffdf55
        );

        // MOUNTAINS
        this.add
          .polygon(
            200,
            300,
            [
              0, 250,
              180, 0,
              350, 250,
            ],
            0x8b6545
          );

        this.add
          .polygon(
            650,
            300,
            [
              0, 250,
              220, 0,
              450, 250,
            ],
            0x765438
          );

        // CACTI
        this.createCactus(150, 500);
        this.createCactus(1050, 500);
        this.createCactus(350, 600);
        this.createCactus(900, 580);

        // GROUND
        this.add.rectangle(
          640,
          610,
          1280,
          220,
          0xc89550
        );

        // ROAD
        this.add.rectangle(
          640,
          550,
          1280,
          80,
          0x555555
        );

        this.add.rectangle(
          640,
          550,
          1280,
          6,
          0xf5d76e
        );

        // PLAYER
        this.player = this.add
          .text(640, 450, "🧑", {
            fontSize: "48px",
          })
          .setOrigin(0.5);

        // CONTROLS
        if (this.input.keyboard) {
          this.cursors =
            this.input.keyboard.createCursorKeys();

          this.wasd = {
            W: this.input.keyboard.addKey(
              Phaser.Input.Keyboard.KeyCodes.W
            ),

            A: this.input.keyboard.addKey(
              Phaser.Input.Keyboard.KeyCodes.A
            ),

            S: this.input.keyboard.addKey(
              Phaser.Input.Keyboard.KeyCodes.S
            ),

            D: this.input.keyboard.addKey(
              Phaser.Input.Keyboard.KeyCodes.D
            ),
          };
        }

        // TITLE
        this.add
          .text(
            40,
            35,
            "🌵 AZ SIMULATOR",
            {
              fontSize: "32px",
              fontStyle: "bold",
              color: "#ffffff",
              stroke: "#5b3518",
              strokeThickness: 6,
            }
          );

        this.add
          .text(
            40,
            80,
            "WASD / Arrow Keys to move",
            {
              fontSize: "18px",
              color: "#ffffff",
              stroke: "#5b3518",
              strokeThickness: 3,
            }
          );
      }

      update() {
        const speed = 4;

        if (
          this.cursors.left.isDown ||
          this.wasd.A.isDown
        ) {
          this.player.x -= speed;
        }

        if (
          this.cursors.right.isDown ||
          this.wasd.D.isDown
        ) {
          this.player.x += speed;
        }

        if (
          this.cursors.up.isDown ||
          this.wasd.W.isDown
        ) {
          this.player.y -= speed;
        }

        if (
          this.cursors.down.isDown ||
          this.wasd.S.isDown
        ) {
          this.player.y += speed;
        }

        // KEEP PLAYER INSIDE WORLD

        this.player.x = Phaser.Math.Clamp(
          this.player.x,
          30,
          1250
        );

        this.player.y = Phaser.Math.Clamp(
          this.player.y,
          120,
          680
        );
      }

      createCactus(x: number, y: number) {
        this.add
          .text(x, y, "🌵", {
            fontSize: "50px",
          })
          .setOrigin(0.5);
      }
    }

    const game = new Phaser.Game({
      type: Phaser.AUTO,

      width: 1280,

      height: 720,

      parent: gameContainer.current,

      backgroundColor: "#d9a85c",

      scene: ArizonaScene,

      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },

      physics: {
        default: "arcade",
        arcade: {
          debug: false,
        },
      },
    });

    return () => {
      game.destroy(true);
    };
  }, []);

  return (
    <div
      ref={gameContainer}
      className="h-screen w-screen overflow-hidden bg-black"
    />
  );
}