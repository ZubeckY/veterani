<template>
  <v-form v-model="form" @submit.prevent lazy-validation>
    <v-card class="authCard" :disabled="loading">
      <div class="authCard__container">

        <div class="authCard__header">
          <v-card-title class="authCard__title justify-center px-0">Авторизация</v-card-title>
        </div>

        <div class="authCard__body">
          <v-text-field class="authCard__input"
                        v-model="model.email"
                        :rules="[rules.email, rules.required]"
                        label="Email"
                        type="email"
                        outlined
                        dense/>

          <v-text-field label="Пароль"
                        class="authCard__input"
                        v-model="model.password"
                        :rules="[rules.required]"
                        :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
                        :type="showPass ? 'text' : 'password'"
                        @click:append="showPass = !showPass"
                        outlined
                        dense/>
        </div>

        <div class="authCard__footer login d-flex align-center justify-center flex-column">
          <v-btn class="authCard__button px-9 mb-2" outlined @click="login">Вход</v-btn>
          <v-btn class="authCard__button my-0 pa-0"
                 @click.prevent="$router.push('/auth/reg')"
                 color="primary" small text>
            Зарегистрироваться
          </v-btn>
          <v-btn class="authCard__button my-0 pa-0"
                 @click.prevent="$router.push('/')"
                 color="primary" small text>
            Перейти на сайт
          </v-btn>
        </div>

      </div>
    </v-card>
  </v-form>
</template>

<script lang="ts">
import {Vue, Component} from 'vue-property-decorator';
import Cookie from "cookie-universal";

@Component({
  layout: 'auth',
  head(this: Login): object {
    return {
      title: 'Авторизация'
    }
  }
})
export default class Login extends Vue {
  form: boolean = false;
  loading: boolean = false;

  model: any = {
    email: '',
    password: '',
  }

  showPass: boolean = false;

  rules: any = {
    email: (v: any) => /.+@.+\..+/.test(v) ||
      'Введите действительный адрес электронной почты',
    required: (v: any) => !!v || "Это поле обязательно к заполнению",
  }

  async login() {
    await this.$axios.post('/api/auth/login/', {model: this.model})
      .then(res => {
        const refreshToken = res.data.refreshToken;

        const cookies = Cookie()
        cookies.set('refreshToken', refreshToken)

        document.location.href = '/lk/'
      })
      .catch(error => {
        console.log(error)
      })
  }
}
</script>
