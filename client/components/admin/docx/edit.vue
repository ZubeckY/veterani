<template>
  <v-form>
    <v-dialog v-model="dialog" max-width="450px">
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
          <v-text-field v-model="itemEdit.name"
                        class="mt-2"
                        placeholder="Название"
                        hide-details
                        outlined
                        dense/>

          <v-checkbox v-model="itemEdit.published"
                      label="Опубликовать"
                      hide-details/>
        </v-card-text>

        <v-card-actions class="pb-3">
          <v-btn @click="saveEdit"
                 class="ma-0 pa-0"
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
export default class edit extends Vue {
  @Prop() item?: any

  dialog: boolean = false;
  dialogName: string = '';

  itemEdit: any = {}
  expansion: string = ""

  async mounted() {
  }

  @Watch("dialog")
  DialogLoad() {
    if (!this.dialog) {
      this.itemEdit = {}
      this.dialogName = ''
      return
    }

    this.dialogName = `Редактирование документа:\n${this.item.name}`
    this.itemEdit = JSON.parse(JSON.stringify(this.item))

    // todo ловит баг!
    // const index = this.itemEdit.name.lastIndexOf('.');
    // this.itemEdit.name = this.itemEdit.name.substring(0, index);
    // this.expansion = this.itemEdit.name.substring(index, this.itemEdit.name.length);
  }

  async saveEdit() {
    const link = '/api/admin/file/edit/' + this.itemEdit.id;
    // this.itemEdit.name = this.itemEdit.name + this.expansion;

    await this.$axios.patch(link, this.itemEdit)
      .then((response) => {
        this.$emit('saveEdit');
      })
      .then(() => {
        this.closeDialog();
      })
      .catch((error) => {
        console.log(error);
      })
  }

  closeDialog() {
    this.dialog = false
  }
}
</script>
