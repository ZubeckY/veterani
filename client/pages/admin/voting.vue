<template>
  <div>

  </div>
</template>

<script lang="ts">
import {Vue, Component} from 'vue-property-decorator';

@Component({
  layout: 'admin',
  head(this: Voting): object {
    return {
      title: 'Админ панель - Голосование',
    }
  }
})
export default class Voting extends Vue {

}
</script>

<style scoped>

</style>
