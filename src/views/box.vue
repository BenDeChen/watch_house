<template>
    <div class="contain" ref="contain"></div>
</template>
<script setup lang="ts">
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import gsap from 'gsap'
import { onMounted, ref } from 'vue'
const contain = ref()
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(0, 0, 5)

const cacheMesh = {
    living: {
        position: new THREE.Vector3(0, 0, 0),
        imgs: ['4_l', '4_r', '4_u', '4_d', '4_b', '4_f'],
        path: '/imgs/living/',
        mesh: null
    },
    kitchen: {
        position: new THREE.Vector3( 500 , 0, -180 * 2),
        imgs: ['0_l', '0_r', '0_u', '0_d', '0_b', '0_f'],
        path: '/imgs/kitchen/',
        mesh: null
    }
}

interface CubeOption {
    position: THREE.Vector3
    imgs: string[]
    path: string
    mesh: null | THREE.Mesh
}
// 添加一个场景
function makeCube(options: CubeOption) {
    let { imgs, position, path } = options
    // 添加立方体
    const geometry = new THREE.BoxGeometry(500, 500, 500)
    let boxMaterial = []
    imgs.forEach((item) => {
        let texture = new THREE.TextureLoader().setPath(path).load(`${item}.jpg`)
        if (item.endsWith('_u') || item.endsWith('_d')) {
            texture.rotation = Math.PI
            texture.center = new THREE.Vector2(0.5, 0.5)
        }
        boxMaterial.push(
            new THREE.MeshBasicMaterial({
                map: texture
            })
        )
    })
    const cube = new THREE.Mesh(geometry, boxMaterial)
    cube.geometry.scale(1, 1, -1)
    cube.position.copy(position)
    scene.add(cube)
    options.mesh = cube
}
makeCube(cacheMesh.living)
makeCube(cacheMesh.kitchen)

// 创建精灵
const spriteTexture = new THREE.TextureLoader().load('/imgs/arraw.png')
const spriteMetarial = new THREE.SpriteMaterial({
    map: spriteTexture
})
const sprite = new THREE.Sprite(spriteMetarial)
sprite.position.set(245, -39, -180)
sprite.scale.set(25, 25, 25)
sprite.name = 'sprite_kitchen'
scene.add(sprite)

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)

function animate() {
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
}
onMounted(() => {
    contain.value.appendChild(renderer.domElement)
    animate()

    const control = new OrbitControls(camera, contain.value)
    // control.enableDamping = true

    // 射线
    const raycaster = new THREE.Raycaster()
    const pointer = new THREE.Vector2()
    
    // 点击事件
    const mouseDown = (e) => {
        e.preventDefault()
        pointer.x = (e.clientX / window.innerWidth) * 2 - 1
        pointer.y = -(e.clientY / window.innerHeight) * 2 + 1
        // 通过摄像机和鼠标位置更新射线
        raycaster.setFromCamera(pointer, camera)
        // 计算物体和射线的焦点
        const intersects = raycaster.intersectObjects(scene.children)
        for (let i = 0; i < intersects.length; i++) {
            let name = intersects[i].object.name
            if (name && typeof name === 'string' && name.startsWith('sprite_')) {
                let cname = name.split('_')[1]
                let target = cacheMesh[cname]
                let position = camera.position.clone()
                if (cname && target.mesh) {
                    // control.target.copy(target.position)
                    // 将控制器从(0,0,0)移动到目标的位置
                    gsap.to(control.target, {
                        duration: 0.5,
                        x: target.position.x,
                        y: target.position.y,
                        z: target.position.z,
                        onComplete() {
                            // target.position为原点(0,0,0)到目标的距离，camera.position != (0,0,0)
                            // 摄像机是有初始位置，所以最后摄像机的位置等于目标位置+初始位置；
                            // 只是将摄像机移动到下一个目标的位置，相当于摄像机在(0,0,0)位置
                            gsap.to(camera.position, {
                                duration: 1,
                                x: target.position.x + position.x,
                                y: target.position.y + position.y,
                                z: target.position.z + position.z
                            })
                        }
                    })
                }
                return
            }
        }
    }
    window.addEventListener('mousedown', mouseDown)
})
</script>

<style scoped>
.contain {
    width: 100%;
    height: 100%;
}
</style>
