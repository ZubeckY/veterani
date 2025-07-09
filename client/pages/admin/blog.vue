<template>
  <div>
    <v-skeleton-loader v-if="loading" type="table"/>

    <div class="d-flex flex-column overflow-y-auto" style="width: 100%; height: calc(100vh - 30px)" v-else>
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
        <!-- Создатель -->
        <template v-slot:item.user.id="{ item }">
          <td :class="'text-start '">
            {{ `${item.user.firstName} ${item.user.lastName} (${item.user.id})` }}
          </td>
        </template>

        <!-- Опубликовано -->
        <template v-slot:item.published="{ item }">
          <admin-yes-no-value :value="item.published"/>
        </template>

        <!-- Включен в слайдер -->
        <template v-slot:item.includesSlider="{ item }">
          <admin-yes-no-value :value="item.includesSlider"/>
        </template>

        <!-- Предложенный -->
        <template v-slot:item.suggested="{ item }">
          <admin-yes-no-value :value="item.suggested"/>
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
            <admin-blog-edit class="mr-2"
                             :item="item"
                             @saveEdit="getPostList"/>
            <admin-blog-delete :item="item" @deletePost="deletePost"/>
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

  data: Array<any> = []
  headers: Array<any> = [
    {text: 'ID', value: 'id'},
    {text: 'Заголовок', value: 'headLine'},
    {text: 'Создатель (ID)', value: 'user.id'},
    {text: 'Входит в слайдер', value: 'includesSlider'},
    {text: 'Опубликован', value: 'published'},
    {text: 'Предложенный', value: 'suggested'},
    {text: 'Дата создания', value: 'created'},
    {text: '', value: 'actions', sortable: false},
  ]

  async mounted() {
    await this.getPostList()
  }

  async getPostList() {
    await this.$axios.get('/api/admin/post/list')
      .then((response) => {
        this.data = response.data;
      })
  }

  async deletePost(id: any) {
    this.loading = true;
    await this.$axios.delete('/api/admin/post/delete/' + id)
      .then((response) => {
        this.getPostList()
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        this.loading = false;
      })
  }
}
</script>
