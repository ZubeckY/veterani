<template>
  <v-autocomplete v-model="selected"
                  :disabled="disabled"
                  :multiple="multiple"
                  class="mx-3"
                  label="Выберите пользователя"
                  item-text="firstName"
                  item-value="id"
                  outlined dense chips
                  :items="users">
    <template v-slot:selection="data">
      <v-chip v-bind="data.attrs"
              :disabled="disabled"
              :input-value="data.selected"
              @click:close="remove(data.item)"
              @click="data.select"
              :close="!disabled" small>
        <v-avatar left>
          <v-img v-if="userImage(data.item)" :src="userImage(data.item)"></v-img>
          <v-icon v-else>mdi-account-circle</v-icon>
        </v-avatar>
        {{ userFullName(data.item) }}
      </v-chip>
    </template>
    <template v-slot:item="data">
      <template v-if="typeof data.item !== 'object'">
        <v-list-item-content v-text="data.item"></v-list-item-content>
      </template>
      <template v-else>
        <v-avatar left>
          <v-img v-if="data.item.avatar" :src="data.item.avatar"></v-img>
          <v-icon v-else>mdi-account-circle</v-icon>
        </v-avatar>
        <v-list-item-content>
          <v-list-item-title v-html="userFullName(data.item)"></v-list-item-title>
          <v-list-item-subtitle v-html="data.item.role"></v-list-item-subtitle>
        </v-list-item-content>
      </template>
    </template>
  </v-autocomplete>
</template>

<script lang="ts">
import {Vue, Component, Prop, VModel} from 'vue-property-decorator';

@Component({})
export default class selectUser extends Vue {
  @VModel({default: []}) selected!: any
  @Prop({default: false}) multiple?: boolean;
  @Prop({default: false}) disabled?: boolean;
  @Prop() users: any;

  userFullName(user: any): string {
    return user.firstName + ' ' + user.lastName
  }

  userImage(user: any) {
    const image = user.file?.path
    return image ? '/api/' + image : null
  }

  remove(item: any) {
    if (this.multiple) {
      const index = this.selected.indexOf(item.name)
      if (index >= 0)
        return this.selected.splice(index, 1)
    } else {
      return this.selected = {}
    }
  }
}
</script>
