<template>
  <div>

    <v-card class="mx-auto"
            max-width="390">
      <v-file-input v-model="file"
                    type="file"
                    ref="file"
                    show-size
      />

      <v-btn @click.prevent="sendFile" block>Клик</v-btn>
    </v-card>

    <pre v-text="file"></pre>

  </div>
</template>

<script lang="ts">
import {Vue, Component} from 'vue-property-decorator';

@Component({})
export default class test extends Vue {
  file: File | null = null;

  sendFile() {
    if (this.file) {
      const formData = new FormData()
      formData.append("file", this.file)

      this.$axios.post('/api/post/test/', formData, {
        headers: { 'Content-Type': '*' },
        onUploadProgress: ({progress, rate}) => onUploadProgress(progress, rate),
      })
        .then(res => {
          console.log(res.data)
        })
        .catch(err => {
          console.log(err)
        })
    }

    function onUploadProgress(progress: number, rate: number) {
      return console.log(
        `
          Upload [${(progress * 100).toFixed(2)}%]:
          ${(rate / 1024).toFixed(2)}KB/s
         `
      )
    }
  }
}
</script>

<style scoped>

</style>
