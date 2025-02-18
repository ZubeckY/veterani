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
import Cookie from 'cookie-universal'
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
      const cookies = Cookie()

      await this.$axios.post('/api/auth/refresh')
        .then(res => {
          console.log(res)
        })
        .catch((error: any) => {
          console.log(error.response)

          if (error.response.status === 401) {
            this.logoutFunction()
          }
        })
    }
  }

  logoutFunction() {
    const cookies = Cookie()
    cookies.removeAll()
    this.$router.push('/auth/login/')
  }
}
</script>
