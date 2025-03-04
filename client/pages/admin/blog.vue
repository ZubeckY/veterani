<template>
  <div>
    <v-data-table :headers="headers" :items="data">
      <template v-slot:item.actions="{ item }">
        <v-icon>mdi-pencil</v-icon>
        <v-icon>mdi-delete</v-icon>
      </template>
    </v-data-table>
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
  headers: any = [
    {text: 'ID', value: 'id'},
    {text: 'Дата регистрации', value: 'created'},
    {text: '', value: 'actions', sortable: false},
  ]

  data: any = [
    {}
  ]
}
</script>

<style scoped>

</style>
