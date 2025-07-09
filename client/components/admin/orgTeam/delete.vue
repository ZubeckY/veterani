<template>
  <v-dialog v-model="deleteDialog"
            max-width="360">
    <v-card class="ma-0 py-2">
      <v-card-text class="mt-2 pa-0 pl-4">
        Вы действительно хотите удалить члена организации:
      </v-card-text>
      <v-card-text class="pa-0 pl-4">
        {{ userName }}?
      </v-card-text>

      <v-card-actions>
        <v-btn class="ma-0 pa-0"
               height="fit-content"
               color="primary"
               small text
               @click="deleteItem">
          Подтвердить
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn class="ma-0 pa-0"
               height="fit-content"
               color="error"
               small text
               @click="deleteDialog = false">
          Отмена
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import {Vue, Component, Prop, Watch} from 'vue-property-decorator';

@Component({})
export default class Delete extends Vue {
  @Prop() readonly item: any
  @Prop({ default: false }) dialog?: boolean
  deleteDialog: boolean = false;

  mounted() {
    this.changeDialog()
  }

  @Watch('dialog')
  changeDialog() {
    if (this.dialog) {
      this.deleteDialog = this.dialog
    }
  }

  get userName() {
    return this.item.id + ' ' + this.item.firstName + ' ' + this.item.lastName;
  }

  deleteItem() {
    this.$emit('deleteItem', this.item.id);
    this.deleteDialog = false;
  }
}
</script>
