<template>
  <div class="vertical-spacer"></div>
</template>

<script lang="ts">
import {Vue, Component} from 'vue-property-decorator';

@Component({})
export default class verticalSpacer extends Vue {

}
</script>

<style scoped>
.vertical-spacer {
  flex: 1 0 auto;
}
</style>
