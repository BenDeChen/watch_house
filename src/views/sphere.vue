<template>
    <div class="sphereContain" ref="contain"></div>
</template>
<script setup lang="ts">
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import gsap from 'gsap'
import { onMounted, ref } from 'vue'
const sphereContain = ref()
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000)
camera.position.set(0, 1, 5)

// 添加立方体
const geometry = new THREE.SphereGeometry(5, 32, 32)
 

let texture = new RGBELoader().load(`/imgs/hdr/Living.hdr`) 
const metarial = new THREE.MeshBasicMaterial({
    map: texture
})
const sphere = new THREE.Mesh(geometry, metarial)
sphere.geometry.scale(1,1,-1)
scene.add(sphere)

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
function animate() {
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
}
new OrbitControls(camera, renderer.domElement)
onMounted(() => {
    sphereContain.value.appendChild(renderer.domElement)
    animate()
})


</script>

<style scoped>
.contain {
    width: 100%;
    height: 100%;
}
</style>
