<template>

</template>

<script lang="ts">
import {Vue, Component} from 'vue-property-decorator';

@Component({
  layout: 'admin',
  head(this: OrgData): object  {
    return {
      title: 'Админ панель - Данные организации',
    }
  }
})
export default class OrgData extends Vue {

}
</script>

<style scoped>

</style>
