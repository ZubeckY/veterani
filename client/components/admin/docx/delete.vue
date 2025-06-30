<template>
  <v-dialog v-model="deleteDialog"
            max-width="360">
    <template v-slot:activator="{ on, attrs }">
      <v-icon color="red" v-bind="attrs" v-on="on">mdi-delete</v-icon>
    </template>

    <v-card class="ma-0 py-2">
      <v-card-text class="mt-2 pa-0 pl-4">
        Вы действительно хотите удалить документ:
      </v-card-text>
      <v-card-text class="pa-0 pl-4">
        {{ docName }}?
      </v-card-text>

      <v-card-actions>
        <v-btn class="ma-0 pa-0"
               height="fit-content"
               color="error"
               small text
               @click="deleteDialog = false"
        >
          Отмена
        </v-btn>

        <v-spacer></v-spacer>
        <v-btn class="ma-0 pa-0"
               height="fit-content"
               color="primary"
               small text
               @click="deleteItem"
        >
          Подтвердить
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';

@Component({})
export default class Delete extends Vue {
  @Prop() item: any
  deleteDialog: boolean = false;

  get docName() {
    return this.item.id + ' ' + this.item.name;
  }

  deleteItem() {
    this.$emit('deleteDoc', this.item.id);
    this.deleteDialog = false;
  }
}
</script>

<style scoped>

</style>
