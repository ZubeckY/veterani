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

      <uploader v-if="model.files.length > 0"
                v-model="localFile"
                :uploadFiles="model.files"
                :multiple="true"
                accept="image/*"
                @successUpload="getFilesModel"/>

      <div class="mt-6 mb-10">
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
      </div>

    </v-card>
  </div>
</template>

<script lang="ts">
import {Vue, Component, Watch, InjectReactive} from 'vue-property-decorator';

@Component({})
export default class _link extends Vue {
  @InjectReactive('userFromDB') userFromDB: any;
  localFile: any = []

  model: any = {
    id: 0,
    headLine: '',
    text: '',
    link: '',
    published: false,
    files: [],
    created: ''
  }

  created() {
    this.loginUserDB()
  }

  @Watch('userFromDB.value')
  loginUserDB() {
    if (!this.userFromDB.value.needLoading) {
      !this.userFromDB.value.id && this.$router.push('/')
    }
  }

  async mounted() {
    const link = this.$router.currentRoute.params.link;
    this.$axios.get('/api/post/' + link)
      .then((response) => {
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
        this.$router.push('/blog');
      })
      .catch((error) => {
        console.log(error);
      })
  }

  getFilesModel(file: any) {
    this.model.files.push(...file);
  }
}
</script>
