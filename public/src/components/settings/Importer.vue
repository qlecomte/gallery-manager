<template>
    <div class="container">
        <div class="upload-zone">
            <div class="icon">
                <UploadIcon/>
            </div>
            <div class="text">
                <div>Importez vos images</div>
                <div class="explanation">Glissez et déposez vos images ici pour les ajouter à votre galerie photo.</div>
            </div>
        </div>
    </div>
</template>
<style scoped>
    .container {
        display: flex;
        flex-direction: column;
        height: 100vh;
    }

    .upload-zone {
        flex: 1;
        margin: 24px;
        border-radius: 24px;
        border: silver 2px dashed;
        display: flex;
        flex-direction: column;
        justify-content: stretch;
        align-items: center;
    }

    .upload-zone .icon {
        flex: 1;
        display: flex;
        align-items: end;
    }

    .upload-zone .icon svg {
        height: 96px;
        fill: #5a6a7a;
    }

    .upload-zone .text {
        flex: 2;
        fill: #5a6a7a;
        font-size: 20px;
        font-weight: 500;
        text-align: center;
    }

    .upload-zone .text {
        font-size: 16px;
        font-weight: 400;
        margin-top: 8px;
    }


</style>
<script>
  import PictureIcon from '../../../images/navbar/picture.svg'
  import UploadIcon from '../../../images/upload.svg'

  export default {
    name: 'Importer',
    components: {
      PictureIcon,
      UploadIcon
    }
  }
</script>