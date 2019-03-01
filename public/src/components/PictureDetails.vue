<template>
    <div>
        <h1 class="container">Picture Details</h1>
        <div>
            <div class="row">
                <div class="col-md-2" style="background-color: grey"></div>
                <div class="col-md-10 img-container">
                    <img class="picture" :src="getPicture(picture.url)"/>
                </div>
            </div>
        </div>

    </div>
</template>
<script>
  import axios from 'axios'

  export default {
    name: 'PictureDetails',
    data: function () {
      return {
        picture: {}
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
    beforeMount(){
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
</style>