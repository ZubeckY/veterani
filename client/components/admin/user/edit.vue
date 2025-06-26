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
          <v-checkbox class="mr-3" v-model="itemEdit.activated" label="Активация"/>
          <v-checkbox class="mr-3" v-model="itemEdit.blocked" label="Заблокирован"/>
          <v-autocomplete v-model="itemEdit.role"
                          item-text="value"
                          item-value="key"
                          :items="roles"
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
  @Prop() item: any

  dialog: boolean = false;
  dialogName: string = '';

  items: Array<any> = []
  roles: Array<any> = []
  itemEdit: any = {}

  async mounted() {
    await this.getRoleList()
  }

  @Watch("dialog")
  DialogLoad() {
    if (!this.dialog) return
    this.itemEdit = JSON.parse(JSON.stringify(this.item))
    this.dialogName = `Редактирование пользователя:\n${this.userName}`
  }

  async getRoleList() {
    await this.$axios.post('/api/admin/user/role-list/')
      .then((response) => {
        this.roles = response.data.roles
      })
  }

  get userName() {
    return `${this.itemEdit.firstName} ${this.itemEdit.lastName}`;
  }

  async saveEdit() {
    const link = '/api/admin/user/edit/' + this.itemEdit.id
    await this.$axios.post(link, this.itemEdit)
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
