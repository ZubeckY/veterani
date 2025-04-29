<template>
  <div>

  </div>
</template>

<script lang="ts">
import {Vue, Component} from 'vue-property-decorator';

@Component({
  layout: 'admin',
  head(this: OrgData): object {
    return {
      title: 'Админ панель - Данные организации',
    }
  }
})
export default class OrgData extends Vue {
  model: any = {
    id: 0,
    phone: "",
    email: "",
    address: "",
    mappings: "",
  }

  exist = false;

  async mounted() {

  }

  async UpdateInfo() {

  }
}
</script>

<style scoped>

</style>
