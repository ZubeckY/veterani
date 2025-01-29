<template>
  <v-app>
    <div class="fullSize d-flex justify-center align-center flex-column">
      <div v-if="error.statusCode === 404" class="d-flex flex-column justify-center align-center">
        <v-card-title style="font-size: 30px">{{ pageNotFound.title }}</v-card-title>
        <v-card-text class="text-center">{{ pageNotFound.text }}</v-card-text>
      </div>

      <div v-else class="d-flex flex-column justify-center align-center">
        <v-card-title style="font-size: 30px">{{ otherError.title }}</v-card-title>
        <v-card-text class="text-center">{{ otherError.text }}</v-card-text>
      </div>
      <NuxtLink to="/">Перейти на главную страницу</NuxtLink>
    </div>
  </v-app>
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator'

@Component({
  layout: 'empty',
  head(this: Error): object  {
    return {
      title: this.error.statusCode === 404 ? this.pageNotFound.title : this.otherError.title
    }
  }
})
export default class Error extends Vue {
  @Prop() error: any

  pageNotFound: any = {
    title: 'Упс! Страница не найдена!',
    text: 'Запрашиваемой страницы не существует!'
  }

  otherError: any = {
    title: 'Ошибка! Что-то пошло не так',
    text: 'Ошибка сервера!'
  }
}
</script>
