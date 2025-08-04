<template>
  <div class="lk">
    <div class="lk-container">

      <pre v-text="user"></pre>

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

        <lk-edit-mail :mail="user.email" @success="updateUserInfo"/>
        <lk-edit-pass class="mt-3"
                      :passwordVal="passwordVal"
                      @success="updateUserInfo"
                      @cleanPassValues="cleanPassValues"/>

        <uploader v-model="localFile"
                  :uploadFiles="user.file"
                  class="mt-3"
                  accept="image/*"
                  @successDelete="deleteFileFromModel"
                  @successUpload="getFilesModel"/>

        <div class="d-flex my-7">
          <v-btn width="fit-content"
                 height="fit-content"
                 class="ma-0 pa-0 mr-4"
                 color="primary" text
                 @click="uploadNewDataUser">
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
import Cookie from "cookie-universal";

@Component({
  head(this: Edit): object {
    return {
      title: this.linkTitle,
    }
  }
})
export default class Edit extends Vue {
  @Inject('userFromDB') userFromDB: any;
  user: any = {
    firstName: '',
    lastName: '',
    middleName: '',
    file: null,
  };
  localFile: any = null;
  linkTitle: string = 'Личный кабинет пользователя';
  passwordVal: any = {
    oldValue: '',
    newValue: '',
    repeatNewValue: '',
  }

  async mounted() {
    await this.getUserInfo()
  }

  async uploadNewDataUser() {
    await this.$axios.post('/api/user/data/change/', {...this.user})
      .then((res) => {
        this.updateUserInfo(res.data.tokens.refreshToken)
      })
      .then(() => {
        this.$router.push('/lk')
      })
      .catch((error) => {
        console.log(error)
      })
  }

  async updateUserInfo(refreshToken: string) {
    if (process.client) {
      const cookies = Cookie()
      refreshToken && cookies.set('refreshToken', refreshToken)

      if (!refreshToken) {
        return console.log('refreshToken is not updated')
      }

      await this.$axios.get('/api/auth/lk/')
        .then((res) => {
          this.setUserValue(res.data.user)
          this.linkTitle = 'Личный кабинет - редактирование профиля ' + res.data.user.firstName + ' ' + res.data.user.lastName
        })
        .catch((error: any) => {
          this.logoutFunction()
        })
    }
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
            this.logoutFunction()
          })
      }
      // Если пользователя получили, просто присваиваем значения
      this.setUserValue(this.userFromDB.value)
      this.linkTitle = 'Личный кабинет - редактирование профиля ' + this.user.firstName + ' ' + this.user.lastName + ' '
    }
  }

  setUserValue(value: any) {
    this.user = {...value}
    this.userFromDB.value = {...value}
  }

  getFilesModel(file: any) {
    this.user.file = file
  }

  deleteFileFromModel() {
    this.user.file = null
  }

  cleanPassValues() {
    this.passwordVal = {
      oldValue: '',
      newValue: '',
      repeatNewValue: '',
    }
  }

  /* logout функция */
  logoutFunction() {
    const cookies = Cookie()
    cookies.removeAll()
    this.$router.push('/auth/login/')
  }
}
</script>
