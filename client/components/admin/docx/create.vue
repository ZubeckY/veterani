<template>
  <v-dialog v-model="addDialog" max-width="450px">
    <template v-slot:activator="{ on, attrs }">
      <v-btn v-bind="attrs" v-on="on"
             class="ma-2" color="green" outlined>
        Добавить
      </v-btn>
    </template>
    <v-card v-if="addDialog">
      <v-form>
        <v-card-title>
          <span class="text-h5 text-pre-wrap">Добавить документ</span>
        </v-card-title>
        <v-card-text>
          <v-checkbox v-model="model.published"
                      label="Опубликовать"
                      class="mt-0"
                      hide-details/>

          <v-text-field v-model="model.name"
                        @input="changeFileName"
                        placeholder="Отображаемое название файла"
                        class="mt-3"
                        hide-details
                        outlined
                        dense/>

          <uploader v-model="localFile"
                    :uploadFiles="model.file"
                    @successUpload="getFilesModel"
                    @successDelete="deleteFileFromModel"
                    class="mt-5"/>
        </v-card-text>
        <v-card-actions class="pb-3 mx-2">
          <v-btn @click="saveAndClose"
                 class="ma-0 pa-0"
                 width="fit-content"
                 height="fit-content"
                 color="primary darken-1"
                 text>
            Сохранить
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn @click="addDialog = false"
                 class="ma-0 pa-0"
                 width="fit-content"
                 height="fit-content"
                 color="red darken-1"
                 text>
            Отмена
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import {Vue, Component, Watch} from 'vue-property-decorator';

@Component({})
export default class Create extends Vue {
  addDialog: boolean = false;
  localFile: any = null
  model: any = {
    name: '',
    published: false,
    file: null
  }

  @Watch('addDialog')
  changeModel() {
    this.model = {
      name: '',
      published: false,
      file: null
    }
  }

  changeFileName() {
    if (this.model?.file?.id) {
      this.model.file.name = this.model.name
    }
  }

  getFilesModel(file: any) {
    this.model.file = file;
    if (!this.model.name.length) {
      this.model.name = file.name;
    }
    this.model.file.published = this.model.published
    this.changeFileName()
  }

  deleteFileFromModel() {
    this.model.name = ''
    this.model.file = null
  }

  async saveAndClose() {
    await this.$axios.patch(`/api/admin/file/edit/${this.model.file.id}`, {
      name: this.model.name,
      published: this.model.published
    })
      .then(res => {
        this.$emit('success')
        this.addDialog = false
      })
      .catch(err => console.log(err))
  }
}
</script>
