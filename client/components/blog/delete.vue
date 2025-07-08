<template>
  <v-dialog v-model="deleteDialog"
            max-width="360">
    <template v-slot:activator="{ on, attrs }">
      <v-btn v-if="showButton"
             v-bind="attrs" v-on="on"
             color="error darken-1" icon>
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </template>

    <v-card class="ma-0 py-2">
      <v-card-text class="mt-2 pa-0 pl-4">
        Вы действительно хотите удалить пост?
      </v-card-text>

      <v-card-actions>
        <v-btn class="ma-0 pa-0"
               height="fit-content"
               color="error"
               small text
               @click="deleteDialog = false">
          Отмена
        </v-btn>

        <v-spacer></v-spacer>
        <v-btn class="ma-0 pa-0"
               height="fit-content"
               color="primary"
               small text
               @click="deleteItem">
          Подтвердить
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import {Vue, Component, Prop, Watch} from 'vue-property-decorator';

@Component({})
export default class Delete extends Vue {
  @Prop() readonly modelDialog?: boolean
  @Prop({default: true}) readonly showButton?: boolean
  deleteDialog: boolean = false;

  mounted() {
    this.changeModelDialog()
  }

  @Watch('modelDialog')
  changeModelDialog() {
    if (!!this.modelDialog) {
      return this.deleteDialog = this.modelDialog;
    }
  }

  deleteItem() {
    this.deleteDialog = false;
    this.$emit('deleteItem')
  }
}
</script>
