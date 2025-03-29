<template>
  <div>

    <v-text-field label="Имя" v-model="user.firstName"/>
    <v-text-field label="Фамилия" v-model="user.lastName"/>
    <v-text-field label="Отчество" v-model="user.middleName"/>

    <v-dialog v-model="changeMainDialog" max-width="700">
      <template v-slot:activator="{ on, attrs }">
        <v-text-field label="Email"
                      :value="user.email"
                      v-bind="attrs"
                      v-on="on"
                      readonly/>
      </template>

      <v-card>
        <v-card-title class="text-h5">Редактирование email</v-card-title>

        <v-stepper elevation="0" v-model="mailStepper">
          <v-stepper-items>


            <v-stepper-content step="1">
              <v-card class="ma-1 pa-2">
                <v-text-field label="Старый email"></v-text-field>
                <v-text-field label="Новый email"></v-text-field>
              </v-card>

              <v-btn @click="mailStepper = 2"
                     color="primary">
                Продолжить
              </v-btn>

              <v-btn text>
                Cancel
              </v-btn>
            </v-stepper-content>


            <v-stepper-content step="2">
              <v-card class="d-flex ma-1 pa-2">

                <v-card elevation="0" max-width="300px" :disabled="disabledOldMailInput">
                  mail 1

                  <v-otp-input length="5"/>
                </v-card>

                <v-spacer/>

                <v-card elevation="0" max-width="300px" :disabled="disabledNewMailInput">
                  mail 2

                  <v-otp-input length="5"/>
                </v-card>

              </v-card>

              <v-btn @click="mailStepper = 1"
                     color="primary">
                Продолжить
              </v-btn>

              <v-btn text>
                Cancel
              </v-btn>
            </v-stepper-content>


          </v-stepper-items>
        </v-stepper>


        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary"
                 text @click="changeMainDialog = false">
            I accept
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>


    <v-dialog v-model="changePassDialog" max-width="700">
      <template v-slot:activator="{ on, attrs }">
        <v-btn v-bind="attrs" v-on="on">Изменить пароль</v-btn>
      </template>

      <v-card>
        <v-text-field label="Старый пароль"
                      v-model="passwordVal.oldValue"/>
        <v-divider/>

        <v-text-field label="Новый пароль"
                      v-model="passwordVal.newValue"/>

        <v-text-field label="Повторите новый пароль"
                      v-model="passwordVal.repeatNewValue"/>
      </v-card>

    </v-dialog>


    <v-btn color="primary" text>Сохранить</v-btn>
    <v-btn color="red" text
           @click="$router.push('/lk')">Отмена</v-btn>

  </div>
</template>

<script lang="ts">
import {Vue, Component, Inject} from 'vue-property-decorator';

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
  changeMainDialog: boolean = false;
  disabledOldMailInput: boolean = false;
  disabledNewMailInput: boolean = false;

  changePassDialog: boolean = false;
  passwordVal: any = {
    oldValue: '',
    newValue: '',
    repeatNewValue: '',
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
}
</script>

<style scoped>

</style>
