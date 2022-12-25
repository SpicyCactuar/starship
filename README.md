# Starship

Final project for the [Fundamentals of Computer Graphics subject](https://campus.exactas.uba.ar/course/view.php?id=2433) of the University of Buenos Aires.

![starship](https://user-images.githubusercontent.com/7926479/209482947-4c46be47-fd97-447e-bec6-9a0ba284c646.png)

## Gameplay

Infinite 3D Asteroids-like game. The player controls a ship that infinitely moves forward dodging asteroids. Control the ship with the arrow keys and fire a laser with the spacebar. The game ends when the ship is hit.

## Features

* WebGL graphics pipeline:
  * Rasterizer
  * Directional lightning
  * .obj model renderer
* AABB collisions, visual representations of the boxes are shown
* Simple object pooling (stars)

## How to run

1. Run `python3 -m http.server` (alternative hosting solutions should be equivalent, this is needed to access the game's assets)
2. Access `localhost:8000`
3. Game is started automatically
4. Upon finishing, restart tab to play again
