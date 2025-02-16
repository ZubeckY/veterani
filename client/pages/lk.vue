<template>
  <div>


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


  async mounted() {
    if (process.client) {
      const accessToken = sessionStorage.getItem('authorized')
      const refreshToken = localStorage.getItem('refreshToken')
      document.cookie = 'refreshToken=' + refreshToken

      // делаем запрос, проверяем пользователя
      await this.$axios.post('/api/auth/refresh', {}, {
        headers: {
          cookie: refreshToken,
          authorized: accessToken,
        }
      })
        .then((response) => {
          if (response.status != 200) {
            this.logoutFunction()
          }

          if (!accessToken) {
            sessionStorage.setItem('authorized', 'authorized=' + response.headers.authorized)
          }
        })
        .catch((error: any) => {
          console.log('error is: ', error.message)
        })
    }
  }


  logoutFunction() {
    if (process.client) {
      sessionStorage.removeItem('authorized')
      localStorage.removeItem('refreshToken')
      this.clearCookie()

      document.location.href = '/auth/logout/'
    }
  }

  getCookie(): any {
    if (process.client) {
      return document.cookie
    }
  }

  clearCookie(): any {
    if (process.client) {
      return document.cookie.split(";").forEach(function (c) {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date()
            .toUTCString() + ";path=/"
          );
      });
    }
  }
}
</script>
