<template>
  <div></div>
</template>

<script lang="ts">
import {Vue, Component} from 'vue-property-decorator';

@Component({
  layout: 'admin',
  head(this: Blog): object  {
    return {
      title: 'Админ панель - Новости',
    }
  }
})
export default class Blog extends Vue {

}
</script>

<style scoped>

</style>
