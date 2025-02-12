<template>

</template>

<script lang="ts">

/**
 * todo
 *  Прежде чем зайти на админ панель, пользователь должен будет авторизоваться и ввести свой пароль.
 *  Если доступа у пользователя нет, его даже не загрузит на эту страницу, а просто перекинет на страницу ошибки.
 *  После авторизации, у пользователя будет создаваться временный ключ доступ, который будет храниться в session storage
 *  Перенаправление на данную страницу будет происходить каждый раз, когда ключ исчезнет из сессионного хранилища
 * */


import {Vue, Component} from 'vue-property-decorator';

@Component({
  layout: 'admin',
  head(this: Login): object  {
    return {
      title: 'Админ панель - Авторизация',
    }
  }
})
export default class Login extends Vue {

}
</script>

<style scoped>

</style>
