<template>
  <v-form v-model="form" @submit.prevent lazy-validation>
    <v-card class="authCard" :disabled="loading">
      <div class="authCard__container">

        <div class="authCard__header">
          <v-card-title class="authCard__title justify-center px-0">Регистрация</v-card-title>
        </div>

        <div class="authCard__body">
          <v-text-field class="authCard__input"
                        v-model="model.firstName"
                        label="Имя"
                        type="text"
                        :rules="[rules.required]"
                        outlined
                        dense/>

          <v-text-field class="authCard__input"
                        v-model="model.lastName"
                        label="Фамилия"
                        type="text"
                        :rules="[rules.required]"
                        outlined
                        dense/>

          <v-text-field class="authCard__input"
                        v-model="model.middleName"
                        label="Отчество"
                        type="text"
                        :rules="[rules.required]"
                        outlined
                        dense/>

          <v-text-field class="authCard__input"
                        v-model="model.email"
                        label="Email"
                        type="email"
                        :rules="[rules.required]"
                        outlined
                        dense/>

          <v-text-field class="authCard__input"
                        v-model="model.password"
                        label="Пароль"
                        :rules="[rules.required]"
                        :append-icon="showPass.one ? 'mdi-eye' : 'mdi-eye-off'"
                        :type="showPass.one ? 'text' : 'password'"
                        @click:append="showPass.one = !showPass.one"
                        outlined
                        dense/>

          <v-text-field class="authCard__input"
                        v-model="model.repeatPassword"
                        label="Повторите пароль"
                        :rules="[rules.required]"
                        :append-icon="showPass.two ? 'mdi-eye' : 'mdi-eye-off'"
                        :type="showPass.two ? 'text' : 'password'"
                        @click:append="showPass.two = !showPass.two"
                        outlined
                        dense/>
        </div>


        <div class="authCard__footer d-flex align-center justify-center flex-column">
          <v-btn class="authCard__button px-9 mb-2" outlined @click="register">Регистрация</v-btn>
          <v-btn class="authCard__button my-0 pa-0"
                 @click.prevent="$router.push('/auth/login')"
                 color="primary" small text>
            Авторизация
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
  head(this: reg): object {
    return {
      title: 'Регистрация'
    }
  }
})
export default class reg extends Vue {
  form: boolean = false;
  loading: boolean = false;

  model: any = {
    firstName: '',
    lastName: '',
    middleName: '',
    email: '',
    password: '',
  }

  repeatPassword: string = '';

  showPass: any = {
    one: false,
    two: false,
  }

  rules: any = {
    required: (v: any) => !!v || "Это поле обязательно к заполнению"
  }

  async register(): Promise<void> {
    this.loading = true;

    await this.$axios.post('/api/auth/register', {model: this.model})
      .then(res => {
        const refreshToken = res.data.refreshToken;

        const cookies = Cookie()
        cookies.set('refreshToken', refreshToken)

        document.location.href = '/lk/'
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => {
        this.loading = false
      })
  }
}
</script>
