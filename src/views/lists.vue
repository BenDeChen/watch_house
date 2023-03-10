<template>
    <div v-for="item in lists" @click="go(item)" class="li">{{ item.title }}</div>
</template>
<script lang="ts" setup>
 import router from '@/router'
import { useRouter } from 'vue-router'
 const touter = useRouter()
 const lists = [{
     title:"正方形贴图实现",
     name: "box"
 },{
     title:"HDR球实现",
     name:"sphere"
 }]
 const go = (item) => {
     router.push({name: item.name})
 }
</script>
<style scopes>
.li{
    border: 1px solid #f5f5f5;
    float: left;
    width: 200px;
    height: 100px;
    text-align: center;
    line-height: 100px;
    font-weight: bold;
    box-shadow: 2px 2px 4px 0 #ccc;
    margin: 10px;
    cursor: pointer;
}
</style>