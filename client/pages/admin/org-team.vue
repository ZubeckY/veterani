<template>

</template>

<script lang="ts">
import {Vue, Component} from 'vue-property-decorator';

@Component({
  layout: 'admin',
  head(this: OrgTeam): object  {
    return {
      title: 'Админ панель - Члены организации',
    }
  }
})
export default class OrgTeam extends Vue {

}
</script>

<style scoped>

</style>
