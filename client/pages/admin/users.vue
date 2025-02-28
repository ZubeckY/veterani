<template>
  <div>

    <v-btn @click="createTestVote">Создать тестовое голосование</v-btn>

    <v-skeleton-loader v-if="loading" type="table"/>

    <v-data-table v-else
                  :items="data"
                  :headers="headers">
      <!-- Роль -->
      <template v-slot:item.role="{ item }">
        <td class="text-start">
          <v-chip :color="getRoleColor(item.role)" dark small>
            {{ getRoleTypeText(item.role) }}
          </v-chip>
        </td>
      </template>

      <!-- Активирован -->
      <template v-slot:item.activated="{ item }">
        <td :class="'text-start ' + item.activated ? 'green--text' : 'red--text'"> {{
            item.activated ? 'Да' : 'Нет'
          }}
        </td>
      </template>

      <!-- Заблокирован -->
      <template v-slot:item.block="{ item }">
        <td :class="'text-start ' + item.block ? 'green--text' : 'red--text'"> {{
            item.block ? 'Да' : 'Нет'
          }}
        </td>
      </template>

      <!-- Дата создания -->
      <template v-slot:item.created="{ item }">
        <td class="text-start"> {{ getCreatedDate(item.created) }}</td>
      </template>

      <!-- Кнопки -->
      <template v-slot:item.actions="{ item }">
        <v-icon color="primary" class="mr-2">mdi-pencil</v-icon>
        <admin-user-delete :item="item" @deleteUser="deleteUser"/>
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

  data: any = []
  roles: any = []
  colors: string[] = [
    'red', 'green', 'yellow', 'blue',
  ]

  headers: any = [
    {text: 'ID', value: 'id'},
    {text: 'Имя', value: 'firstName'},
    {text: 'Фамилия', value: 'lastName'},
    {text: 'Email', value: 'email'},
    {text: 'Роль', value: 'role'},
    {text: 'Активирован', value: 'activated'},
    {text: 'Заблокирован', value: 'block'},
    {text: 'Дата регистрации', value: 'created'},
    {text: '', value: 'actions', sortable: false},
  ]


  async createTestVote() {
    // await this.$axios.post('/api/admin/voting/create')
    await this.$axios.get('/api/admin/voting/list')
      .then(res => {
        console.log(res)

        const item = res.data[0].votingResult
        console.log(JSON.parse(item))

      })
      .catch(err => {
        console.log(err)
      })
  }

  async mounted() {
    this.loading = true;
    await this.getRoleList()
    await this.getUserList()

    this.loading = false;
  }

  async getRoleList() {
    await this.$axios.post('/api/admin/user/role-list/')
      .then((response) => {
        this.roles = response.data.roles;
      })
  }

  async getUserList() {
    await this.$axios.get('/api/admin/user/list/')
      .then((response) => {
        this.data = response.data.users;
      })
  }

  async deleteUser(id: any) {
    await this.$axios.delete('/api/admin/user/delete/' + id)
      .then((response) => {
        this.getUserList()
      })
      .catch((error) => {
        console.log(error);
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

  getCreatedDate(created: Date) {
    return new Date(created).toLocaleDateString("ru", {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }
}
</script>

<style scoped>

</style>
