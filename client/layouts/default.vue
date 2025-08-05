<template>
  <v-app>
    <main-header :user="userFromDB.value"/>

    <v-main style="margin-top: 140px; min-height: 70vh">
      <Nuxt :userFromDB="userFromDB" :infoData="infoData"/>
    </v-main>

    <main-footer :infoData="infoData"/>
  </v-app>
</template>

<script lang="ts">
import {reactive} from "vue";
import {Vue, Component, Provide, ProvideReactive} from 'vue-property-decorator';

@Component({})
export default class Default extends Vue {
  @ProvideReactive() userFromDB: any = reactive({
    value: {
      id: null,
      firstName: '',
      lastName: '',
      file: null,
      needLoading: true,
    }
  });

  @Provide() infoData: any = reactive({
    value: {}
  });

  async created() {
    await this.getUserInfo()
    await this.getInfoData()
  }

  async getInfoData() {
    await this.$axios.get('/api/contactInfo/get/')
      .then((res) => {
        this.infoData.value = res.data[0]
      })
      .catch((error) => {
        console.log(error)
      })
  }

  async getUserInfo() {
    // Если не получилось взять пользователя с Default'а, пытаемся сделать запрос на БД еще раз
    await this.$axios.get('/api/auth/lk/')
      .then((res) => {
        this.userFromDB.value = res.data.user
      })
      .catch((error: any) => {
        if (error.response.status === 401 || error.response.status === 403) {
          console.log('Пользователь не авторизирован')
          this.userFromDB.value = {
            id: null,
            firstName: '',
            lastName: '',
            file: null,
            needLoading: false,
          }
        }
      })
  }
}
</script>
