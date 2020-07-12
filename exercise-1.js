
/*
Exercise 1 - This is a really easy warmup.

The whole model is too many triangles (162k), so what we are going to do is slowly develop a system so that
we only load and render parts of the land model that are near us.

The model has been sliced into chunks in Blender (the 3d modeling program) and exported
in three different levels of detail.

You need to change your loader so that it doesn't load the "full model" but instead all of the
models in the "high" folder. You don't need a general solution for any model. The set of models in this exercise is static and doesn't change.

The end result should be the same — an entire map is loaded, but it will be made up of the 300 or so
little models.

Each model stores its own orgin at {0,0,0} when they are exported from the 3d modeling program, so
there's no need to set the position manually.

There are not models for every coordinate combination in the map. If the model contained no vertices in a
chunk then no model was exported.

Each model is named `bisect-x-y-z`, where x,y,z is the index (starting at 1) of the model exported
For example bisect-3-3-3 will be the model that starts at {60,60,60} and takes up the spacefrom x 60 to x 80, y 60 to y 80, z 60 to z 80 in camera and world coordinates

Success:
- no 404s on loading models
- no errors in console


*/

AFRAME.registerComponent('terrain-system', {
  init: function () {
    console.log("starting land system...")
    this.camera = document.querySelector('#camera-rig').object3D
    this.world = this.el.sceneEl.object3D //just a nice reference that helps for adding models later

    const maxModelsPerAxis = [10, 7, 13]
    const modelAxisSize = 20
    const size = maxModelsPerAxis.map(m => m*modelAxisSize)

    let geometry = new THREE.BoxGeometry(size[0], size[1], size[2], 1, 1, 1)
    let material = new THREE.MeshBasicMaterial({ wireframe: true, side: THREE.DoubleSide })
    let boundingBoxMesh = new THREE.Mesh(geometry, material)
    boundingBoxMesh.position.set(size[0]/2, size[1]/2, -size[2]/2)
    this.world.add(boundingBoxMesh)

    // gross hardcoded size limits
    for (var x = 0; x < 10; x++) {
       for (var y = 2; y < 7; y++) {
           for (var z = 0; z < 13; z++) {
            var fileName = `./models/high/bisect-${x}-${y}-${z}.gltf`

            try {
                console.log(`loading ${fileName}`)
                new THREE.GLTFLoader().load(`./models/high/bisect-${x}-${y}-${z}.gltf`, function ({ scene }) {

                    this.world.add(scene)

                  }.bind(this),
                  function(xhr) {
                  },
                  function(error) {
                  }
                )
            }catch(err) {
                console.log('file no exist');
            }

            }

       }
    }


  },
  tick: function() {

    //this is how you get the cameara object's position
    let camPos = this.camera.position

    //in Blender and THREEjs the z axis is flipped. I'll fix that for you.
    let pos = {x: camPos.x, y: camPos.y, z: -camPos.z}
    // console.log(pos)

  }
})
