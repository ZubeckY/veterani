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

        <!-- Файл выложен -->
        <template v-slot:item.published="{ item }">
          <admin-yes-no-value :value="item.published"/>
        </template>

        <!-- Файл используется -->
        <template v-slot:item.used="{ item }">
          <admin-yes-no-value :value="item.used"/>
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
            <admin-docx-edit class="mr-2" :item="item" @saveEdit="getFileList"/>
            <admin-docx-delete :item="item" @deleteDoc="deleteDoc"/>
          </div>
        </template>

      </v-data-table>
    </div>
  </div>
</template>

<script lang="ts">
import {Vue, Component} from 'vue-property-decorator';
import Admin from "~/layouts/admin.vue";

@Component({
  components: {Admin},
  layout: 'admin',
  head(this: Docs): object {
    return {
      title: 'Админ панель - Документы',
    }
  }
})
export default class Docs extends Vue {
  loading: boolean = false;
  data: Array<any> = []

  headers: Array<any> = [
    {text: 'ID', value: 'id'},
    {text: 'Название файла', value: 'name'},
    {text: 'Тип файла', value: 'typeFile'},
    {text: 'Файл выложен', value: 'published'},
    {text: 'Файл используется', value: 'used'},
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

  async deleteDoc(id: any) {
    await this.$axios.delete('/api/admin/file/delete/' + id)
      .then((response) => {
        this.getFileList()
      })
      .catch((error) => {
        console.log(error);
      })
  }
}
</script>
