<template>
    <nav class="navbar">
        <div class="navbar--container">
            <router-link class="navbar--item item-search" :to="'/'">
                <HomeIcon class="icon" />
                <span class="title hide-xs">Accueil</span>
            </router-link>
            <router-link class="navbar--item item-settings" :to="'/settings/import'">
                <SettingsIcon class="icon" />
                <span class="title hide-xs">Réglages</span>
            </router-link>

        </div>
    </nav>
</template>
<style scoped>
    nav {
        font-family: 'Sniglet', cursive;
        position: fixed;
        left: 0;
        top: 0;
        z-index: 1100;
        width: 50px;
        height: 100%;
        background: #5a6a7a;
        overflow-x: hidden;
        overflow-y: hidden;
        transition: width 0.5s ease;
        color: white;
    }

    nav:hover {
        width: 180px;
    }

    .navbar--container {
        display: flex;
        flex-direction: column;
        width: 180px;
        height: 100%;
        padding-top: 4px;
        padding-bottom: 4px;
    }

    .navbar--item {
        display: flex;
        align-items: center;
        width: 100%;
        padding-left: 9px;
        padding-right: 9px;
        padding-top: 4px;
        padding-bottom: 4px;
        cursor: pointer;
        color: white;
        text-decoration: none;
    }

    .navbar--item:hover {
        background: #6a7a8a;
    }

    .navbar--item .icon {
        height: 32px;
        width: auto;
        fill: white;
    }

    .navbar--item .title {
        flex: 1;
        display: block;
        text-align: center;
    }

    @media screen and (max-width: 480px) {
        nav {
            position: fixed;
            bottom: 0;
            top: auto;
            width: 100%;
            height: 50px;
            transition: none;
        }

        nav:hover {
            width: 100%;
        }

        .navbar--container{
            flex-direction: row;
            width: 100%;
            height: 50px;
            padding: 0;
            justify-content: space-between;
        }

        .navbar--item {
            padding: 0;
            width: auto;
            flex: 1;
            justify-content: center;
        }

        .navbar--item.item-pictures {
            order:1
        }

        .navbar--item.item-map {
            order:2
        }

        .navbar--item.item-search {
            order:3
        }

        .navbar--item.item-favorites {
            order:4
        }

        .navbar--item.item-settings {
            order:5
        }

        .hide-xs {
            display: none !important;
        }
    }

</style>
<script>
  import HomeIcon from '../../../images/navbar/home.svg'
  import SettingsIcon from '../../../images/navbar/settings.svg'

  export default {
    name: 'NavbarSettings',
    components: {
      HomeIcon,
      SettingsIcon
    }
  }
</script>