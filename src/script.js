import * as THREE from 'three'
import GUI from 'lil-gui'
import gsap  from 'gsap'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'   
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

/**
 * Debug
 */
const gui = new GUI()

const parameters = {
    materialColor: '#ffeded'
}

gui
    .addColor(parameters, 'materialColor')
    .onChange(() =>
    {
        material.color.set(parameters.materialColor)
        particlesMaterial.color.set(parameters.materialColor)
    })

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */




// Texture
const textureLoader = new THREE.TextureLoader()
const gradientTexture = textureLoader.load('textures/gradients/3.jpg')
gradientTexture.magFilter = THREE.NearestFilter

//Materials
const material = new THREE.MeshToonMaterial({ 
    color: parameters.materialColor,
    gradientMap: gradientTexture
})

//Meshes
const objectDistance = 4
let sectionMeshes = []

// const mesh1 = new THREE.Mesh(
//     new THREE.TorusGeometry(1, 0.4, 16, 60),
//     material
// )
//Draco Loader
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')
//Modals
let mixer = null
let Astronaut = null
let astronautAnimations = [] 

const gltfLoader = new GLTFLoader()
gltfLoader.load('/Modals/Astronaut.glb', (gltf) => {
    Astronaut = gltf.scene
    astronautAnimations = gltf.animations

    mixer = new THREE.AnimationMixer(Astronaut)

    const action = mixer.clipAction(astronautAnimations[23])
    action.play()
    action.loop = THREE.LoopOnce
     //console.log(gltf.animations)
    Astronaut.scale.set(1.5, 1.5, 1.5)
    Astronaut.position.y = - objectDistance * 0.4
    Astronaut.position.x = 2
    Astronaut.rotation.y = - Math.PI * 0.15
    scene.add(Astronaut)
   updateResponsiveObjects() 
}
)

let spaceship = null

gltfLoader.load('/Modals/Spaceship.glb', (gltf) => {
    spaceship = gltf.scene
    spaceship.scale.set(0.35, 0.35, 0.35)
    spaceship.position.y = - objectDistance * 1
    spaceship.position.x = - 5
    spaceship.rotation.y = Math.PI * 0.5
    spaceship.rotation.x = Math.PI * 0.25
    spaceship.visible = false // Initially hidden
    scene.add(spaceship)
    updateResponsiveObjects() 
}
)

let Car = null
gltfLoader.setDRACOLoader(dracoLoader)
gltfLoader.load('/Modals/model.gltf', (gltf) => {
    Car = gltf.scene
    Car.scale.set(1.5, 1.5, 1.5)
    Car.position.y = - objectDistance * 2
    Car.position.x = 1.7
    scene.add(Car)
    updateResponsiveObjects() 
})

let coin = null

gltfLoader.load('/Modals/Coin.gltf', (gltf) => {
    coin = gltf.scene
    coin.scale.set(1.5, 1.5, 1.5)
    coin.position.y = - objectDistance * 3
    coin.position.x = - 2
    coin.rotation.y = Math.PI * 0.25
    scene.add(coin)
    updateResponsiveObjects() 
})

let mech = null
let mixer2 = null
let mechAnimations = []


gltfLoader.load('Modals/Mech.glb', (gltf) => {
    mech = gltf.scene
    mechAnimations = gltf.animations

    mixer2 = new THREE.AnimationMixer(mech)
    
    const action2 = mixer2.clipAction(mechAnimations[5])
    action2.play()
    action2.loop = THREE.LoopRepeat
    console.log(gltf.animations)
    mech.scale.set(0.8, 0.8, 0.8)
    mech.position.y = - objectDistance * 4.35
    mech.position.x =  2
    mech.rotation.y = - Math.PI * 0.2
    scene.add(mech)
    updateResponsiveObjects() 
})

// const mesh1 = new THREE.Mesh(
//     new THREE.ConeGeometry(1, 2, 32),
//     material
// )
// const mesh2 = new THREE.Mesh(
//     new THREE.TorusKnotGeometry(1, 0.35, 100, 16),
//     material
// )
// const mesh3 = new THREE.Mesh(
//     new THREE.IcosahedronGeometry(1, 0),
//     material
// )
// const mesh4 = new THREE.Mesh(
//     new THREE.OctahedronGeometry(1, 0),
//     material
// )


//mesh1.position.y = - objectDistance * 1
//mesh2.position.y = - objectDistance * 2
//mesh3.position.y = - objectDistance * 3
//mesh4.position.y = - objectDistance * 4


//mesh1.position.x = - 2
//mesh2.position.x = 2
//mesh3.position.x = - 2
//mesh4.position.x = 2

//scene.add(mesh3)

sectionMeshes[0] = new THREE.Object3D()
sectionMeshes[1] = new THREE.Object3D()
sectionMeshes[2] = new THREE.Object3D()

sectionMeshes[3] = new THREE.Object3D()
sectionMeshes[4] = new THREE.Object3D()
/**
 * Particles
 */
//Geometry
const particlesCount = 500
const positions = new Float32Array(particlesCount * 3)

for(let i = 0; i < particlesCount; i++)
{
    positions[i * 3 + 0] = (Math.random() - 0.5) * 10 // x
    positions[i * 3 + 1] = objectDistance * 0.5 - Math.random() * objectDistance * sectionMeshes.length// y
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10 // z
}

const particlesGeometry = new THREE.BufferGeometry()
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

//Material
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.03,
    sizeAttenuation: true,
    color: parameters.materialColor})

//Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight('#ffffff', 3)
directionalLight.position.set(1, 1, 0)
scene.add(directionalLight)

const spotLight = new THREE.SpotLight('#ffffff', 15, 10, Math.PI , 0.25, 1)
spotLight.position.set(-4, 4, 4)
scene.add(spotLight)

const PointLight = new THREE.PointLight('#ffffff', 20, 10, Math.PI) 
PointLight.position.set(-2, -8, 2)
scene.add(PointLight)

const PointLight2 = new THREE.PointLight('#ffffff', 35, 15, Math.PI) 
PointLight2.position.set(-1, -16, 1)
scene.add(PointLight2)


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true // Enable transparency
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearAlpha(0) // Set clear color to transparent

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    objectDistance = sizes.height / 200  // Update dynamically

    // Update camera
    camera.aspect = sizes.width / sizes.height
     // Adjust FOV and distance for small screens
    if(sizes.width < 768) {
        camera.fov = 45
        camera.position.z = 4
    } else {
        camera.fov = 35
        camera.position.z = 6
    }

    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    // Reposition objects based on new objectDistance
    if (Astronaut) Astronaut.position.y = -objectDistance * 0.4
    if (spaceship) spaceship.position.y = -objectDistance * 1
    if (Car) Car.position.y = -objectDistance * 2
    if (coin) coin.position.y = -objectDistance * 3
    if (mech) mech.position.y = -objectDistance * 4.35
})

/**
 * Camera
 */
//Group
const cameraGroup = new THREE.Group()
scene.add(cameraGroup)

// Base camera
let fov = window.innerWidth < 768 ? 90 : 35 // Wider FOV on mobile
const camera = new THREE.PerspectiveCamera(fov, sizes.width / sizes.height, 0.1, 100)
if(sizes.width < 768) {
        camera.fov = 65
        camera.position.z = 4
    } else {
        camera.fov = 35
        camera.position.z = 6
    }
cameraGroup.add(camera)



/**
 * Scroll
 */
let scrollY = window.scrollY
let currentSection = 0
//let lastSection = 0

window.addEventListener('scroll', () =>
{
    scrollY = window.scrollY
    const newSection = Math.round(scrollY / sizes.height)

    if(newSection != currentSection)
    {
        currentSection = newSection
        console.log('Section changed:', currentSection)

        const mesh = sectionMeshes[currentSection]
        if(mesh && mesh.rotation) 
         {
        gsap.to(
            sectionMeshes[currentSection].rotation,
            {
                duration: 1.5,
                ease: 'power2.inOut',
                x: '+=6',
                y: '+=3',
                z: '+=1.5'
            })
         }

          // 🎯 Rotate Astronaut if section is 0 and loaded
        if (currentSection === 0 && Astronaut && mixer && astronautAnimations.length > 0) {
    gsap.to(Astronaut.rotation, {
        duration: 0.75,
        ease: 'power2.inOut',
        y: Astronaut.rotation.y + Math.PI * 2,

        onComplete: () => {
            const clip = mixer.clipAction(astronautAnimations[23])
            clip.reset()
            clip.play()
            clip.setLoop(THREE.LoopOnce, 1)
            console.log('Animation[23] played after rotation')
        }
    })
}
if (currentSection === 1 && spaceship) {

    spaceship.visible = true
    spaceship.position.x = -5

    gsap.to(spaceship.position, {
        duration: 1.5,
        ease: 'power2.inOut',
        x: -1.5
       
        })
         gsap.to(spaceship.rotation, {
        duration: 1.75,
        ease: 'power2.inOut',
        x: spaceship.rotation.x + Math.PI * 2 // full spin
    })
    }
    if(currentSection === 2 && Car) {
        
        gsap.to(Car.rotation, {
            duration: 1.5,
            ease: 'power2.inOut',
            y: Car.rotation.y + Math.PI * 2 // full spin
        })
    }
    if(currentSection === 3 && coin) {
        gsap.to(coin.rotation, {
            duration: 1.5,
            ease: 'power2.inOut',
            y: coin.rotation.y + Math.PI * 2 // full spin
        })
    }
   if ((currentSection === 4) && mech && mixer2 && mechAnimations.length > 6) {
    // Stop all current actions
    mixer2.stopAllAction()

    // Play jump animation
    const jumpAction = mixer2.clipAction(mechAnimations[6])
    jumpAction.reset()
    jumpAction.setLoop(THREE.LoopOnce, 1)
    jumpAction.clampWhenFinished = true
    jumpAction.play()

    console.log('Jump animation triggered')

    jumpAction.getMixer().addEventListener('finished', function onJumpFinished(e) {
    if (e.action === jumpAction) {
        mixer2.removeEventListener('finished', onJumpFinished)

        const yesAction = mixer2.clipAction(mechAnimations[16])
        yesAction.reset()
        yesAction.setLoop(THREE.LoopOnce, 1)
        yesAction.clampWhenFinished = true
        yesAction.play()
        console.log('Yes animation played after jump')

        // After "yes" finishes, go to idle (animation[5])
        yesAction.getMixer().addEventListener('finished', function onYesFinished(e2) {
            if (e2.action === yesAction) {
                mixer2.removeEventListener('finished', onYesFinished)

                const idleAction = mixer2.clipAction(mechAnimations[5])
                idleAction.reset()
                idleAction.setLoop(THREE.LoopRepeat, Infinity)
                idleAction.play()
                console.log('Idle animation[5] resumed')
            }
        })
    }
})
}


}})


/**
 * Cursor
 */
const cursor = {}
    cursor.x = 0
    cursor.y = 0
    
window.addEventListener('mousemove',(event)=>
{
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = event.clientY / sizes.height - 0.5

    //console.log(cursor)
})


/**
 * Responsive: Touch support for parallax
 */
let isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
if (isTouchDevice) {
    window.addEventListener('touchmove', (event) => {
        if (event.touches.length === 1) {
            const touch = event.touches[0]
            cursor.x = touch.clientX / sizes.width - 0.5
            cursor.y = touch.clientY / sizes.height - 0.5
        }
    }, { passive: true })
}

/**
 * Responsive: Adjust object scale/positions for mobile
 */
function updateResponsiveObjects() {
    const scaleFactor = sizes.width < 500 ? 0.35 : 1
    if (Astronaut) Astronaut.scale.set(1.5 * scaleFactor, 1.5 * scaleFactor, 1.5 * scaleFactor)
    if (spaceship) spaceship.scale.set(0.35 * scaleFactor, 0.35 * scaleFactor, 0.35 * scaleFactor)
    if (Car) Car.scale.set(1.5 * scaleFactor, 1.5 * scaleFactor, 1.5 * scaleFactor)
    if (coin) coin.scale.set(1.5 * scaleFactor, 1.5 * scaleFactor, 1.5 * scaleFactor)
    if (mech) mech.scale.set(0.8 * scaleFactor, 0.8 * scaleFactor, 0.8 * scaleFactor)
}
window.addEventListener('resize', updateResponsiveObjects)
updateResponsiveObjects()


/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    //Update mixer
    if(mixer)
    {
        mixer.update(deltaTime)
    }

    //Update mixer2
    if(mixer2)
    {
        mixer2.update(deltaTime)
    }

    //Update car
    if(Car)
    {
        Car.rotation.y += deltaTime * 0.25
        //Car.rotation.x += deltaTime * 0.05
    }

    //Animate Meshes
    for(const mesh of sectionMeshes)
    {
        mesh.rotation.x += deltaTime * 0.1
        mesh.rotation.y += deltaTime * 0.12
    }

    //Animate Camera
    camera.position.y = - scrollY / sizes.height * objectDistance

    const ParallaxX = cursor.x * 0.5
    const ParallaxY = - cursor.y * 0.5
    cameraGroup.position.x += (ParallaxX - cameraGroup.position.x) * 5 * deltaTime
    cameraGroup.position.y += (ParallaxY - cameraGroup.position.y) * 5 * deltaTime
    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()