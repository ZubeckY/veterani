<template>
  <v-dialog v-model="dialog" max-width="450px">
    <template v-slot:activator="{ on, attrs }">
      <v-icon class="mx-2"
              color="primary"
              v-bind="attrs"
              v-on="on">
        mdi-pencil
      </v-icon>
    </template>
    <v-card v-if="dialog">
      <v-form>
        <v-card-title>
          <span class="text-h5 text-pre-wrap">Редактирование документа</span>
        </v-card-title>
        <v-card-subtitle>{{item.name}}</v-card-subtitle>

        <v-card-text>
          <v-checkbox v-model="itemEdit.published"
                      label="Опубликовать"
                      hide-details
                      class="mt-0"/>

          <v-text-field v-model="itemEdit.name"
                        placeholder="Название"
                        class="mt-3"
                        hide-details
                        outlined
                        dense/>
        </v-card-text>
        <v-card-actions class="pb-3 mx-2">
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
      </v-form>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import {Vue, Component, Prop, Watch} from 'vue-property-decorator';

@Component({})
export default class edit extends Vue {
  @Prop() item?: any
  dialog: boolean = false;
  itemEdit: any = {}

  // expansion: string = ""

  @Watch("dialog")
  DialogLoad() {
    if (!this.dialog) {
      this.itemEdit = {}
      return
    }

    this.itemEdit = JSON.parse(JSON.stringify(this.item))

    // ловит баг!
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
