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

      <uploader v-model="model.file"
                :multiple="true"
                accept="image/*"/>

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
    </v-card>
  </div>
</template>
<script lang="ts">
import {Vue, Component} from 'vue-property-decorator';

@Component({})
export default class Create extends Vue {
  model: any = {
    headLine: '',
    text: '',
    includesSlider: false,
    file: [],
  }

  async create() {
    await this.$axios.post('/api/post/create', {model: this.model})
      .then((response) => {
        console.log(response);
        this.$router.push('/blog');
      })
      .catch((error) => {
        console.log(error);
      })
  }
}
</script>
