<template>
    <div>
        <h1 class="container">Picture Details</h1>
        <div>
            <div class="row no-gutter">
                <div class="col-md-10 img-container">
                    <img class="picture" v-if="picture && picture.url" :src="getPicture(picture.url)"/>
                </div>
                <div class="col-md-2 infos" v-if="picture">
                    <div class="name">{{picture.name}}</div>
                    <div class="description">{{picture.description}}</div>
                    <div class="taken">Prise le : {{picture.takenAt | dateFormat }}</div>
                    <div class="coordinates d-none d-sm-block">{{picture.coordinates}}</div>
                    <div class="details d-none d-sm-block" v-if="picture.exif">
                        <div>Modèle : {{picture.exif.Model}}</div>
                        <div>Ouverture : F/{{picture.exif.SubExif.FNumber[0]}}</div>
                        <div>Longueur Focale : {{picture.exif.SubExif.FocalLength[0]}} mm</div>
                        <div>Temps d'exposition : 1/{{1/picture.exif.SubExif.ExposureTime}} s</div>
                        <div>ISO : {{picture.exif.SubExif.PhotographicSensitivity}}</div>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>
<script>
  import axios from 'axios'
  import moment from 'moment'
  moment.locale('fr');

  export default {
    name: 'PictureDetails',
    data: function () {
      return {
        picture: null
      }
    },
    computed: {
      getPicture: function () {
        return picture => `${picture}?size=full`
      }, getId: function () {
        return picture => {
          const regex = /^.*\/([a-zA-Z0-9]*)$/g
          const matches = regex.exec(picture)
          return matches[1]
        }
      }
    },
    methods: {
      getPictureDetails: function (id) {
        axios.get('/api/v1/pictures/' + id + '/details')
          .then(response => (this.picture = response.data))
          .catch(error => (console.error(error)))
      }
    },
    filters: {
      dateFormat: function (value) {
          return moment(value).format('DD MMMM YYYY');
      }
    },
    created(){
      this.getPictureDetails(this.$route.params.id)
    }
  }
</script>
<style scoped>
    .img-container{
        background-color: black;
        height: 90vh;
        padding: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .picture {
        max-height: 100%;
        display: block;
    }
    .row.no-gutter {
        margin-left: 0;
        margin-right: 0;
    }

    .infos {
        background-color: #555;
        padding: 16px;
    }
    .infos .name {
        font-size: 22px;
    }
    .infos .name, .infos .description, .infos .taken, .infos .coordinates, .infos .details {
        color: white;
        padding-bottom: 8px;
        overflow: hidden;
    }
</style>