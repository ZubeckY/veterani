<template>

</template>

<script lang="ts">
import {Vue, Component} from 'vue-property-decorator';

@Component({
  layout: 'admin',
  head(this: Docs): object  {
    return {
      title: 'Админ панель - Документы',
    }
  }
})
export default class Docs extends Vue {

}
</script>

<style scoped>

</style>
