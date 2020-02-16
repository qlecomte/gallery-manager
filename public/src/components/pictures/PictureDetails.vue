<template>
    <div class="row" v-if="picture">
        <div class="img-container" >
            <PreviousArrow v-if='picture.previous' class="arrow" v-on:click="goToPrevious"/>
            <img class="picture" v-if="picture.url" :src="getPicture(picture.url)"/>
            <NextArrow v-if='picture.next' class="arrow" v-on:click="goToNext"/>
        </div>
        <div class="infos">
            <div class="name">{{picture.name}}</div>
            <div class="description">{{picture.description}}</div>
            <div class="details"><CalendarIcon class="icon" /><span>{{picture.takenAt | dateFormat }}</span></div>
            <div class="details"><CameraIcon class="icon" /><span>{{picture.exif.Make}} {{picture.exif.Model}}</span></div>
            <div class="details"><PictureIcon class="icon" /><span>{{picture.exif.SubExif.PixelXDimension}}px × {{picture.exif.SubExif.PixelYDimension}}px</span></div>
            <!--<div class="taken">Ajoutée le : {{picture.importedAt | dateFormat }}</div>-->
            <iframe v-if="picture.coordinates && picture.coordinates.latitude && picture.coordinates.longitude"
                    class="minimap"
                    height="350"
                    frameborder="0"
                    scrolling="no"
                    :src="getMapUrl(picture)">
            </iframe>
        </div>
    </div>
</template>
<script>
  import axios from 'axios'
  import moment from 'moment'
  import PreviousArrow from '../../../images/arrows/previous.svg'
  import NextArrow from '../../../images/arrows/next.svg'
  import CalendarIcon from '../../../images/navbar/calendar.svg'
  import PictureIcon from '../../../images/navbar/picture.svg'
  import CameraIcon from '../../../images/camera.svg'

  moment.locale('fr')

  export default {
    name: 'PictureDetails',
    components: {
      PreviousArrow,
      NextArrow,
      CalendarIcon,
      CameraIcon,
      PictureIcon
    },
    data: function () {
      return {
        picture: null
      }
    },
    computed: {
      getPicture: function () {
        return picture => `${picture}?size=large`
      }, getMapUrl: function () {
        const zoom = 0.0025
        return picture => `https://www.openstreetmap.org/export/embed.html?bbox=${picture.coordinates.longitude - zoom},${picture.coordinates.latitude - zoom},${picture.coordinates.longitude + zoom},${picture.coordinates.latitude + zoom}&layer=mapnik&marker=${picture.coordinates.latitude},${picture.coordinates.longitude}`
      }, getPrevious: function () {
        return picture => picture.previous ? picture.previous.replace('/api/v1', '') : null
      }, getNext: function () {
        return picture => picture.next ? picture.next.replace('/api/v1', '') : null
      }
    },
    methods: {
      getPictureDetails: function (id, albumId) {
        axios.get(`/api/v1/pictures/${id}/details?album=${albumId}`)
          .then(response => (this.picture = response.data))
          .catch(error => (console.error(error)))
      }, goToNext: function () {
        const url = this.picture.next.replace('/api/v1', '')
        this.$router.replace({path: url, query: {album: this.$route.query.album}})
      }, goToPrevious: function () {
        const url = this.picture.previous.replace('/api/v1', '')
        this.$router.replace({path: url, query: {album: this.$route.query.album}})
      }, keyListener: function (event) {
        switch (event.code) {
          case 'ArrowLeft':
            if (this.picture.previous){
              this.goToPrevious()
            }
            break
          case 'ArrowRight':
            if (this.picture.next){
              this.goToNext()
            }
            break
        }
      }
    },
    filters: {
      dateFormat: function (value) {
        return moment(value).format('DD MMMM YYYY à HH:mm')
      }
    },
    created () {
      this.getPictureDetails(this.$route.params.id, this.$route.query.album)
    },
    mounted () {
      document.addEventListener("keyup", this.keyListener)
    },
    destroyed () {
      document.removeEventListener("keyup", this.keyListener)
    },
    beforeRouteUpdate (to, from, next) {
      this.getPictureDetails(to.params.id, to.query.album)
      next();
    }
  }
</script>
<style scoped lang="scss">
    .row {
        display: inline-grid;
        grid-template-columns: 80% 20%;
        width: 100%;
        height: 100%;
    }

    .img-container {
        display: inline-grid;
        grid-template-columns: 48px 1fr 48px;
        background-color: black;
        padding: 16px 0;
        max-height: 100%;
    }

    .arrow {
        height: 100%;
        width: 48px;
        fill: white;
        cursor: pointer;
    }

    .picture {
        max-height: 100%;
        max-width: 100%;
        display: block;
        grid-column: 2;
    }

    .infos {
        background-color: #3a4a5a;
        padding: 16px;

        .name {
            font-size: 22px;
        }

        .name, .description, .details {
            color: white;
            padding-bottom: 8px;
            overflow: hidden;
        }

        .details {
            display: flex;
            align-items: center;
        }

        .icon {
            height: 28px;
            width: auto;
            fill: white;
            margin-right: 12px;
        }

        .minimap {
            width: 100%;
        }
    }
</style>