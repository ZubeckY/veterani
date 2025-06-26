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

        <lk-edit-mail :mail="user.email"/>

        <div class="mt-3">
          <lk-edit-pass :passwordVal="passwordVal"
                        @cleanPassValues="cleanPassValues"/>
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
      }
      // Если пользователя получили, просто присваиваем значения
      this.setUserValue(this.userFromDB.value)
      this.linkTitle = 'Личный кабинет - редактирование профиля ' + this.user.firstName + ' ' + this.user.lastName + ' '
    }
  }

  setUserValue(value: any) {
    this.user = {...value}
  }

  cleanPassValues() {
    this.passwordVal = {
      oldValue: '',
      newValue: '',
      repeatNewValue: '',
    }
  }
}
</script>
