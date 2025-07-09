<template>
  <div>
    <v-form ref="form" @submit.prevent>
      <v-file-input @change="onFileChange"
                    v-model="file"
                    :multiple="multiple"
                    :chips="multiple"
                    :disabled="uploading"
                    :error-messages="error"
                    label="Выберите файл"/>

      <v-card v-if="!multiple && file" max-width="450" elevation="0">
        <v-img v-if="!multiple && fileType(file)"
               max-width="450"
               :src="imageValue"
               :lazy-src="imageValue">
          <template v-slot:placeholder>
            <v-row class="fill-height ma-0"
                   align="center"
                   justify="center">
              <v-progress-circular indeterminate color="primary"/>
            </v-row>

          </template>
        </v-img>
        <v-card v-else-if="!multiple && !file"
                max-width="450"
                elevation="0">
          <v-icon size="400">mdi-file</v-icon>
        </v-card>

        <v-overlay opacity=".2" absolute :value="overlay">
          <v-progress-circular size="60" color="primary"
                               :value="uploadProgressValue"/>
        </v-overlay>
      </v-card>

      <v-card v-else class="d-flex flex-row flex-wrap" elevation="0">
        <div v-for="(imVal, i) in imageValues" :key="i">
          <v-img v-if="multiple && fileType(imVal)"
                 max-width="350"
                 :src="imVal"
                 :lazy-src="imVal">
            <template v-slot:placeholder>
              <v-row class="fill-height ma-0"
                     align="center"
                     justify="center">
                <v-progress-circular indeterminate color="primary"/>
              </v-row>
            </template>
          </v-img>
          <v-card v-else-if="multiple && !fileType(imVal)"
                  max-width="350"
                  elevation="0">
            <v-icon size="300">mdi-file</v-icon>
          </v-card>
        </div>

        <v-overlay opacity=".2" absolute :value="overlay">
          <v-progress-circular size="60" color="primary"
                               :value="uploadProgressValue"/>
        </v-overlay>
      </v-card>

    </v-form>

    <v-alert v-if="success" type="success" dismissible>{{ success }}</v-alert>

  </div>
</template>

<script lang="ts">
import {Vue, Component, Watch} from 'vue-property-decorator';

@Component({})
export default class test extends Vue {
  file: any = null;
  success: string | null = null;
  error: string | null = null;

  multiple: boolean = true;

  uploadProgressValue: number = 0;
  uploading: boolean = false;
  overlay: boolean = false;

  imageValue: any = ""
  imageValues: Array<string> = [];

  onFileChange() {
    return this.multiple ? this.uploadMultiple() : this.uploadSingle()
  }

  uploadSingle() {
    if (!this.file && !this.multiple) {
      this.error = 'Пожалуйста, выберите файл';
      this.imageValue = ''
      return
    }

    const that = this
    const reader = new FileReader()

    reader.onload = function (e: any) {
      that.imageValue = e.target.result;
    }

    reader.readAsDataURL(this.file);
    this.uploading = true;
    this.overlay = true;

    const formData = new FormData();
    formData.append('file', this.file);

    this.$axios.post('/api/file/upload/single', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: progressEvent => {
        let {loaded, total} = progressEvent;
        this.uploadProgressValue = (loaded / total) * 100
      }
    })
      .then((response: any) => {
        this.success = 'Файл успешно загружен: ' + response.data.message;
        this.error = null;
      })
      .catch((error: any) => {
        this.error = 'Произошла ошибка при загрузке файла: ' + error.message;
        this.success = null;
      })
      .finally(() => {
        this.uploading = false;
        this.overlay = false;
      })
  }

  uploadMultiple() {
    if (this.file.length <= 0 && this.multiple) {
      this.error = 'Пожалуйста, выберите файл';
      this.imageValues = []
      return
    }

    const that = this
    this.imageValues = []

    this.file.forEach((file: any) => {
      const reader = new FileReader()
      reader.onload = function (e: any) {
        that.imageValues.push(e.target.result)
      }
      reader.readAsDataURL(file);
    })


    this.uploading = true;
    this.overlay = true;

    const formData = new FormData();
    for (const file of this.file) {
      formData.append('files', file);
    }

    this.$axios.post('/api/file/upload/multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: progressEvent => {
        let {loaded, total} = progressEvent;
        this.uploadProgressValue = (loaded / total) * 100
      }
    })
      .then((response: any) => {
        this.success = 'Файл успешно загружен: ' + response.data.message;
        this.error = null;
      })
      .catch((error: any) => {
        this.error = 'Произошла ошибка при загрузке файла: ' + error.message;
        this.success = null;
      })
      .finally(() => {
        this.uploading = false;
        this.overlay = false;
      })
  }

  fileType(file: any) {
    if (file?.type && !this.multiple) {
      return file.type.includes('image')
    }

    if (this.multiple) {
      const data = file.split(';')[0]
      const type = data.split('data:')[1]
      return type.includes('image')
    }
  }
}
</script>
