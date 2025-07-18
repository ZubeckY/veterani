<template>
  <div>
    <v-form ref="form" @submit.prevent>
      <v-file-input @change="onFileChange"
                    label="Выберите файл"
                    v-model="file"
                    :disabled="uploading"
                    :multiple="multiple"
                    :chips="multiple"
                    :error-messages="error"
                    outlined dense
                    prepend-icon=""
                    prepend-inner-icon="mdi-file-upload"/>

      <v-card v-if="!multiple && file" width="fit-content" elevation="0">
        <uploader-card :file="file"
                       :src="imageValue"
                       :multiple="multiple"/>
        <v-overlay opacity=".2" absolute :value="overlay">
          <v-progress-circular size="60" color="primary"
                               :value="uploadProgressValue"/>
        </v-overlay>
      </v-card>

      <v-card v-else class="d-flex flex-row flex-wrap" width="fit-content" elevation="0">
        <uploader-card v-for="(imVal, i) in imageValues"
                       :key="i"
                       :file="imVal"
                       :src="imVal"
                       :multiple="multiple"/>
        <v-overlay opacity=".2" absolute :value="overlay">
          <v-progress-circular size="60" color="primary"
                               :value="uploadProgressValue"/>
        </v-overlay>
      </v-card>
    </v-form>

    <v-alert v-model="alert"
             class="mt-5 mb-3 align-center"
             type="success"
             dense outlined>
      <div class="d-flex align-center">
        <span>{{ success }}</span>
        <v-spacer/>
        <v-btn color="success" @click="closeAlert" icon>
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>
    </v-alert>

  </div>
</template>

<script lang="ts">
import {Vue, Component, Watch, VModel, Prop} from 'vue-property-decorator';

@Component({})
export default class Uploader extends Vue {
  @VModel() file: any = null;
  @Prop({default: false}) readonly multiple?: boolean

  alert: boolean = false;
  success: string | null = null;
  error: string | null = null;

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
        this.alert = true;
        this.success = 'Файл успешно загружен';
        this.error = null;
      })
      .catch((error: any) => {
        this.error = 'Произошла ошибка при загрузке файла: ' + error.message;
        this.closeAlert();
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
        this.alert = true;
        this.success = 'Файлы успешно загружены';
        this.error = null;
      })
      .catch((error: any) => {
        this.error = 'Произошла ошибка при загрузке файла: ' + error.message;
        this.closeAlert();
      })
      .finally(() => {
        this.uploading = false;
        this.overlay = false;
      })
  }

  closeAlert() {
    this.success = null;
    this.alert = false;
  }
}
</script>
