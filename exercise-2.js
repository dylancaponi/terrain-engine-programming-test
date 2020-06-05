
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


  },
  tick: function() {

    //this is how you get the cameara object's position
    let camPos = this.camera.position

    //in Blender and THREEjs the z axis is flipped. I'll fix that for you.
    let pos = {x: camPos.x, y: camPos.y, z: -camPos.z}
    console.log(pos)

  }
})
