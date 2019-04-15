// App.vue

<template>
    <div class="body-container">
        <div class="content">
            <NavbarSettings v-if="inSettings"/>
            <Navbar v-else/>
            <transition name="fade">
                <router-view></router-view>
            </transition>
        </div>
        <!--<Footer/>-->
    </div>
</template>

<style>
</style>

<script>
  import Header from './components/Header.vue'
  import Footer from './components/Footer.vue'
  import Navbar from './components/navbar/Navbar.vue'
  import NavbarSettings from './components/navbar/NavbarSettings.vue'

  export default{
    name: 'App',
    components: {
      Header,
      Footer,
      Navbar,
      NavbarSettings
    }, computed: {
      inSettings: function () {
        return this.$route.path.includes('settings');
      }
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

    @media screen and (max-width: 480px) {
        .content {
            margin-left: 0;
        }
    }

</style>