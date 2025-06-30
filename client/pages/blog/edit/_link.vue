<template>
  <div>
    <v-card class="mx-auto"
            max-width="800"
            elevation="0">
      <div class="text-center font-weight-bold">Редактирование поста</div>

      <div class="mb-2">Пост №{{ model.id }}</div>
      <v-text-field label="Название"
                    v-model="model.headLine"
                    outlined dense/>

      <v-checkbox label="Используется в слайдере"
                  v-model="model.includesSlider"/>

      <v-checkbox label="Опубликованный пост"
                  v-model="model.published"/>

      <v-textarea label="Текст"
                  v-model="model.text"
                  outlined dense/>

      <v-btn @click="edit" text
             color="primary"
             class="ma-0 pa-0"
             height="fit-content"
             width="fit-content">
        Изменить
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
export default class _link extends Vue {
  model: any = {
    id: 0,
    headLine: '',
    text: '',
    includesSlider: false,
    link: '',
    published: false,
    created: ''
  }

  async mounted() {
    const link = this.$router.currentRoute.params.link;
    this.$axios.get('/api/post/' + link)
      .then((response) => {
        console.log(response.data);
        this.model = response.data;
      })
      .catch((error) => {
        console.log(error);
      })
  }

  async edit() {
    const link = this.$router.currentRoute.params.link;
    await this.$axios.patch('/api/post/update/' + link, {model: this.model})
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

<style scoped>
</style>
