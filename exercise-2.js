
/*
Exercise 2 - The real work starts here!

Now, we want to only load some of the land models based on camera position & movement.

You need to figure out a way to load models that are only within a certain radius to the camera.
You can setup your radius a few ways: maybe you want the units to be in "chunks" which means a radius of 1 should show
one chunk around you. Or, the radius could be in terms of distance to the model from the camera in camera position units.

As the camera moves you need to only show the models within that radius, and hide models outside of that radius.

You cannot just preload all the models and hide them. You need to incrementally load models and show them as the camera moves.

Success:
- editable radius
- little or no "flickering" effect on models
- no 404s on loading
- no errors in console


*/


AFRAME.registerComponent('camera-listener', {
  tick: function () {
    var cameraEl = this.el.sceneEl.camera.el;
    cam_pos = cameraEl.getAttribute('position');
    console.log(cam_pos)
    // Do something.
  }
});

AFRAME.registerComponent('terrain-system', {
  init: function () {
    console.log("BLAG starting land system...")
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

    //this is how you get the cameara object's position
    let camPos = this.camera.position

    let pos = {x: Math.round(camPos.x), y: Math.round(camPos.y), z: Math.round(-camPos.z)}


    // radius
    let r = 1

    
    // only update models if camera changes position
    if (pos.x != this.old_camera_pos.x || pos.y != this.old_camera_pos.y || pos.z != this.old_camera_pos.z) {


        // set all scenes to not visible somehow here with scene.visible = false
        // not yet implemented

        // Load 
        var pos_x = Math.round(pos.x/20)
        var pos_y = Math.round(pos.y/20)
        var pos_z = Math.round(pos.z/20)
        for (var x = pos_x-r; x <= pos_x+r; x++) {
            for (var y = pos_y-r; y <= pos_y+r; y++) {
                for (var z = pos_z-r; z <= pos_z+r; z++) {
                    if (pos_x^2+pos_y^2+pos_z^2 <= r^3) {

                        var fileName = `./models/high/bisect-${x}-${y}-${z}.gltf`
                            try {
                                if (!this.loaded.includes(fileName)) {
                                console.log(`loading ${fileName}`)
                                new THREE.GLTFLoader().load(fileName, function ({ scene }) {
                                    this.loaded.push(`./models/high/bisect-${x}-${y}-${z}.gltf`)
                                    this.world.add(scene)

                                  }.bind(this),
                                  function(xhr) {
                                  },
                                  function(error) {
                                  }
                                )}
                                else {
                                    // get already loaded scene and set to visible
                                    // not yet implemented
                                }
                            } catch(err) {
                                console.log('file no exist');
                            }
                    }
                }

            }

        }
        console.log(`old pos:${this.old_camera_pos.x}`)
        console.log(`pos:${pos.x}`)

    }
    
    this.old_camera_pos = pos

  }
})
