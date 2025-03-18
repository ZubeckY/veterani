<template>
  <div>
    <!-- todo редизайн! Сделать компонент и выключение при отправке! -->
    <v-form ref="form" @submit.prevent>
      <v-file-input @change="onFileChange"
                    v-model="file"
                    label="Выберите файл"
                    accept=" image/*" />

      <v-card max-width="450" elevation="0">
        <v-img max-width="450"
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

        <v-overlay opacity=".2" absolute :value="overlay">
          <v-progress-circular size="60" color="primary"
                               :value="uploadProgressValue"/>
        </v-overlay>
      </v-card>

    </v-form>

    <v-alert v-if="error" type="error" dismissible>{{ error }}</v-alert>
    <v-alert v-if="success" type="success" dismissible>{{ success }}</v-alert>

  </div>
</template>

<script lang="ts">
import {Vue, Component, Watch} from 'vue-property-decorator';

@Component({})
export default class test extends Vue {
  file: File | null = null;
  success: string | null = null;
  error: string | null = null;

  uploadProgressValue: number = 0;
  overlay: boolean = false;
  imageValue: any = ""

  onFileChange() {
    if (!this.file) {
      this.error = 'Пожалуйста, выберите файл';
      this.imageValue = ''
      return
    }

    if (!this.file.type.match('image.*')) {
      return false;
    }

    const that = this
    const reader = new FileReader()

    reader.onload = function (e: any) {
      that.imageValue = e.target.result;
    }

    reader.readAsDataURL(this.file);
    this.overlay = true;

    const formData = new FormData();
    formData.append('file', this.file);

    this.$axios.post('/api/file/upload', formData, {
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
        this.error = null; // очищаем предыдущее сообщение об ошибке
      })
      .catch((error: any) => {
        this.error = 'Произошла ошибка при загрузке файла: ' + error.message;
        this.success = null; // очищаем предыдущее сообщение об успехе
      })
      .finally(() => {
        this.overlay = false;
      })
  }
}
</script>

<style scoped>

</style>
