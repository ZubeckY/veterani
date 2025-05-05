<template>
  <div>

    <v-dialog
      v-model="dialog"
      max-width="500px"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-icon color="primary" v-bind="attrs" v-on="on">mdi-pencil</v-icon>
      </template>
      <v-card v-if="dialog">
        <v-card-title>
          <span class="text-h5 text-pre-wrap">{{ dialogName }}</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col
                cols="12"
                sm="6"
                md="4"
              >
                <v-checkbox
                  v-model="itemEdit.activated"
                  label="Активация"
                ></v-checkbox>
              </v-col>
              <v-col
                cols="12"
                sm="6"
                md="4"
              >
                <v-checkbox
                  v-model="itemEdit.blocked"
                  label="Заблокирован"
                ></v-checkbox>
              </v-col>
              <v-col
                cols="12"
                sm="6"
                md="4"
              >
                <v-autocomplete
                  v-model="itemEdit.role"
                  :items="items">

                </v-autocomplete>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            @click="closeDialog"
          >
            Отменить
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="saveEdit"
          >
            Сохранить
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </div>
</template>

<script lang="ts">
import {Vue, Component, Prop, Watch} from 'vue-property-decorator';

@Component({})
export default class edit extends Vue {
  @Prop() item: any

  itemEdit: any
  dialog: boolean = false;
  dialogName: string = '';
  items: any

  @Watch("dialog")
  DialogLoad() {
    if (!this.dialog) return
    this.itemEdit = Object.assign(this.item)
    this.dialogName = `Редактирование пользователя:\n${this.userName}`
    this.getItems()
  }

  get userName() {
    return `${this.itemEdit.firstName} ${this.itemEdit.lastName}`;
  }

  getItems() {
    this.items = ["Пользователь", "Модератор", "Админ"];
  }

  saveEdit() {
    this.$emit('saveEdit', this.itemEdit);
    this.closeDialog();
  }

  closeDialog () {
    this.dialog = false
  }

}
</script>

<style scoped>

</style>
