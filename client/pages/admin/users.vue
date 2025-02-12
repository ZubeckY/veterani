<template>

</template>

<script lang="ts">
import {Vue, Component} from 'vue-property-decorator';

@Component({
  layout: 'admin',
  head(this: Users): object  {
    return {
      title: 'Админ панель - Пользователи',
    }
  }
})
export default class Users extends Vue {

}
</script>

<style scoped>

</style>
