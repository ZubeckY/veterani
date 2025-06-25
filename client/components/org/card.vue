<template>
  <article class="ourTeam-card admin-card">
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
      <v-card-text class="ourTeam-card__name" v-text="fullName(item)"></v-card-text>
      <v-card-text class="ourTeam-card__memberLabel" v-text="item.memberRoleTitle"></v-card-text>
    </div>
  </article>
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';

@Component({})
export default class OrgCard extends Vue {
  @Prop({required: true}) readonly item!: any;
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

  fullName(item: any) {
    return item.firstName + ' ' + item.lastName
  }

}
</script>
