<template>
    <div class="container">
        <div class="upload-zone" id="file-drag-drop">
            <form ref="fileform">
                <div class="icon" v-show="files.length === 0">
                    <UploadIcon/>
                </div>
                <div class="text" v-show="files.length === 0">
                    <div class="label">Importez vos images</div>
                    <div class="explanation" v-show="dragAndDropCapable">Glissez et déposez vos images ici pour les ajouter à votre galerie photo.</div>
                    <div class="select-pictures" @click="$refs.file.click()">Sélectionnez vos photos à importer</div>
                    <input type="file" accept="image/*" ref="file" multiple style="display: none" @change="processImage($event)">
                    <!--<div class="upload-button">Envoyez vos photos</div>-->
                </div>
                <div class="grid">
                    <div v-for="(file) in files">
                        <div class="file">
                            <UploadIcon class="upload-icon" @click="uploadPicture(file)"/>
                            <progress class="progressbar" :id="'progressbar_' + file.name" max="100" value="0"></progress>
                            <span class="filename">{{ file.name }}</span>
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

                .select-pictures {
                    font-size: 16px;
                    font-weight: 300;
                    margin-top: 16px;
                    padding-top: 16px;
                    padding-bottom: 16px;
                    background-color: #2a3a4a;
                    color: white;
                }
            }
        }
    }

    .grid {
        width: 100%;

        .file {
            .progressbar {

            }

            .upload-icon {
                height: 24px;
            }

            .filename {
                margin: 8px;
            }
        }
    }

</style>
<script>
  import PictureIcon from '../../../images/navbar/picture.svg'
  import UploadIcon from '../../../images/upload.svg'
  import CancelIcon from '../../../images/arrows/cancel.svg'

  import axios from 'axios'
  import Promise from 'bluebird'

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
      processImage(event) {
        console.info(event.target.files);
        for(let i = 0; i < event.target.files.length; i++){
          this.addImage(event.target.files[i])
        }
      },
      addImage(file) {
        this.files.push(file);
      },
      removePicture(key) {
        this.files.splice(key, 1);
      },
      uploadPicture(file) {
        console.info('start upload for ' + file.name);
        const formData = new FormData();
        formData.append('pictures', file);
        axios.post('/api/v1/upload', formData, {
          onUploadProgress: function (progressEvent) {
            console.info(progressEvent);
            let progressValue = progressEvent.loaded / progressEvent.total * 100;
            document.getElementById("progressbar_" + file.name).value = progressValue;
          }
        }).then(function (result) {
          console.info('end upload for ' + file.name);
          return Promise.resolve(result);
        }).catch(function (err) {
          console.info('end upload for ' + file.name);
          console.error(err);
          throw err;
        })
      },
      uploadAllPictures() {
        return Promise.each(this.files, this.uploadPicture);
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
          console.info(e.dataTransfer.files);
          // Capture the files from the drop event and add them to our local files array.
          for( let i = 0; i < e.dataTransfer.files.length; i++ ){
            this.addImage(e.dataTransfer.files[i])
            // this.uploadPicture(e.dataTransfer.files[i]);
          }
        }.bind(this));
      }
    }
  }
</script>