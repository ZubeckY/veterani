<template>
  <div>
    <v-form ref="form" @submit.prevent>
      <v-file-input @change="uploader"
                    label="Выберите файл"
                    v-model="file"
                    :accept="accept"
                    :chips="multiple"
                    :multiple="multiple"
                    :disabled="uploading"
                    :error-messages="error"
                    prepend-inner-icon="mdi-file-upload"
                    prepend-icon=""
                    outlined dense/>

      <div class="d-flex flex-wrap flex-row">

        <!-- отображение загруженных файлов  -->
        <uploader-card v-if="multiple && uploadFiles.length > 0"
                       v-for="(file, i) in uploadFiles"
                       @deleteFile="deleteFile"
                       :key="i"
                       :file="file"
                       :src="'/api/' + file.path"
                       :multiple="multiple"/>


        <!-- отображение загруженного файла  -->
        <uploader-card v-if="!multiple && uploadFiles"
                       @deleteFile="deleteFile"
                       :file="uploadFiles"
                       :src="'/api/' + uploadFiles.path"/>


        <!-- загрузка одного файла -->
        <v-card v-if="!multiple && imageValue"
                class="ml-3"
                elevation="0"
                width="fit-content">
          <uploader-card :file="file"
                         :src="imageValue"
                         :multiple="multiple"/>
          <v-overlay opacity=".2" absolute :value="overlay">
            <v-progress-circular size="60" color="primary"
                                 :value="uploadProgressValue"/>
          </v-overlay>
        </v-card>


        <!-- загрузка нескольких файлов -->
        <v-card v-if="multiple && imageValues.length > 0"
                elevation="0"
                width="fit-content"
                class="d-flex flex-row flex-wrap ml-3">
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

      </div>
    </v-form>

    <v-alert class="mt-5 mb-3 align-center"
             v-model="alert"
             type="success"
             outlined dense>
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
  @Prop() uploadFiles?: any
  @Prop({default: ''}) readonly accept?: string
  @Prop({default: false}) readonly multiple?: boolean

  alert: boolean = false;
  success: string | null = null;
  error: string | null = null;

  uploadProgressValue: number = 0;
  uploading: boolean = false;
  overlay: boolean = false;

  imageValue: any = ""
  imageValues: Array<string> = [];

  uploader() {
    if (this.multiple && this.file.length <= 0) {
      this.error = 'Пожалуйста, выберите файл';
      this.imageValues = [];
      this.closeAlert();
      return
    } else if (this.multiple && !this.file) {
      this.error = 'Пожалуйста, выберите файл';
      this.imageValue = null;
      this.closeAlert();
      return
    }

    const formData = this.fileReader();
    const mode = this.multiple ? 'multiple' : 'single';

    this.$axios.post('/api/file/upload/' + mode, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: progressEvent => {
        let {loaded, total} = progressEvent;
        this.uploadProgressValue = (loaded / total) * 100
      }
    })
      .then((response: any) => {
        const {file, files} = response.data;
        const resFile = this.multiple ? files : file;

        this.$emit('successUpload', resFile);

        this.alert = true;
        this.success = 'Файлы успешно загружены';
        this.error = null;

        this.file = this.multiple ? [] : null;
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

  fileReader() {
    const that = this
    const formData = new FormData();

    if (this.multiple) {
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

      for (const file of this.file) {
        formData.append('files', file);
      }
    } else {
      const reader = new FileReader()
      reader.onload = function (e: any) {
        that.imageValue = e.target.result;
      }
      reader.readAsDataURL(this.file);
      this.uploading = true;
      this.overlay = true;

      formData.append('file', this.file);
    }
    return formData;
  }

  @Watch('file')
  clearList() {
    if (this.multiple && this.file.length <= 0 ) {
      this.imageValues = []
    } else if (!this.multiple && !this.file) {
      this.imageValue = null;
    }
  }

  deleteFile(file: any) {
    let index = -1
    if (this.multiple) {
      index = this.uploadFiles.findIndex((f: any) => f.id === file.id);
    } else {
      index = file.id
    }

    if (index > -1) {
      this.$axios.delete('/api/file/delete/' + file.id)
        .then((res) => {
          if (this.multiple) {
            this.uploadFiles.splice(index, 1);
          } else {
            this.$emit('successDelete')
          }
        })
        .catch((error: any) => {
          console.log(error);
        })
    }
  }

  closeAlert() {
    this.success = null;
    this.alert = false;
  }
}
</script>
