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


  async mounted () {
    if (process.client) {
      const accessToken = sessionStorage.getItem('authorized')

      const refreshTokenTarget = "refreshToken="
      const cookies = this.getCookie()
      let refreshToken = ''


      cookies.forEach((cookie: any) => {
        if (cookie.includes(refreshTokenTarget)) {
          refreshToken = cookie
        }
      })

      if (!refreshToken) {
        return this.logoutFunction()
      }

      // делаем запрос, проверяем пользователя

      await this.$axios.post('/api/auth/refresh', {}, {
        headers: {
          authorized: accessToken,
          cookies: refreshToken
        }
      })
        .then((response) => {
          console.log('response is: ', response.data)
        })
        .catch((error: any) => {
          console.log('error is: ', error.message)
        })

    }
  }


  getCookie(): any {
    if (process.client) {
      return document.cookie.split('; ')
    }
  }

  logoutFunction() {
    if (process.client) {
      sessionStorage.removeItem('authorized')
      this.$router.push('/auth/login')
    }
  }
}
</script>
