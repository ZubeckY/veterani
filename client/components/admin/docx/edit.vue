<template>
  <v-form>
    <v-dialog v-model="dialog" max-width="600px">
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

        <v-card-text class="d-flex align-center justify-center">
          <v-checkbox class="mr-3" v-model="itemEdit.published" label="Опубликовать"/>
          <v-text-field v-model="itemEdit.name"
                        :items="roles"
                        placeholder="Название"
                        hide-details
                        outlined
                        dense/>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeDialog">
            Отменить
          </v-btn>
          <v-btn color="blue darken-1" text @click="saveEdit">
            Сохранить
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

  items: Array<any> = []
  roles: Array<any> = []
  itemEdit: any = {}
  expansion: string = ""

  async mounted() {
  }

  @Watch("dialog")
  DialogLoad() {
    if (!this.dialog) return
    this.itemEdit = JSON.parse(JSON.stringify(this.item))
    const index = this.itemEdit.name.lastIndexOf('.');
    this.expansion = this.itemEdit.name.substring(index, this.itemEdit.name.length);
    this.itemEdit.name = this.itemEdit.name.substring(0, index);
    this.dialogName = `Редактирование документа:\n${this.item.name}`
  }

  async saveEdit() {
    const link = '/api/admin/file/edit/' + this.itemEdit.id;
    this.itemEdit.name = this.itemEdit.name + this.expansion;
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

<style scoped>

</style>
