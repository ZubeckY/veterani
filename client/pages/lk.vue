<template>
  <div>
    <div v-if="loading">
      Загрузка...
    </div>
    <div v-else>
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
          <v-col>

            <v-dialog v-model="activatedEmail.dialog"
                      v-if="!user.activated"
                      max-width="400">
              <template v-slot:activator="{ on, attrs }">
                <v-btn v-bind="attrs"
                       v-on="on">
                  Подтвердить email
                </v-btn>
              </template>

              <v-card class="ma-0 py-2">
                <v-card-title class="mt-2 mb-1 pa-0 px-2">
                  Подтверждение почты
                </v-card-title>

                <div class="px-3">
                  <v-otp-input v-model="activatedCode"
                               :disabled="activatedEmail.disabled"
                               @finish="tryActivateAccount" length="5"/>
                </div>

                <v-card-actions>
                  <v-btn class="ma-0 pa-0"
                         height="fit-content"
                         color="error"
                         small text
                         @click="activatedEmail.dialog = false"
                  >
                    Отмена
                  </v-btn>

                  <v-spacer></v-spacer>
                  <v-btn :disabled="activatedEmail.timerDisabled"
                         v-text="sendCodeButtonValue"
                         @click="activatedEmailSendCode"
                         class="ma-0 pa-0"
                         height="fit-content"
                         color="primary"
                         small text>
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-col>
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
  </div>
</template>

<script lang="ts">
import Cookie from 'cookie-universal'
import {Vue, Component, Watch} from 'vue-property-decorator';

@Component({
  head(this: Lk): object {
    return {
      title: this.linkTitle,
    }
  }
})
export default class Lk extends Vue {
  loading: boolean = true;
  linkTitle: string = 'Личный кабинет пользователя - ';
  logoutDialog: boolean = false;
  activatedCode: string = '';
  activatedEmail: any = {
    timerDisabled: false,
    timer: 10,
    dialog: false,
    disabled: true,
    sendCodeAgain: false,
    interval: undefined
  }

  user: any = {};

  async mounted() {
    await this.getUserInfo()
    this.turningOnActivateDialog()
  }

  turningOnActivateDialog() {
    const {query} = this.$router.currentRoute
    const activateDialogFromQuery = query['activate-dialog']
    if (!activateDialogFromQuery) {
      if (!Object.keys(query).length) {
        return this.clearQueryRouter()
      }
    }
    this.activatedEmail.dialog = true
  }

  setQueryRouter() {
    if (this.activatedEmail.dialog) {
      const {query} = this.$router.currentRoute
      if (!Object.keys(query).length) {
        this.$router.replace({query: {'activate-dialog': 'true'}}).then(() => {
          this.$nuxt.refresh();
        });
      }
    }
  }

  clearQueryRouter() {
    if (!this.activatedEmail.dialog) {
      const {query} = this.$router.currentRoute
      if (Object.keys(query).length) {
        this.$router.replace({query: {}}).then(() => {
          this.$nuxt.refresh();
        });
      }
    }
  }

  @Watch('activatedEmail.dialog')
  turningOffActivateDialog() {
    return this.activatedEmail.dialog ? this.setQueryRouter() : this.clearQueryRouter()
  }

  activatedEmailSendCode() {
    this.activatedEmail.sendCodeAgain = true
    this.activatedEmail.timerDisabled = true
    this.activatedEmail.disabled = true

    this.$axios.patch('/api/auth/user/refresh-code/')
      .then((res) => {
        console.log(res.data)
        this.startTimerResend()
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => {
        this.activatedEmail.disabled = false
      })
  }

  startTimerResend() {
    this.activatedEmail.timerDisabled = true
    this.activatedEmail.interval = setInterval(() => {

      if (this.activatedEmail.timer <= 1) {
        clearInterval(this.activatedEmail.interval)
        this.activatedEmail.timerDisabled = false
        this.activatedEmail.timer = 10
        return
      }
      this.activatedEmail.timer -= 1
    }, 1000)
  }

  async tryActivateAccount() {
    this.activatedEmail.disabled = true
    this.activatedEmail.timerDisabled = true

    this.$axios.patch('/api/auth/user/activate-account/', {model: this.activatedCode})
      .then((res) => {
        console.log(res)
        this.getUserInfo()
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => {
        this.activatedEmail.dialog = false
        this.activatedEmail.disabled = false
        this.activatedEmail.timerDisabled = false
      })
  }

  get sendCodeButtonValue() {
    if (this.activatedEmail.sendCodeAgain) {
      return 'Отправить код повторно' + (this.activatedEmail.timerDisabled ? (' ' + this.activatedEmail.timer) : '')
    } else {
      return 'Отправить код'
    }
  }

  async getUserInfo() {
    if (process.client) {
      await this.$axios.get('/api/auth/lk/')
        .then((res) => {
          console.log(res.data.user)
          this.user = res.data.user
          this.linkTitle = 'Личный кабинет - ' + res.data.user.firstName + ' ' + res.data.user.lastName
        })
        .catch((error: any) => {
          console.log(error.response)

          if (error.response.status === 401) {
            this.logoutFunction()
          }
        })
        .finally(() => {
          this.loading = false
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
