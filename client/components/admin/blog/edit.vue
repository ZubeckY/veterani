<template>
  <v-form>
    <v-dialog v-model="dialog" max-width="500px">
      <template v-slot:activator="{ on, attrs }">
        <v-icon v-bind="attrs"
                v-on="on"
                color="primary">
          mdi-pencil
        </v-icon>
      </template>
      <v-card v-if="dialog">
        <v-card-title>
          <span class="text-h5 text-pre-wrap">{{ dialogName }}</span>
        </v-card-title>

        <v-card-text>
          <v-text-field v-model="itemEdit.headLine"
                        class="mt-2"
                        label="Название"
                        placeholder="Название"
                        hide-details
                        outlined
                        dense/>

          <v-text-field v-model="itemEdit.created"
                        class="mt-5"
                        type="datetime-local"
                        label="Дата публикации"
                        placeholder="Название"
                        hide-details
                        outlined
                        dense/>

          <v-textarea v-model="itemEdit.text"
                      class="mt-5"
                      label="Название"
                      placeholder="Название"
                      hide-details
                      outlined
                      dense/>

          <uploader v-model="itemEdit.file"
                    class="mt-5"
                    :multiple="true"
                    accept="image/*"/>

          <v-checkbox v-model="itemEdit.includesSlider"
                      class="mt-0 pt-0"
                      label="Включать в слайдер"
                      hide-details/>
          <v-checkbox v-model="itemEdit.published"
                      label="Опубликовать"
                      hide-details/>
        </v-card-text>

        <v-card-actions class="pb-3">
          <v-btn class="ma-0 pa-0"
                 width="fit-content"
                 height="fit-content"
                 color="primary darken-1"
                 text>
            Сохранить
          </v-btn>
          <v-spacer></v-spacer>

          <v-btn @click="closeDialog"
                 class="ma-0 pa-0"
                 width="fit-content"
                 height="fit-content"
                 color="red darken-1"
                 text>
            Отмена
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-form>
</template>

<script lang="ts">
import {Vue, Component, Prop, Watch} from 'vue-property-decorator';

@Component({})
export default class Edit extends Vue {
  @Prop() item: any

  dialog: boolean = false;
  dialogName: string = '';

  itemEdit: any = {}

  mounted() {
    this.changeData()
  }

  @Watch('dialog')
  changeData() {
    if (!this.dialog) {
      this.itemEdit = {}
      this.dialogName = ''
      return
    }

    this.dialogName = `Редактирование публикации:\n${this.item.headLine}`

    this.itemEdit = JSON.parse(JSON.stringify(this.item))
    this.itemEdit.created = this.itemEdit.created.split('.')[0]
  }

  closeDialog() {
    this.dialog = false
  }
}
</script>
