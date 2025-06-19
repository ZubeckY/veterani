<template>
    <div class="d-flex justify-center align-center" style="width: 100%; height: 100%;">
      <v-progress-circular
          :size="100"
          :width="7"
          indeterminate
          color="primary"
      ></v-progress-circular>
    </div>
</template>

<script lang="ts">
import {Vue, Component} from 'vue-property-decorator';

@Component({
  layout: 'admin',
  head(this: Admin): object {
    return {
      title: 'Админ панель',
    }
  }
})
export default class Admin extends Vue {
  mounted() {
      this.$router.push('/admin/users');
  }
}
</script>

<style scoped>

</style>
