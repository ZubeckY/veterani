<template>
  <v-app>
    <main-header :user="userFromDB.value"/>

    <v-main style="margin-top: 140px; min-height: 70vh">
      <Nuxt :userFromDB="userFromDB"/>
    </v-main>

    <main-footer/>
  </v-app>
</template>

<script lang="ts">
import {reactive} from "vue";
import {Vue, Component, Provide} from 'vue-property-decorator';

@Component({})
export default class Default extends Vue {
  @Provide() userFromDB: any = reactive({
    value: {}
  });

  async created() {
    await this.getUserInfo()
  }

  async getUserInfo() {
    // Если не получилось взять пользователя с Default'а, пытаемся сделать запрос на БД еще раз
    return await this.$axios.get('/api/auth/lk/')
      .then((res) => {
        this.userFromDB.value = res.data.user
      })
      .catch((error: any) => {
        if (error.response.status === 401 || error.response.status === 403) {
          console.log('Пользователь не авторизирован')
        }
      })
  }
}
</script>
