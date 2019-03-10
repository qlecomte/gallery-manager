// App.vue

<template>
    <div class="body-container">
        <!--<Header/>-->
        <div class="content">
            <transition name="fade">
                <router-view></router-view>
            </transition>
        </div>
        <Footer/>
    </div>
</template>

<style>
</style>

<script>
  import Header from './components/Header.vue'
  import Footer from './components/Footer.vue'

  export default{
    name: 'App',
    components: {
      Header,
      Footer
    }
  }
</script>
<style scoped>
    .body-container{
        display: flex;
        flex-direction: column;
        min-height: 100vh;
    }
    .content {
        flex-grow: 1;
    }
</style>