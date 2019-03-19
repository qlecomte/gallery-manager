<template>
    <div class="container">
        <h1 class="title">Calendrier</h1>
        <div v-for="day in pictures" :key="day.date">
            <div class="day">
                <span>{{day.date | dateFormat}}</span>
            </div>
            <PhotoGrid :pictures="urlArray(day.pictures)"/>
        </div>

    </div>
</template>
<style scoped>
    .title {
        text-align: center;
        margin-top: 16px;
    }

    .day {
        margin: 16px 8px 8px 24px;
    }
</style>
<script>
  import axios from 'axios'
  import moment from 'moment'
  import _ from 'lodash'
  import PhotoGrid from './PhotoGrid.vue'
  import CalendarIcon from '../../../images/navbar/calendar.svg'

  moment.locale('fr')

  export default {
    name: 'Calendar',
    components: {
      PhotoGrid,
      CalendarIcon
    },
    data: function () {
      return {
        pictures: []
      }
    },
    computed: {
      urlArray: function () {
        return pictures => pictures.map(function (picture) {
          return picture.url
        })
      }
    },
    methods: {
      listCalendar: function () {
        axios.get('/api/v1/pictures/calendar')
          .then(response => {
            this.pictures = _.chain(response.data).groupBy(function (picture) {
              return moment(picture.takenAt).format('YYYY-MM-DD')
            }).map(function (value, key) {
              return {
                date: key,
                pictures: value
              }
            }).value()
          }).catch(error => (console.error(error)))
      }
    },
    filters: {
      dateFormat: function (value) {
        return moment(value).format('dddd DD MMMM YYYY')
      }
    },
    created () {
      this.listCalendar()
    }
  }
</script>