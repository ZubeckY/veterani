<template>

</template>
<script lang="ts">
import {Vue, Component} from 'vue-property-decorator';

@Component({
  head(this: Blog): object  {
    return {
      title: 'Новости',
    }
  }
})
export default class Blog extends Vue {

}
</script>
<style scoped>

</style>
