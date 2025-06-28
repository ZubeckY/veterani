<template>
  <div>
    <v-skeleton-loader v-if="loading" type="table"/>

    <div class="d-flex flex-column" style="width: 100%; height: calc(100vh - 30px)" v-else>
      <v-data-table :items="data"
                    :headers="headers"
                    :sort-desc="true"
                    sort-by="created"
                    :footer-props="{
                      showFirstLastPage: true,
                      itemsPerPageAllText: 'Все',
                      itemsPerPageText: 'Показывать элементов в списке:',
                      itemsPerPageOptions: [10, 15, 20, -1]
                    }">

        <!-- Опубликовано -->
        <template v-slot:item.published="{ item }">
          <td :class="'text-start ' + getCurrentColor(item.published)">
            {{ item.published ? 'Да' : 'Нет' }}
          </td>
        </template>

        <!-- Включен в слайдер -->
        <template v-slot:item.includeSlider="{ item }">
          <td :class="'text-start ' + getCurrentColor(item.includesSlider)">
            {{ item.includeSlider ? 'Да' : 'Нет' }}
          </td>
        </template>

        <!-- Предложенный -->
        <template v-slot:item.suggested="{ item }">
          <td :class="'text-start ' + getCurrentColor(item.suggested)">
            {{ item.suggested ? 'Да' : 'Нет' }}
          </td>
        </template>

        <!-- Дата создания -->
        <template v-slot:item.created="{ item }">
          <td class="text-start">
            <date-normalizer :date="new Date(item.created)"></date-normalizer>
          </td>
        </template>

        <!-- Кнопки -->
        <template v-slot:item.actions="{ item }">
          <div class="d-flex">
            <v-icon color="primary" class="mr-2">mdi-pencil</v-icon>
            <admin-user-delete :item="item" @deleteUser="deletePost"/>
          </div>
        </template>
      </v-data-table>
    </div>

  </div>
</template>

<script lang="ts">
import {Vue, Component} from 'vue-property-decorator';

@Component({
  layout: 'admin',
  head(this: Blog): object {
    return {
      title: 'Админ панель - Публикации',
    }
  }
})
export default class Blog extends Vue {
  loading: boolean = false;

  data: any = []
  headers: any = [
    {text: 'ID', value: 'id'},
    {text: 'Заголовок', value: 'headLine'},
    {text: 'ID создателя', value: 'user.id'},
    {text: 'Входит в слайдер', value: 'includeSlider'},
    {text: 'Опубликован', value: 'published'},
    {text: 'Предложенный', value: 'suggested'},
    {text: 'Дата создания', value: 'created'},
  ]

  async mounted() {
    this.loading = true;
    await this.getPostList()
    this.loading = false;
  }

  async getPostList() {
    await this.$axios.get('/api/post/list')
      .then((response) => {
        this.data = response.data;
      })
  }

  async deletePost(id: any) {
    await this.$axios.delete('/api/post/delete/' + id)
      .then((response) => {
        this.getPostList()
      })
      .catch((error) => {
        console.log(error);
      })
  }

  getCurrentColor(value: boolean) {
    return value ? 'green--text' : 'red--text'
  }
}
</script>
