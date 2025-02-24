<template>
  <div>
    <v-skeleton-loader v-if="loading" type="table"/>

    <v-data-table v-else
                  :items="data"
                  :headers="headers">
      <!-- Роль -->
      <template v-slot:item.role="{ item }">
        <v-chip :color="getRoleColor(item.role)" dark small>
          {{ getRoleTypeText(item.role) }}
        </v-chip>
      </template>

      <!-- Кнопки -->
      <template v-slot:item.actions="{ item }">

      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import {Vue, Component} from 'vue-property-decorator';

@Component({
  layout: 'admin',
  head(this: Users): object {
    return {
      title: 'Админ панель - Пользователи',
    }
  }
})
export default class Users extends Vue {
  loading: boolean = false;

  roles: any = []
  colors: string[] = [
    'red', 'green', 'yellow', 'blue',
  ]

  data: any = [
    {
      role: 'admin',
    }
  ]

  headers: any = [
    {text: 'ID', value: 'id'},
    {text: 'Имя', value: 'firstName'},
    {text: 'Фамилия', value: 'secondName'},
    {text: 'Email', value: 'email'},
    {text: 'Роль', value: 'role'},
    {text: 'Статус активации', value: 'activated'},
    {text: 'Статус блокировки', value: 'block'},
    {text: 'Дата регистрации', value: 'created'},
    {text: '', value: 'actions', sortable: false},
  ]


  async mounted() {
    this.loading = true;
    await this.$axios.post('/api/admin/user/role-list/')
      .then((response) => {
        this.roles = response.data.roles;
        console.log(this.roles)
        this.loading = false;
      })
  }

  getRoleColor(role: string): any {
    switch (role) {
      case 'admin':
        return this.colors[0]
      case 'manager':
        return this.colors[1]
      case 'user':
        return this.colors[2]
      case 'guest':
        return this.colors[3]
      default:
        return 'red'
    }
  }

  getRoleTypeText(role: string) {
    switch (role) {
      case 'admin':
        return this.roles[0]?.value
      case 'manager':
        return this.roles[1]?.value
      case 'user':
        return this.roles[2]?.value
      case 'guest':
        return this.roles[3]?.value
      default:
        return 'danger'
    }
  }
}
</script>

<style scoped>

</style>
