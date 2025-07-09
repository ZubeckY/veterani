<template>
  <div>
    <v-dialog v-model="addDialog"
              max-width="450px">
      <template v-slot:activator="{ on, attrs }">
        <v-btn v-bind="attrs" v-on="on"
               class="ma-2" color="green" outlined>
          Добавить
        </v-btn>
      </template>

      <v-card>
        <v-card-title>
          <span class="text-h5 text-pre-wrap">{{ editMode ? 'Изменить' : 'Добавить' }} члена организации</span>
        </v-card-title>
        <select-user :disabled="editMode" v-model="selectedUser" :users="users"/>
        <v-text-field label="Занимаемое положение в организации"
                      placeholder="Председатель, член организации..."
                      :disabled="emptyValue"
                      v-model="memberRole"
                      class="mx-3"
                      outlined dense
                      hide-details/>
        <v-card-actions class="mt-4 pb-3">
          <v-btn :disabled="memberRoleEmpty"
                 @click="saveManager"
                 class="ma-0 pa-0"
                 width="fit-content"
                 height="fit-content"
                 color="primary darken-1"
                 text>
            {{ editMode ? 'Изменить' : 'Добавить' }}
          </v-btn>
          <v-spacer></v-spacer>

          <v-btn @click="closeAndUpdate"
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

    <div class="d-flex flex-row flex-wrap">
      <org-card v-for="(item, i) in data"
                :key="i"
                :item="item"
                :showButtons="true"
                @editItem="showEditDialog"
                @deleteItem="showDeleteDialog"/>

      <admin-org-team-delete :dialog="deleteDialog"
                             :item="selectedUserTech"
                             @deleteItem="deleteMember"
      />
    </div>
  </div>
</template>

<script lang="ts">
import {Vue, Component} from 'vue-property-decorator';

@Component({
  layout: 'admin',
  head(this: OrgTeam): object {
    return {
      title: 'Админ панель - Члены организации',
    }
  }
})
export default class OrgTeam extends Vue {
  editMode: boolean = false;
  addDialog: boolean = false;
  memberRole: string = ''
  selectedUser: object | number = {}

  deleteDialog: boolean = false;
  selectedUserTech: any = {};

  users: Array<any> = []
  data: Array<any> = []

  async mounted() {
    await this.updateData()
  }

  async updateData() {
    await this.getMembersList()
    await this.getUsersList()
  }

  async getUsersList() {
    this.$axios.get('/api/admin/members/users')
      .then((res) => {
        this.users = res.data
      })
  }

  async getMembersList() {
    this.$axios.get('/api/admin/members/list')
      .then((res) => {
        this.data = res.data
      })
  }

  showEditDialog(item: any) {
    this.addDialog = true
    this.editMode = true
    this.users = [item]
    this.selectedUser = item.id
    this.memberRole = item.memberRoleTitle ?? ''

  }

  showDeleteDialog(item: any) {
    this.selectedUserTech = item
    this.deleteDialog = true
  }

  async saveManager() {
    this.editMode ? await this.editMember() : await this.createMember()
  }

  async createMember() {
    !this.editMode && await this.$axios.post('/api/admin/members/create', {
      id: this.selectedUser,
      memberRole: this.memberRole,
    })
      .then((res) => {
        this.closeAndUpdate()
      })
      .catch((err) => {
        console.log(err)
      })
  }

  async editMember() {
    this.editMode && await this.$axios.post('/api/admin/members/edit', {
      id: this.selectedUser,
      memberRole: this.memberRole,
    })
      .then((res) => {
        this.closeAndUpdate()
      })
      .catch((err) => {
        console.log(err)
      })
  }

  async deleteMember() {
    await this.$axios.post('/api/admin/members/delete', {
      id: this.selectedUserTech.id,
    })
      .then((res) => {
        this.closeAndUpdate()
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => {
        this.closeDeleteDialog()
      })
  }

  closeDeleteDialog() {
    this.deleteDialog = false
    this.selectedUserTech = {}
  }

  closeDialog() {
    this.editMode = false
    this.addDialog = false
    this.selectedUser = {}
    this.memberRole = ''
  }

  closeAndUpdate() {
    this.closeDialog()
    this.updateData()
  }

  get emptyValue() {
    return typeof this.selectedUser == 'object'
  }

  get memberRoleEmpty() {
    return this.memberRole.length <= 0
  }
}
</script>
