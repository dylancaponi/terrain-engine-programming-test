
AFRAME.registerComponent('terrain-system', {
  init: function () {
    console.log("starting land system...")
    this.camera = document.querySelector('#camera-rig').object3D
    this.world = this.el.sceneEl.object3D //just a nice reference that helps for adding models later


    //This maximum number of models in each axis [x,y,z]
    const maxModelsPerAxis = [10, 7, 13]

    //Each model is 20 units per side, they are cubes of size (20,20,20)
    const modelAxisSize = 20

    //We can multiply the number of terrain meshes on each side by 20 to get the bounding size of the world.
    const size = maxModelsPerAxis.map(m => m*modelAxisSize)

    //This is just a helper to add a bounding box into the scene that is the size of the maximum of the world.
    //This way you know there won't be land meshes outside of this box.
    let geometry = new THREE.BoxGeometry(size[0], size[1], size[2], 1, 1, 1)
    let material = new THREE.MeshBasicMaterial({ wireframe: true, side: THREE.DoubleSide })
    let boundingBoxMesh = new THREE.Mesh(geometry, material)
    boundingBoxMesh.position.set(size[0]/2, size[1]/2, -size[2]/2)

    //Add the box to the scene
    this.world.add(boundingBoxMesh)

    //This function takes a string of a filename and loads the model.
    //All of the models are named with the format "bisect-X-Y-Z-LOD.gltf"
    new THREE.GLTFLoader().load('./models/fullmodel.gltf', function ({ scene }) {

        //you may be tempted to inspect `scene` to find out how it stores it's own position but you don't need to.
        //will store a reference to this model here for later
        this.fullLandModel = scene

        //Add the model (which is called a scene by the gltf importer) to our world
        //by default models are added with the `visible` property set to true.
        //if you wanted to you could set visibility prior to adding, `scene.visible = false`
        this.world.add(scene)

      }.bind(this),
      function(xhr) {
        //used for loading progress notifications
      },
      function(error) {
        //called when error occurs
      }
    )
  },
  //Each requestAnimationFrame the tick function on every component is called,
  //then when those are all done the scene is rendered to the canvas.
  //this means that all things in tick will finish before a frame is rendered (unless its async stuff)
  tick: function() {
    let time = Date.now()

    //this is how you get the cameara object's position
    let camPos = this.camera.position

    //in Blender and THREEjs the z axis is flipped. I'll fix that for you.
    let pos = {x: camPos.x, y: camPos.y, z: -camPos.z}
    console.log(pos)


    //to hide and show objects, set the .visible parameter on an model
    //TEST IT OUT IN THE BROWSER!
    // move forward with "W" key just a bit, and the mesh will hide.
    //move back and it isn't hidden anymore
    if(this.fullLandModel) {
      this.fullLandModel.visible = (pos.z > 105) ? false : true
    }

    const duration = Date.now() - time;
    if (duration > 3) console.warn(`Long tick: ${duration}ms`);
  }
})
