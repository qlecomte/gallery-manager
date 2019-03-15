<template>
    <div class="navbar">
        <div class="navbar--container">
            <router-link class="navbar--item item-search" :to="'/search'">
                <SearchIcon class="icon" />
                <span class="title hide-xs">Rechercher</span>
            </router-link>
            <router-link class="navbar--item item-pictures" :to="'/'">
                <PictureIcon class="icon" />
                <span class="title hide-xs">Mes Photos</span>
            </router-link>
            <router-link class="navbar--item item-map" :to="'/map'">
                <MapIcon class="icon" />
                <span class="title hide-xs">Carte</span>
            </router-link>
            <router-link class="navbar--item item-calendar hide-xs" :to="'/calendar'">
                <CalendarIcon class="icon" />
                <span class="title hide-xs">Timeline</span>
            </router-link>
            <router-link class="navbar--item item-favorites" :to="'/favorites'">
                <FavIcon class="icon" />
                <span class="title hide-xs">Favoris</span>
            </router-link>
            <router-link class="navbar--item item-tags hide-xs" :to="'/tags'">
                <TagIcon class="icon" />
                <span class="title hide-xs">Tags</span>
            </router-link>
            <router-link class="navbar--item item-add hide-xs" :to="'/add'">
                <AddIcon class="icon" />
                <span class="title hide-xs">Ajouter</span>
            </router-link>
            <router-link class="navbar--item item-settings" :to="'/settings'">
                <SettingsIcon class="icon" />
                <span class="title hide-xs">Réglages</span>
            </router-link>

        </div>
    </div>
</template>
<style scoped>
    .navbar {
        font-family: 'Sniglet', cursive;
        position: fixed;
        left: 0;
        top: 0;
        z-index: 10;
        width: 50px;
        height: 100%;
        background: #50049b;
        overflow-x: hidden;
        overflow-y: hidden;
        transition: width 0.5s ease;
        color: white;
    }

    .navbar:hover {
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
        background: #6405c1;
    }

    .navbar--item .icon {
        height: 32px;
        width: auto;
    }

    .navbar--item .title {
        flex: 1;
        display: block;
        text-align: center;
    }

    @media screen and (max-width: 480px) {
        .navbar {
            position: fixed;
            bottom: 0;
            top: auto;
            width: 100%;
            height: 50px;
            transition: none;
        }

        .navbar:hover {
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
  import SearchIcon from '../../../images/navbar/search.svg'
  import PictureIcon from '../../../images/navbar/picture.svg'
  import MapIcon from '../../../images/navbar/placeholder.svg'
  import CalendarIcon from '../../../images/navbar/calendar.svg'
  import FavIcon from '../../../images/navbar/favorite.svg'
  import TagIcon from '../../../images/navbar/tag.svg'
  import AddIcon from '../../../images/navbar/add.svg'
  import SettingsIcon from '../../../images/navbar/settings.svg'

  export default {
    components: {
      SearchIcon,
      PictureIcon,
      MapIcon,
      CalendarIcon,
      FavIcon,
      TagIcon,
      AddIcon,
      SettingsIcon
    }
  }
</script>