<template>
  <div>
    <v-form v-model="form" @submit.prevent lazy-validation>
      <v-card class="authCard" elevation="0" :disabled="loading">
        <div class="authCard__container">

          <div class="authCard__header">
            <v-card-title class="authCard__title justify-center px-0">Авторизация</v-card-title>
          </div>

          <div class="authCard__body">
            <v-text-field class="authCard__input"
                          v-model="model.email"
                          label="Email"
                          type="email"
                          outlined/>

            <v-text-field class="authCard__input"
                          v-model="model.password"
                          label="Пароль"
                          type="password"
                          :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
                          :type="showPass ? 'text' : 'password'"
                          @click:append="showPass = !showPass"
                          outlined/>
          </div>

          <div class="authCard__footer d-flex align-center justify-center flex-column">

            <v-btn class="authCard__button" large outlined>Вход</v-btn>
            <v-btn class="authCard__button my-0 pa-0"
                   small
                   @click.prevent="$router.push('/auth/reg')"
                   text>Зарегистрироваться</v-btn>

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
  head(this: Login): object  {
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

}
</script>

<style>
  @import "@/assets/styles/auth.css";
</style>
