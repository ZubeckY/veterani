<template>

</template>

<script lang="ts">
import {Vue, Component} from 'vue-property-decorator';

@Component({
  head(this: _id): object  {
    return {
      title: this.headTitle,
    }
  }
})
export default class _id extends Vue {
  headTitle: string = '';

}
</script>

<style scoped>

</style>
