<template>
  <div>
    <v-skeleton-loader v-if="loading" type="table"/>

    <div class="d-flex flex-column overflow-y-auto" style="width: 100%; height: calc(100vh - 30px)" v-else>
      <v-data-table :items="data"
                    :headers="headers"
                    :sort-desc="false"
                    sort-by="role"
                    :footer-props="{
                      showFirstLastPage: true,
                      itemsPerPageAllText: 'Все',
                      itemsPerPageText: 'Показывать элементов в списке:',
                      itemsPerPageOptions: [10, 15, 20, -1]
                    }">
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
          <admin-yes-no-value :value="item.activated"/>
        </template>

        <!-- Заблокирован -->
        <template v-slot:item.block="{ item }">
          <admin-yes-no-value :value="item.block"/>
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
            <admin-user-edit class="mr-3" :item="item" @saveEdit="getUserList"/>
            <admin-user-delete :item="item" @deleteUser="deleteUser"/>
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
  head(this: Users): object {
    return {
      title: 'Админ панель - Пользователи',
    }
  }
})
export default class Users extends Vue {
  dialog: boolean = false;
  loadingProcess: any = {
    roles: true,
    users: true,
  }

  data: Array<any> = []
  roles: Array<any> = []
  colors: Array<string> = [
    'red darken-1', 'green darken-1', 'yellow darken-1', 'blue darken-1',
  ]

  headers: Array<any> = [
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

  async mounted() {
    await this.getRoleList()
    await this.getUserList()
  }

  async getRoleList() {
    this.loadingProcess.roles = true
    await this.$axios.post('/api/admin/user/role-list/')
      .then((response) => {
        this.roles = response.data.roles;
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => {
        this.loadingProcess.roles = false;
      })
  }

  async getUserList() {
    this.loadingProcess.users = true;
    await this.$axios.get('/api/admin/user/list/')
      .then((response) => {
        this.data = response.data.users;
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => {
        this.loadingProcess.users = false
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

  get loading(): boolean {
    return this.loadingProcess.roles
      && this.loadingProcess.users;
  }
}
</script>
