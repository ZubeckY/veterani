<template>
  <div>Выход из системы...</div>
</template>

<script lang="ts">
import {Vue, Component} from 'vue-property-decorator';

@Component({
  head(this: Logout): object {
    return {
      title: 'Logout...',
    }
  }
})

// todo запрос на бэк
export default class Logout extends Vue {
  mounted() {
    if (process.client) {
      if (document.cookie && sessionStorage.getItem('authorized')) {

        document.cookie.split(";").forEach(function (c) {
          document.cookie = c
            .replace(/^ +/, "")
            .replace(/=.*/, "=;expires=" + new Date()
              .toUTCString() + ";path=/"
            );
        });

        sessionStorage.removeItem('authorized')
        localStorage.removeItem('refreshToken')

        document.location.href = '/auth/login/'
      }

      document.location.href = '/auth/login/'
    }
  }
}
</script>

<style scoped>

</style>
