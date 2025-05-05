<template>
  <div>
    <v-skeleton-loader v-if="loading" type="table"/>

    <div class="d-flex flex-column" style="width: 100%; height: calc(100vh - 30px)" v-else>
      <v-data-table :items="data"
                    :headers="headers"
                    :sort-desc="true"
                    sort-by="created"
                    hide-default-footer>

        <!-- Файл выложен -->
        <template v-slot:item.published="{ item }">
          <td :class="'text-start ' + getCurrentColor(item.published)">
            {{ item.published ? 'Да' : 'Нет' }}
          </td>
        </template>

        <!-- Дата создания -->
        <template v-slot:item.created="{ item }">
          <td class="text-start"> {{ getCreatedDate(item.created) }}</td>
        </template>

        <!-- Кнопки -->
        <template v-slot:item.actions="{ item }">
          <div class="d-flex">
            <v-icon color="primary" class="mr-2">mdi-pencil</v-icon>
            <admin-user-delete :item="item" @deleteUser="deleteUser"/>
          </div>
        </template>

      </v-data-table>

      <vertical-spacer/>

      <v-pagination v-model="pagPage"
                    :length="pagSize"
                    :total-visible="7"/>

    </div>
  </div>
</template>

<script lang="ts">
import {Vue, Component} from 'vue-property-decorator';

@Component({
  layout: 'admin',
  head(this: Docs): object {
    return {
      title: 'Админ панель - Документы',
    }
  }
})
export default class Docs extends Vue {
  loading: boolean = false;

  page: number = 1;
  size: number = 10;
  pagPage: number = 1;

  data: any = []

  headers: any = [
    {text: 'ID', value: 'id'},
    {text: 'Название файла', value: 'name'},
    {text: 'Тип файла', value: 'typeFile'},
    {text: 'Файл выложен', value: 'published'},
    {text: 'Дата создания', value: 'created'},
    {text: '', value: 'actions', sortable: false},
  ]

  async mounted() {
    await this.getFileList()
  }

  async getFileList() {
    this.$axios.get('/api/admin/file/list')
      .then((res) => {
        this.data = res.data.files
      })
  }

  getCreatedDate(created: Date) {
    return new Date(created).toLocaleDateString("ru", {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  getCurrentColor(value: boolean) {
    return value ? 'green--text' : 'red--text'
  }

  get pagSize(): number {
    return Math.ceil(this.data.length / this.size)
  }
}
</script>

<style scoped>

</style>
