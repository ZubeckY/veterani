<template>

</template>

<script lang="ts">
import {Vue, Component} from 'vue-property-decorator';

@Component({
  head(this: Docs): object  {
    return {
      title: 'Документы',
    }
  }
})
export default class Docs extends Vue {

}
</script>

<style scoped>

</style>
