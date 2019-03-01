// App.vue

<template>
    <div>
        <transition name="fade">
            <router-view></router-view>
        </transition>
    </div>
</template>

<style>
    /*.fade-enter-active, .fade-leave-active {*/
        /*transition: opacity .5s*/
    /*}*/
    /*.fade-enter, .fade-leave-active {*/
        /*opacity: 0*/
    /*}*/
</style>

<script>
  import 'bootstrap/dist/css/bootstrap.css'
  import 'bootstrap-vue/dist/bootstrap-vue.css'

  export default{
  }
</script>