<template>
  <div class="lk">
    <div class="lk-container">

      <div class="lk-content">
        <v-text-field label="Имя"
                      v-model="user.firstName"
                      outlined dense/>

        <v-text-field label="Фамилия"
                      v-model="user.lastName"
                      outlined dense/>

        <v-text-field label="Отчество"
                      v-model="user.middleName"
                      outlined dense/>

        <v-dialog v-model="changeMailDialog" max-width="420">
          <template v-slot:activator="{ on, attrs }">
            <v-text-field label="Email"
                          hide-details
                          :value="user.email"
                          v-bind="attrs"
                          v-on="on"
                          readonly
                          outlined
                          dense/>
          </template>

          <v-card class="ma-0 pa-0" elevation="0">
            <v-card-title class="text-h5 pb-0">Редактирование email</v-card-title>

            <v-stepper elevation="0" v-model="mailStepper">
              <v-stepper-items class="ma-0 pa-0">

                <v-stepper-content step="1">
                  <div class="pt-2">
                    <v-text-field label="Старый email (только ручной ввод)"
                                  placeholder="your-mail@gmail.com"
                                  @paste.prevent
                                  outlined dense/>
                    <v-text-field label="Новый email (только ручной ввод)"
                                  placeholder="your-mail@gmail.com"
                                  @paste.prevent
                                  outlined dense/>
                  </div>
                  <v-btn @click="mailStepper = 2"
                         color="primary">
                    Продолжить
                  </v-btn>

                  <v-btn text @click="changeMailDialog = false">
                    Отмена
                  </v-btn>
                </v-stepper-content>

                <v-stepper-content step="2">
                  <v-card elevation="0" :disabled="disabledOldMailInput">
                    <div>mail 1</div>
                    <v-otp-input length="5"/>
                  </v-card>
                  <v-btn @click="mailStepper = 3"
                         color="primary">
                    Продолжить
                  </v-btn>
                  <v-btn text @click="changeMailDialog = false">
                    Отмена
                  </v-btn>
                </v-stepper-content>

                <v-stepper-content step="3">
                  <v-card elevation="0" :disabled="disabledNewMailInput">
                    <div>mail 2</div>
                    <v-otp-input length="5"/>
                  </v-card>
                  <v-btn @click="mailStepper = 1"
                         color="primary">
                    Продолжить
                  </v-btn>
                  <v-btn text @click="changeMailDialog = false">
                    Отмена
                  </v-btn>
                </v-stepper-content>

              </v-stepper-items>
            </v-stepper>
          </v-card>
        </v-dialog>

        <div class="mt-3">
          <v-dialog v-model="changePassDialog" max-width="420">
            <template v-slot:activator="{ on, attrs }">
              <v-btn width="fit-content"
                     height="fit-content"
                     class="ma-0 pa-0"
                     color="primary"
                     v-bind="attrs"
                     v-on="on"
                     text>
                Изменить пароль
              </v-btn>
            </template>

            <v-card class="ma-0 pa-0" elevation="0">
              <v-card-title class="text-h5 pb-0">Редактирование пароля</v-card-title>

              <div class="mt-4 mx-5">
                <v-text-field label="Старый пароль"
                              v-model="passwordVal.oldValue"
                              :append-icon="showPass.oldValue ? 'mdi-eye' : 'mdi-eye-off'"
                              :type="showPass.oldValue ? 'text' : 'password'"
                              @click:append="showPass.oldValue = !showPass.oldValue"
                              outlined dense/>

                <v-text-field label="Новый пароль"
                              v-model="passwordVal.newValue"
                              :append-icon="showPass.newValue ? 'mdi-eye' : 'mdi-eye-off'"
                              :type="showPass.newValue ? 'text' : 'password'"
                              @click:append="showPass.newValue = !showPass.newValue"
                              outlined dense/>

                <v-text-field label="Повторите новый пароль"
                              v-model="passwordVal.repeatNewValue"
                              :append-icon="showPass.repeatNewValue? 'mdi-eye' : 'mdi-eye-off'"
                              :type="showPass.repeatNewValue ? 'text' : 'password'"
                              @click:append="showPass.repeatNewValue = !showPass.repeatNewValue"
                              outlined dense/>
              </div>

              <div class="d-flex pa-5 pt-0">
                <v-btn width="fit-content"
                       height="fit-content"
                       class="ma-0 pa-0 mr-4"
                       color="primary"
                       text>
                  Сохранить
                </v-btn>
                <v-btn width="fit-content"
                       height="fit-content"
                       class="ma-0 pa-0"
                       color="red" text
                       @click="changePassDialog = false">
                  Отмена
                </v-btn>
              </div>
            </v-card>
          </v-dialog>
        </div>

        <div class="d-flex mt-5">
          <v-btn width="fit-content"
                 height="fit-content"
                 class="ma-0 pa-0 mr-4"
                 color="primary"
                 text>
            Сохранить
          </v-btn>
          <v-btn width="fit-content"
                 height="fit-content"
                 class="ma-0 pa-0"
                 color="red" text
                 @click="$router.push('/lk')">
            Отмена
          </v-btn>
        </div>

      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {Vue, Component, Inject, Watch} from 'vue-property-decorator';

@Component({
  head(this: Edit): object {
    return {
      title: this.linkTitle,
    }
  }
})
export default class Edit extends Vue {
  @Inject('userFromDB') userFromDB: any;
  user: any = {};

  linkTitle: string = 'Личный кабинет пользователя';

  mailStepper: number = 1;
  changeMailDialog: boolean = false;
  disabledOldMailInput: boolean = false;
  disabledNewMailInput: boolean = false;

  changePassDialog: boolean = false;
  passwordVal: any = {
    oldValue: '',
    newValue: '',
    repeatNewValue: '',
  }

  showPass: any = {
    oldValue: false,
    newValue: false,
    repeatNewValue: false,
  }

  async mounted() {
    await this.getUserInfo()
  }

  async getUserInfo() {
    if (process.client) {

      // Если не получилось взять пользователя с Default'а, пытаемся сделать запрос на БД еще раз
      if (!this.userFromDB.value.id) {

        return await this.$axios.get('/api/auth/lk/')
          .then((res) => {
            this.setUserValue(res.data.user)
            this.linkTitle = 'Личный кабинет - редактирование профиля ' + res.data.user.firstName + ' ' + res.data.user.lastName
          })
          .catch((error: any) => {
            if (error.response.status === 401 || error.response.status === 403) {

            }
          })
          .finally(() => {
          })
      }

      // Если пользователя получили, просто присваиваем значения
      this.setUserValue(this.userFromDB.value)
      this.linkTitle = 'Личный кабинет - редактирование профиля ' + this.user.firstName + ' ' + this.user.lastName + ' '

    }
  }

  setUserValue(value: any) {
    this.user = {...value}
  }

  @Watch('changeMailDialog')
  changeStepperValue() {
    this.mailStepper = 1
  }
}
</script>

<style scoped>

</style>
