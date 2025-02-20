<template>
  <div>
    <div style="max-width: 500px">
      <v-row>
        <v-col cols="3">id:</v-col>
        <v-col v-text="user.id"></v-col>
      </v-row>

      <v-row>
        <v-col cols="3">Имя:</v-col>
        <v-col v-text="user.firstName"></v-col>
      </v-row>

      <v-row>
        <v-col cols="3">Фамилия:</v-col>
        <v-col v-text="user.lastName"></v-col>
      </v-row>

      <v-row>
        <v-col cols="3">Отчество:</v-col>
        <v-col v-text="user.middleName"></v-col>
      </v-row>

      <v-row>
        <v-col cols="3">email:</v-col>
        <v-col v-text="user.email"></v-col>
      </v-row>

      <v-row>
        <v-col cols="3">Активирован:</v-col>
        <v-col v-text="user.activated ? 'Да' : 'Нет'"></v-col>
      </v-row>

      <v-row>
        <v-col cols="3">Роль:</v-col>
        <v-col v-text="user.rolePublic"></v-col>
      </v-row>
    </div>

    <div v-if="userAdminButton">
      <v-btn @click="$router.push('/admin')">Админ панель</v-btn>
    </div>


    <v-dialog v-model="logoutDialog"
              max-width="360">
      <template v-slot:activator="{ on, attrs }">
        <v-btn v-bind="attrs"
               v-on="on">
          Выйти из профиля
        </v-btn>
      </template>

      <v-card class="ma-0 py-2">
        <v-card-text class="mt-2 pa-0 pl-4">
          Вы действительно хотите выйти из профиля?
        </v-card-text>

        <v-card-actions>
          <v-btn class="ma-0 pa-0"
                 height="fit-content"
                 color="error"
                 small text
                 @click="logoutDialog = false"
          >
            Отмена
          </v-btn>

          <v-spacer></v-spacer>
          <v-btn class="ma-0 pa-0"
                 height="fit-content"
                 color="primary"
                 small text
                 @click="logoutFunction"
          >
            Подтвердить
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </div>
</template>

<script lang="ts">
import Cookie from 'cookie-universal'
import {Vue, Component} from 'vue-property-decorator';

@Component({
  head(this: Lk): object {
    return {
      title: this.linkTitle,
    }
  }
})
export default class Lk extends Vue {
  linkTitle: string = '';
  logoutDialog: boolean = false;

  user: any = {};

  async mounted() {
    if (process.client) {
      const cookies = Cookie()

      await this.$axios.get('/api/auth/lk/')
        .then(res => {
          console.log(res.data.user)
          this.user = res.data.user
        })
        .catch((error: any) => {
          console.log(error.response)

          if (error.response.status === 401) {
            this.logoutFunction()
          }
        })
    }
  }

  logoutFunction() {
    const cookies = Cookie()
    cookies.removeAll()
    this.$router.push('/auth/login/')
  }

  get userAdminButton() {
    const successRoles = ['admin', 'manager']
    return successRoles.includes(this.user['role'])
  }
}
</script>
