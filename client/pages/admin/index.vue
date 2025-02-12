<template>

</template>

<script lang="ts">
import {Vue, Component} from 'vue-property-decorator';

@Component({
  layout: 'admin',
  head(this: Admin): object  {
    return {
      title: 'Админ панель',
    }
  }
})
export default class Admin extends Vue {

}
</script>

<style scoped>

</style>
