# Starship

Infinite 3D Asteroids-like game. The player controls a ship that infinitely moves forward dodging & shooting asteroids. The game ends when the ship is hit.

Final project for the [Fundamentals of Computer Graphics subject](https://campus.exactas.uba.ar/course/view.php?id=2433) of the University of Buenos Aires. The game is run by a minimal ad-hoc engine written in Javascript and leveraging WebGL.

 Co-developed with [Remruts](https://github.com/Remruts/). 

![starship](https://user-images.githubusercontent.com/7926479/209482947-4c46be47-fd97-447e-bec6-9a0ba284c646.png)

## Project Structure

```plaintext
starship/
├── models/       # Model .obj files
├── textures/     # Texture .png files
├── style/        # Site .css file
├── README.md     # Project README
├── index.html    # Site home .html file   
└── main.js       # Javascript entry point
```

## Build & Run

```python
python3 -m http.server
```

Access `localhost:8000`. Alternative hosting solutions should be equivalent. This is needed to access the game's assets locally.

Game is started automatically. Restart the tab to play again.

## Controls

| Key(s)                    | Action                                                           |
|---------------------------|------------------------------------------------------------------|
| `↑` / `↓` / `←` / `→`     | Orient ship around Z axis                                        |
| `Spacebar`                | Shoot laser                                                      |
| `Z`                       | Do a barrel roll                                                 |

## Features

* WebGL graphics pipeline:
  * Rasterizer
  * Directional lightning
  * .obj model renderer
* AABB collisions, visual representations of the boxes are shown
* Simple object pooling (stars)
