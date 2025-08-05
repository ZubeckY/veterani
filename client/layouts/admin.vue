<template>
  <v-app>
    <div class="d-flex" v-if="visibleContent">
      <div v-if="loading">
        <v-skeleton-loader type="chip" class="mb-2" v-for="i in 5" :key="i"/>
      </div>

      <v-card v-else elevation="0"
              class="d-flex flex-column pb-9"
              color="grey lighten-4" height="100vh"
              width="fit-content" max-width="320">
        <v-list class="py-0" dense flat color="transparent">
          <v-list-item-group v-model="selectedMenuItem" color="primary" mandatory>

            <v-list-item v-for="(item, i) in menuItems" :key="i" link :to="item.link">
              <v-list-item-icon class="mr-3">
                <v-icon v-text="item.icon"></v-icon>
              </v-list-item-icon>

              <v-list-item-content class="pa-0">
                <v-list-item-title class="pa-0 pt-2" v-text="item.text"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>

          </v-list-item-group>
        </v-list>

        <vertical-spacer/>

        <v-btn @click="$router.push('/')"
               class="text-none mt-1 mx-auto"
               color="primary" outlined
               width="90%">
          Перейти на сайт
        </v-btn>
      </v-card>

      <div style="width: calc(100vw - 200px)">
        <Nuxt/>
      </div>

    </div>

    <v-dialog v-model="needLoginDialog"
              transition="dialog-top-transition"
              max-width="320" persistent>
      <v-card :disabled="tryLogin">
        <v-card-title class="px-3 pt-2">Авторизация</v-card-title>
        <v-card-text class="px-3 pb-1">Для того, чтобы войти в админ панель, нужно подтвердить личность!</v-card-text>
        <v-card-text class="px-3 pb-4">Введите пароль от учетной записи.</v-card-text>

        <v-text-field v-model="loginModel.email"
                      class="px-3 pb-2"
                      label="Email"
                      hide-details
                      disabled
                      outlined
                      dense/>
        <v-text-field v-model="loginModel.password"
                      :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
                      :type="showPass ? 'text' : 'password'"
                      @click:append="showPass = !showPass"
                      class="px-3 pb-2"
                      label="Пароль"
                      hide-details
                      outlined
                      dense/>

        <v-card-actions class="pt-0 mt-0">
          <v-btn @click="needLogin" color="primary" text>Войти</v-btn>
          <v-btn @click="$router.push('/lk')" color="red" text>Отмена</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-app>
</template>
<script lang="ts">
import {Vue, Component} from 'vue-property-decorator';
import Cookie from "cookie-universal";

@Component({})
export default class Admin extends Vue {
  loading: boolean = true;
  visibleContent: boolean = false;
  needLoginDialog: boolean = false;

  showPass: boolean = false;
  tryLogin: boolean = false;
  loginModel: any = {
    email: '',
    password: '',
  }
  menuItems: Array<any> = []
  currentUser: any = {}
  selectedMenuItem: number = 0;

  async mounted() {
    const cookies = Cookie()
    const token = cookies.get('refreshToken')
    if (!token) {
      return this.$router.push('/404')
    }
    await this.initUser()
  }

  async initUser() {
    if (process.client) {
      const sessionKey = sessionStorage.getItem('sessionKey');

      this.$axios.post('/api/admin/init-user/', {sessionKey})
        .then(res => {
          const {needLogin, email} = res.data

          if (needLogin) {
            this.needLoginDialog = true
            this.loginModel.email = email
            return
          }

          const {menu, user} = res.data

          this.menuItems = menu
          this.currentUser = user

          this.visibleContent = true
          this.loading = false
        })
        .catch(error => {
          return this.$router.push('/404')
        })
    }
  }

  async needLogin() {
    this.tryLogin = true;
    this.$axios.post('/api/admin/login', {password: this.loginModel.password})
      .then(res => {
        const {sessionKey} = res.data
        if (!sessionKey) {
          this.tryLogin = false;
          return
        }

        sessionStorage.setItem('sessionKey', sessionKey)

        this.tryLogin = false;
        this.needLoginDialog = false
        this.visibleContent = true

        this.initUser()

      })
      .catch(error => {
        console.log(error)
      })
  }
}
</script>
