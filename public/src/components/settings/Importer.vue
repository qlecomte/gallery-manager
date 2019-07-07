<template>
    <div class="container">
        <div class="upload-zone" id="file-drag-drop">
            <form ref="fileform">
                <div class="icon">
                    <UploadIcon/>
                </div>
                <div class="text">
                    <div class="label">Importez vos images</div>
                    <div class="explanation">Glissez et déposez vos images ici pour les ajouter à votre galerie photo.</div>
                    <div class="upload-button">Envoyez vos photos</div>
                </div>
                <div class="grid">
                    <div v-for="(file, key) in files" class="file-listing">
                        <div class="thumbnail">
                            <img class="preview" v-bind:ref="'preview'+parseInt( key )"/>
                            <UploadIcon class="upload-icon"/>
                        </div>
                        <div class="details">
                            <span>{{ file.name }}</span>
                        </div>
                        <div class="close-icon" @click="removePicture(key)">
                            <CancelIcon/>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>
<style scoped lang="scss">

    .container {
        display: flex;
        flex-direction: column;
        height: 100vh;
    }

    .upload-zone {
        flex: 1;
        margin: 24px;
        padding: 24px;
        border-radius: 24px;
        border: silver 2px dashed;

        form {
            height: 100%;
            width: 100%;
            display: flex;
            flex-direction: column;
            justify-content: stretch;
            align-items: center;

            .icon {
                flex: 1;
                display: flex;
                align-items: end;

                svg {
                    height: 96px;
                    fill: #5a6a7a;
                }
            }

            .text {
                flex: 2;
                fill: #5a6a7a;
                text-align: center;

                .label {
                    font-size: 20px;
                    font-weight: 500;
                }

                .explanation {
                    font-size: 16px;
                    font-weight: 400;
                    margin-top: 8px;
                }
            }
        }
    }

    .grid {
        display: grid;
        grid-template-columns: repeat(5, calc(100% / 5));
        width: 100%;

        .file-listing {
            border: 1px solid #3a4a5a;
            display: flex;
            flex-direction: row;
            word-break: break-all;
            position: relative;

            .thumbnail {
                height: 120px;
                width: 120px;

                position: relative;
                text-align: center;
                color: white;

                .preview {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                }

                .upload-icon {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    fill: #5a6a7a;
                }
            }

            .close-icon {
                height: 20px;
                width: 20px;
                position: absolute;
                top: 8px;
                right: 8px;
            }
        }
    }

</style>
<script>
  import PictureIcon from '../../../images/navbar/picture.svg'
  import UploadIcon from '../../../images/upload.svg'
  import CancelIcon from '../../../images/arrows/cancel.svg'

  import axios from 'axios'

  export default {
    name: 'Importer',
    components: {
      PictureIcon,
      UploadIcon,
      CancelIcon
    },
    data: function () {
      return {
        dragAndDropCapable: false,
        files: []
      }
    },
    methods: {
      determineDragAndDropCapable(){
        /*
          Create a test element to see if certain events
          are present that let us do drag and drop.
        */
        var div = document.createElement('div');

        /*
          Check to see if the `draggable` event is in the element
          or the `ondragstart` and `ondrop` events are in the element. If
          they are, then we have what we need for dragging and dropping files.

          We also check to see if the window has `FormData` and `FileReader` objects
          present so we can do our AJAX uploading
        */
        return ( ( 'draggable' in div )
          || ( 'ondragstart' in div && 'ondrop' in div ) )
          && 'FormData' in window
          && 'FileReader' in window;
      },
      getImagePreviews() {

        // Iterate over all of the files and generate an image preview for each one.
        for( let i = 0; i < this.files.length; i++ ){

          // Ensure the file is an image file
          if ( /\.(jpe?g|png|gif)$/i.test( this.files[i].name ) ) {

            // Create a new FileReader object
            let reader = new FileReader();

            // Add an event listener for when the file has been loaded to update the src on the file preview.
            reader.addEventListener("load", function(){
              this.$refs['preview'+parseInt( i )][0].src = reader.result;
            }.bind(this), false);

            /*
              Read the data for the file in through the reader. When it has
              been loaded, we listen to the event propagated and set the image
              src to what was loaded from the reader.
            */
            reader.readAsDataURL( this.files[i] );
          } else {

            // We do the next tick so the reference is bound and we can access it.
            this.$nextTick(function(){
              this.$refs['preview'+parseInt( i )][0].src = '/images/file.png';
            });
          }
        }
      },
      removePicture(key) {
        this.files.splice(key, 1);
        this.getImagePreviews();
      },
      uploadPicture(file) {
        console.info('start upload');
        const formData = new FormData();
        formData.append('pictures', file);
        axios.post('/api/v1/upload', formData)
          .then(function (result) {
            console.info('end upload');
            console.info(result);
          }).catch(function (err) {
            console.info('end upload');
            console.error(err);
        })
      }
    },
    mounted() {
      // Determine if drag and drop functionality is capable in the browser
      this.dragAndDropCapable = this.determineDragAndDropCapable();
      console.info('Is Drag And Drop enabled ? ' + this.dragAndDropCapable);
      // If drag and drop capable, then we continue to bind events to our elements.
      if( this.dragAndDropCapable ){
        // Listen to all of the drag events and bind an event listener to each for the fileform.
        ['drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop'].forEach( function( evt ) {
          /*
            For each event add an event listener that prevents the default action
            (opening the file in the browser) and stop the propagation of the event (so
            no other elements open the file in the browser)
          */
          window.addEventListener(evt, function (e) {
            e.preventDefault();
            e.stopPropagation();
          }, false);
        }.bind(this));

        // Add an event listener for drop to the form
        window.addEventListener('drop', function(e){
          console.info(e);
          // Capture the files from the drop event and add them to our local files array.
          for( let i = 0; i < e.dataTransfer.files.length; i++ ){
            this.files.push( e.dataTransfer.files[i] );
            this.getImagePreviews();

            // this.uploadPicture(e.dataTransfer.files[i]);
          }
        }.bind(this));
      }
    }
  }
</script>