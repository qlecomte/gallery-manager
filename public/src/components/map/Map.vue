<template>
    <div id="mapid"></div>
</template>
<style>
    #mapid {
        height: 100%
    }
    .leaflet-popup-picture {
        width: 200px;
        height: 130px;
    }
</style>
<script>
  import axios from 'axios'
  export default {
    name: 'MapComponent',
    data: function () {
      return {
        map: null,
        tileLayer: null,
      }
    }, mounted() {
      this.initMap();
      this.initMarkers();
    }, methods: {
      initMap() {
        this.map = L.map('mapid').setView([46.5, 2.5], 6);
        this.tileLayer = L.tileLayer(
          'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          }
        );

        this.tileLayer.addTo(this.map);
      },
      initMarkers() {
        axios.get('/api/v1/pictures/map')
          .then(response => {
            const pictures = response.data;
            pictures.forEach(picture =>
              L.marker([picture.coordinates.latitude, picture.coordinates.longitude])
                .bindPopup(`<img class="leaflet-popup-picture" src="${this.getThumbnail(picture.url)}">`, {closeButton: false, maxWidth: 500, className: "custom"})
                .addTo(this.map)
            );
          }).catch(error => (console.error(error)))
      }, getThumbnail: function (pictureUrl) {
        return `${pictureUrl}?size=thumbnail`
      }
    }
  }
</script>