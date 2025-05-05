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

          <v-autocomplete v-model="selectedUser"
                          class="ma-1"
                          label="Выбрать пользователя"
                          :items="users"
                          item-text="name"
                          item-value="name"
                          chips dense outlined>
            <template v-slot:selection="data">
              <v-chip v-bind="data.attrs"
                      :input-value="data.selected"
                      @click="data.select"
                      @click:close="remove(data.item)"
                      close>
                <v-avatar left>
                  <v-img :src="data.item.avatar"></v-img>
                </v-avatar>
                {{ data.item.name }}
              </v-chip>
            </template>
            <template v-slot:item="data">
              <v-list-item-avatar>
                <img :src="data.item.avatar">
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title v-html="data.item.name"></v-list-item-title>
                <v-list-item-subtitle v-html="data.item.group"></v-list-item-subtitle>
              </v-list-item-content>
            </template>
          </v-autocomplete>

        </v-card>
      </v-dialog>
    </header>

    <div class="d-flex flex-row flex-wrap">
      <article class="ourTeam-card admin-card" v-for="i in 4" :key="i">
        <div class="ourTeam-card__container">
          <div class="d-flex justify-end">
            <v-img class="ourTeam-card__image admin-image" width="calc(100% - 10px)" src="/placeholder_lk.jpg"/>
            <div style="position: absolute; z-index: 1000;">
              <v-menu offset-y>
                <template v-slot:activator="{ attrs, on }">
                  <v-btn v-bind="attrs" v-on="on" icon>
                    <v-icon>mdi-dots-vertical-circle-outline</v-icon>
                  </v-btn>
                </template>

                <v-list class="pa-0" dense>
                  <v-list-item v-for="item in items"
                               :class="item.color + ' py-0'"
                               :key="item.text" link>
                    <v-list-item-title v-text="item.text"></v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>
          </div>
          <v-card-text class="ourTeam-card__name">Фамилия Имя Отчество</v-card-text>
          <v-card-text class="ourTeam-card__memberLabel">Член нашей команды</v-card-text>
        </div>
      </article>
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
  selectedUser: any = {}
  users: any = [{}, {}]

  data: any = []
  items: any = [
    {
      text: 'Изменить',
      color: 'primary--text',
    },
    {
      text: 'Удалить',
      color: 'red--text',
    },
  ]

  async mounted() {
    await this.getMembersList()
  }

  async getMembersList() {
    this.$axios.get('/api/admin/members/list')
      .then((res) => {
        this.data = res.data
      })
  }
}
</script>
