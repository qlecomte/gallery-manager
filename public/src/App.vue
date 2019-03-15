// App.vue

<template>
    <div class="body-container">
        <div class="content">
            <Navbar/>
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
  import Navbar from './components/navbar/Navbar.vue'

  export default{
    name: 'App',
    components: {
      Header,
      Footer,
      Navbar
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
        margin-left: 50px;
    }

</style>