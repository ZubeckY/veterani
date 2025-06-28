<template>
  <div>
    <header class="d-flex align-center flex-row ma-2">
      <div style="width: 350px;">
        <v-text-field append-icon="mdi-magnify"
                      label="Поиск"
                      dense outlined
                      hide-details/>
      </div>
      <v-dialog v-model="addDialog"
                max-width="360">
        <template v-slot:activator="{ on, attrs }">
          <v-btn v-bind="attrs" v-on="on"
                 class="ml-3" color="green" outlined>
            Добавить
          </v-btn>
        </template>

        <v-card>
          <v-card-title>Добавить члена организации</v-card-title>
          <select-user v-model="selectedUser" :users="users"/>
          <v-text-field label="Занимаемое положение в организации"
                        placeholder="Председатель, член организации..."
                        :disabled="emptyValue"
                        v-model="memberRole"
                        class="mx-3"
                        outlined dense
                        hide-details/>
          <div class="d-flex px-3 mt-2 py-2" style="width: 100%">
            <v-btn class="ma-0 pa-0"
                   small text
                   color="red"
                   width="fit-content"
                   height="fit-content"
                   @click="addDialog = false">
              Отмена
            </v-btn>

            <v-spacer/>

            <v-btn :disabled="memberRoleEmpty"
                   class="ma-0 pa-0"
                   small text
                   color="primary"
                   width="fit-content"
                   height="fit-content"
            >Добавить
            </v-btn>
          </div>
        </v-card>
      </v-dialog>
    </header>

    <div class="d-flex flex-row flex-wrap">
      <org-card v-for="(item, i) in data" :key="i"
                :item="item" :showButtons="true"/>
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
  addDialog: boolean = false;
  memberRole: string = ''
  selectedUser: object | number = {}
  users: any = []

  data: any = []


  async mounted() {
    await this.getMembersList()
    await this.getUsersList()
  }

  async getUsersList() {
    this.$axios.get('/api/admin/user/list')
      .then((res) => {
        this.users = res.data.users
      })
  }

  async getMembersList() {
    this.$axios.get('/api/admin/members/list')
      .then((res) => {
        this.data = res.data
      })
  }

  get emptyValue() {
    return typeof this.selectedUser == 'object'
  }

  get memberRoleEmpty() {
    return this.memberRole.length <= 0
  }
}
</script>
