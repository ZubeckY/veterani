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

      <v-checkbox label="Опубликованный пост"
                  v-model="model.published"/>

      <v-textarea label="Текст"
                  v-model="model.text"
                  outlined dense/>

      <v-btn @click="edit"
             color="primary" icon>
        <v-icon>mdi-pen</v-icon>
      </v-btn>

      <blog-delete @deleteItem="deleteItem"/>

      <v-btn @click="$router.push('/blog')"
             color="error" text
             width="fit-content"
             class="pa-1">
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

  async deleteItem() {
    const link = this.$router.currentRoute.params.link;
    await this.$axios.delete('/api/post/delete/' + link)
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
