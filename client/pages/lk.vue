<template>
  <div>
    <loading-block v-if="loading"/>
    <div v-else class="lk">
      <div class="lk-container">

        <div class="lk-content d-flex flex-wrap justify-center">
          <div>
            <v-img src="/placeholder_lk.jpg"/>
          </div>

          <div class="d-flex flex-column ml-9">
            <lk-info-group :group="{ label: 'Имя Фамилия', value: getUserName }"/>
            <lk-info-group :group="{ label: 'Отчество', value: user.middleName }"/>
            <lk-info-group :group="{ label: 'Роль', value: user.rolePublic }"/>

            <div class="lk-info__group">
              <div class="lk-info__title">Email</div>
              <div class="lk-info__value" v-text="user.email"></div>
              <div class="lk-info__value">
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
              </div>
            </div>

            <lk-info-group :group="{ label: 'Активирован', value: user.activated ? 'Да' : 'Нет' }"/>

            <vertical-spacer/>

            <div class="d-flex flex-column">
              <div v-if="userAdminButton">
                <v-btn class="mt-2"
                       width="240px"
                       outlined
                       color="primary"
                       @click="$router.push('/admin')">Админ панель
                </v-btn>
              </div>

              <v-btn class="mt-2"
                     width="240px"
                     outlined
                     color="primary">
                Редактировать профиль
              </v-btn>

              <v-dialog v-model="logoutDialog"
                        max-width="360">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn class="mt-2"
                         width="240px"
                         outlined
                         color="red"
                         v-bind="attrs"
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
                           @click="logoutDialog = false">
                      Отмена
                    </v-btn>

                    <v-spacer></v-spacer>
                    <v-btn class="ma-0 pa-0"
                           height="fit-content"
                           color="primary"
                           small text
                           @click="logoutFunction">
                      Подтвердить
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </div>

          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Cookie from 'cookie-universal'
import {Vue, Component, Watch, Inject} from 'vue-property-decorator';

@Component({
  head(this: Lk): object {
    return {
      title: this.linkTitle,
    }
  }
})
export default class Lk extends Vue {
  @Inject('userFromDB') userFromDB: any;
  user: any = {};

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

  async mounted() {
    await this.getUserInfo()
    this.turningOnActivateDialog()
  }

  /* Получаем пользователя, если он есть */
  async getUserInfo() {
    if (process.client) {

      // Если не получилось взять пользователя с Default'а, пытаемся сделать запрос на БД еще раз
      if (!this.userFromDB.value.id) {

        return await this.$axios.get('/api/auth/lk/')
          .then((res) => {
            this.user = res.data.user
            this.linkTitle = 'Личный кабинет - ' + res.data.user.firstName + ' ' + res.data.user.lastName
          })
          .catch((error: any) => {
            if (error.response.status === 401 || error.response.status === 403) {
              this.logoutFunction()
            }
          })
          .finally(() => {
            this.loading = false
          })
      }

      // Если пользователя получили, просто присваиваем значения
      this.user = this.userFromDB.value
      this.linkTitle = 'Личный кабинет - ' + this.user.firstName + ' ' + this.user.lastName

      this.loading = false
    }
  }

  /* logout функция */
  logoutFunction() {
    const cookies = Cookie()
    cookies.removeAll()
    this.$router.push('/auth/login/')
  }

  /*АКТИВАЦИЯ EMAIL'А*/
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

  activatedEmailSendCode() {
    this.activatedEmail.sendCodeAgain = true
    this.activatedEmail.timerDisabled = true
    this.activatedEmail.disabled = true

    this.$axios.patch('/api/auth/user/refresh-code/')
      .then((res) => {
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

  /* Следим за статусом активации */
  @Watch('activatedEmail.dialog')
  turningOffActivateDialog() {
    return this.activatedEmail.dialog ? this.setQueryRouter() : this.clearQueryRouter()
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

  /* Текст сообщения для подтверждения email'а */
  get sendCodeButtonValue() {
    if (this.activatedEmail.sendCodeAgain) {
      return 'Отправить код повторно' + (this.activatedEmail.timerDisabled ? (' ' + this.activatedEmail.timer) : '')
    } else {
      return 'Отправить код'
    }
  }

  /* Выводим кнопку админки */
  get userAdminButton() {
    const successRoles = ['admin', 'manager']
    return successRoles.includes(this.user['role'])
  }

  /* Имя пользователя (имя + фамилия) */
  get getUserName() {
    return this.user.firstName + ' ' + this.user.lastName
  }
}
</script>
