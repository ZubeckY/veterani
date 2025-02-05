<template>

</template>

<script lang="ts">
import {Vue, Component} from 'vue-property-decorator';

@Component({
  head(this: Pages): object  {
    return {
      title: 'Главная страница',
    }
  }
})
export default class Pages extends Vue {

}
</script>
