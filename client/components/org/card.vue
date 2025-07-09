<template>
  <article :class="className">
    <div class="ourTeam-card__container">
      <div class="d-flex justify-end">
        <v-img class="ourTeam-card__image admin-image" width="calc(100% - 10px)" src="/placeholder_lk.jpg"/>
        <div style="position: absolute; z-index: 1000;" v-if="showButtons">
          <menu-button :menu="menu"
                       :dark="false"
                       @editItem="createEvent('editItem')"
                       @deleteItem="createEvent('deleteItem')"
          />
        </div>
      </div>
      <v-card-text class="ourTeam-card__name"
                   v-text="fullName(item)"/>
      <v-card-text class="ourTeam-card__memberLabel"
                   v-text="item.memberRoleTitle"/>
    </div>
  </article>
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';

@Component({})
export default class OrgCard extends Vue {
  @Prop({required: true}) readonly item!: any;
  @Prop({default: false}) showButtons?: boolean;

  menu: Array<any> = [
    {
      text: 'Изменить',
      color: 'primary--text',
      event: 'editItem'
    },
    {
      text: 'Удалить',
      color: 'red--text',
      event: 'deleteItem'
    },
  ]

  createEvent(event: string) {
    return this.$emit(event, this.item);
  }

  fullName(item: any) {
    return item.firstName + ' ' + item.lastName
  }

  get className(): string {
    return `ourTeam-card ${this.showButtons ? 'main-card' : 'main-card'}`
  }
}
</script>
