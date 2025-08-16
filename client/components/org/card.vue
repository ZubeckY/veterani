<template>
  <article class="ourTeam-card">
    <div class="ourTeam-card__container">
      <div class="ourTeam-card__head">
        <v-img class="ourTeam-card__image"
               width="calc(100% - 10px)"
               :src="userImage"/>
        <div class="ourTeam-card__button" v-if="showButtons">
          <menu-button :menu="menu" :dark="false"
                       @editItem="createEvent('editItem')"
                       @deleteItem="createEvent('deleteItem')"/>
        </div>
      </div>
      <div class="ourTeam-card__body">
        <v-card-text class="ourTeam-card__name"
                     v-text="fullName(item)"/>
        
        <v-card-text class="ourTeam-card__memberLabel"
                     v-text="item.memberRoleTitle"/>
      </div>
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

  get userImage() {
    const image = this.item.file?.path
    return image ? '/api/' + image : '/placeholder_lk.jpg'
  }
}
</script>
