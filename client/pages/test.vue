<template>
  <div>
    <!-- todo редизайн! Сделать компонент и выключение при отправке! -->
    <v-form ref="form" @submit.prevent="submitForm">
      <v-file-input
        v-model="file"
        label="Выберите файл"
        accept="image/*"
      ></v-file-input>
      <v-btn type="submit" color="primary">Загрузить</v-btn>
    </v-form>
    <v-alert v-if="error" type="error" dismissible>{{ error }}</v-alert>
    <v-alert v-if="success" type="success" dismissible>{{ success }}</v-alert>
  </div>
</template>

<script lang="ts">
import {Vue, Component} from 'vue-property-decorator';

@Component({})
export default class test extends Vue {

  file: File | null = null;
  success: string | null = null;
  error: string | null = null;

  submitForm() {
    if (!this.file) {
      this.error = 'Пожалуйста, выберите файл';
      return;
    }

    const formData = new FormData();
    formData.append('file', this.file);

    this.$axios.post('/api/post/test', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: progressEvent => {
        let {loaded, total} = progressEvent;
        console.log('progress: ', (loaded / total) * 100)
      }
    })
      .then((response: any) => {
        this.success = 'Файл успешно загружен: ' + response.data.message;
        this.error = null; // очищаем предыдущее сообщение об ошибке
      })
      .catch((error: any) => {
        this.error = 'Произошла ошибка при загрузке файла: ' + error.message;
        this.success = null; // очищаем предыдущее сообщение об успехе
      });
  }
}
</script>

<style scoped>

</style>
