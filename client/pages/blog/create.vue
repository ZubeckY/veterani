<template>
  <div>
    <v-card class="mx-auto"
            max-width="800"
            elevation="0">
      <div class="text-center font-weight-bold">Создание поста</div>

      <div class="mb-2">Пост №{{ model.id }}</div>
      <v-text-field label="Название"
                    v-model="model.headLine"
                    outlined dense/>
      <v-checkbox label="Используется в слайдере"
                  v-model="model.includesSlider"/>
      <v-textarea label="Текст"
                  v-model="model.text"
                  outlined dense/>

      <uploader v-model="localFile"
                :uploadFiles="model.files"
                :multiple="true"
                accept="image/*"
                @successUpload="getFilesModel"/>

      <div class="mt-6 mb-10">
        <v-btn @click="create" text
               color="primary"
               class="ma-0 pa-0"
               height="fit-content"
               width="fit-content">
          Создать
        </v-btn>
        <v-btn @click="$router.push('/blog')" text
               class="ma-0 pa-0"
               height="content"
               color="error"
               width="fit-content">
          Отмена
        </v-btn>
      </div>
    </v-card>
  </div>
</template>
<script lang="ts">
import {Vue, Component} from 'vue-property-decorator';

@Component({})
export default class Create extends Vue {
  localFile: any = []
  model: any = {
    headLine: '',
    text: '',
    includesSlider: false,
    files: []
  }

  async create() {
    delete this.model.localFile
    await this.$axios.post('/api/post/create', {model: this.model})
      .then((response) => {
        console.log(response);
        this.$router.push('/blog');
      })
      .catch((error) => {
        console.log(error);
      })
  }

  getFilesModel(files: any) {
    this.model.files = files;
  }
}
</script>
