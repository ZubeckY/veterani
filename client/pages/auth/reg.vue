<template>
  <div>
    <v-form v-model="form" @submit.prevent lazy-validation>
      <v-card class="authCard" elevation="0" :disabled="loading">
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
                          outlined/>

            <v-text-field class="authCard__input"
                          v-model="model.lastName"
                          label="Фамилия"
                          type="text"
                          :rules="[rules.required]"
                          outlined/>

            <v-text-field class="authCard__input"
                          v-model="model.middleName"
                          label="Отчество"
                          type="text"
                          :rules="[rules.required]"
                          outlined/>

            <v-text-field class="authCard__input"
                          v-model="model.email"
                          label="Email"
                          type="email"
                          :rules="[rules.required]"
                          outlined/>

            <v-text-field class="authCard__input"
                          v-model="model.password"
                          label="Пароль"
                          type="password"
                          :rules="[rules.required]"
                          :append-icon="showPass.one ? 'mdi-eye' : 'mdi-eye-off'"
                          :type="showPass.one ? 'text' : 'password'"
                          @click:append="showPass.one = !showPass.one"
                          outlined/>

            <v-text-field class="authCard__input"
                          v-model="model.repeatPassword"
                          label="Повторите пароль"
                          type="password"
                          :rules="[rules.required]"
                          :append-icon="showPass.two ? 'mdi-eye' : 'mdi-eye-off'"
                          :type="showPass.two ? 'text' : 'password'"
                          @click:append="showPass.two = !showPass.two"
                          outlined/>
          </div>

          <div class="authCard__footer d-flex align-center justify-center flex-column">

            <v-btn class="authCard__button"
                   large
                   @click.prevent="register"
                   outlined>Зарегистрироваться</v-btn>
            <v-btn class="authCard__button my-0 pa-0"
                   small
                   @click.prevent="$router.push('/auth/login')"
                   text>Войти</v-btn>

          </div>

        </div>
      </v-card>
    </v-form>
  </div>
</template>
<script lang="ts">
import {Vue, Component} from 'vue-property-decorator';

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

    console.log(this.model);

    await this.$axios.post('/api/auth/register', {model: this.model})
      .then(res => {
        console.log(res.data);
        //localStorage.setItem('accessToken', res.data.token);
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => {
        this.loading = false
      })

  }
}
</script>
<style scoped>
@import "@/assets/styles/auth.css";
</style>
