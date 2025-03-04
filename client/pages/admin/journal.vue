<template>

</template>

<script lang="ts">
import {Vue, Component} from 'vue-property-decorator';

@Component({
  layout: 'admin',
  head(this: Journal): object  {
    return {
      title: 'Админ панель - Журнал событий',
    }
  }
})
export default class Journal extends Vue {

}
</script>

<style scoped>

</style>
