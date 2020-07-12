
/*

Exercise 3 - The real test.

We want to be able to optimize the scene further by using differnt LODs (levels of detail)
this means that for each area of terrain we have a model, exported from the 3d modeling program, with
less polygons

The exercise comes with 3 models for each chunk - "high", "medium" which is about 1500 polygons and "low" which is about 750.
Every chunk has a model for all three LODs or no model at all.

What you need to do is be able to set a Radius for each LOD then the program will automatically load and correctly display the right models depending on camera movement.
Depending on how you solved Exercise 2, you may set the radius of the "medium" LOD to double the "high", and "low" to triple the "high". These should be configurable.

The solution you create must handle arbitrarily many LODS, we want a general solution.

When you load an Model of a certain LOD, do not load all three LOD models at once. The models LODs are in separate files on purpose so that
we don't waste bandwidth and processing loading in all three models when only the "low" version of a model needs to be loaded and displayed.


Success:
- three editable radius's, one for each LOD
- little or no "flickering" effect on models
- no 404s on loading
- no errors in console

bonus round #1
- after initial load (which can be long), no individual tick function is more than 3ms.

bonus round #2
- no individual tick function is more than 1ms, including intitial load

*/

AFRAME.registerComponent('terrain-system', {
  init: function () {
    console.log("Exercise #3")
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
    this.old_camera_pos = {x: 0, y: 0, z: 0};
    this.loaded = [];
  },
  tick: function() {
    let camPos = this.camera.position

    let pos = {x: Math.round(camPos.x), y: Math.round(camPos.y), z: Math.round(-camPos.z)}


    // radius - high, medium, low
    let hr = 1
    let mr = 2*hr
    let lr = 3*hr

    // only update models if camera changes position
    if (pos.x != this.old_camera_pos.x || pos.y != this.old_camera_pos.y || pos.z != this.old_camera_pos.z) {
        
        // set all scenes to not visible somehow here with scene.visible = false
        // not yet implemented

        // high
        // console.log('load high models')
        var pos_x = Math.round(pos.x/20)
        var pos_y = Math.round(pos.y/20)
        var pos_z = Math.round(pos.z/20)
        for (var x = pos_x-hr; x <= pos_x+hr; x++) {
            for (var y = pos_y-hr; y <= pos_y+hr; y++) {
                for (var z = pos_z-hr; z <= pos_z+hr; z++) {
                    if (pos_x^2+pos_y^2+pos_z^2 <= hr*hr*hr) {

                        var fileName = `./models/high/bisect-${x}-${y}-${z}.gltf`
                            try {
                                if (!this.loaded.includes(fileName)) {
                                // console.log(`loading ${fileName}`)

                                new THREE.GLTFLoader().load(fileName, function ({ scene }) {
                                    this.loaded.push(fileName)
                                    this.world.add(scene)

                                  }.bind(this),
                                  function(xhr) {
                                  },
                                  function(error) {
                                  }
                                )}
                            } catch(err) {
                                console.log('file no exist');
                            }
                    }
                }

            }

        }

        // medium
        // console.log('load medium models')
        let chunk = 'medium'
        for (var x = pos_x-mr; x <= pos_x+mr; x++) {
            for (var y = pos_y-mr; y <= pos_y+mr; y++) {
                for (var z = pos_z-mr; z <= pos_z+mr; z++) {
                    if (pos_x^2+pos_y^2+pos_z^2 <= mr^3 && pos_x^2+pos_y^2+pos_z^2 > hr^3) {

                        var fileName = `./models/${chunk}/bisect-${x}-${y}-${z}.gltf`
                            try {
                                if (!this.loaded.includes(fileName)) {
                                // console.log(`loading ${fileName}`)
                                new THREE.GLTFLoader().load(fileName, function ({ scene }) {
                                    this.loaded.push(fileName)
                                    this.world.add(scene)

                                  }.bind(this),
                                  function(xhr) {
                                  },
                                  function(error) {
                                  }
                                )}
                            } catch(err) {
                                console.log('file no exist');
                            }
                    }
                }

            }

        }

        // low
        // console.log('load low models')
        chunk = 'low'
        for (var x = pos_x-mr; x <= pos_x+mr; x++) {
            for (var y = pos_y-mr; y <= pos_y+mr; y++) {
                for (var z = pos_z-mr; z <= pos_z+mr; z++) {
                    if (pos_x^2+pos_y^2+pos_z^2 <= lr^3 && pos_x^2+pos_y^2+pos_z^2 > mr^3) {

                        var fileName = `./models/${chunk}/bisect-${x}-${y}-${z}.gltf`
                            try {
                                if (!this.loaded.includes(fileName)) {
                                // console.log(`loading ${fileName}`)
                                this.loaded.push(fileName)
                                new THREE.GLTFLoader().load(fileName, function ({ scene }) {
                                    
                                    this.world.add(scene)

                                  }.bind(this),
                                  function(xhr) {
                                  },
                                  function(error) {
                                  }
                                )}
                            } catch(err) {
                                console.log('file no exist');
                            }
                    }
                }

            }

        }
        // console.log(`old pos:${this.old_camera_pos.x}`)
        // console.log(`pos:${pos.x}`)

    }
    
    this.old_camera_pos = pos

  }
})

