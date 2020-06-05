
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
