<template>
  <header class="header">
    <div class="header-container d-flex align-center white--text mx-auto px-4 py-2 ma-0">
      <div class="header-logo cursor-pointer" @click="$router.push('/')">
        <v-img class="d-block"
               lazy-src="/logo.png"
               src="/logo.png"
               width="120px"
               height="80px"/>
      </div>

      <v-spacer/>

      <v-btn class="header-link text-none pa-0"
             @click="$router.push('/#about-us')"
             width="fit-content"
             height="fit-content"
             min-width="unset"
             min-height="unset"
             color="white" text>
        О нас
      </v-btn>

      <v-btn class="header-link text-none pa-0"
             @click="$router.push('/blog')"
             width="fit-content"
             height="fit-content"
             min-width="unset"
             min-height="unset"
             color="white" text>
        Новости
      </v-btn>

      <v-btn class="header-link text-none pa-0"
             @click="$router.push('/docs')"
             width="fit-content"
             height="fit-content"
             min-width="unset"
             min-height="unset"
             color="white" text>
        Документы
      </v-btn>

      <v-btn class="header-link text-none pa-0"
             @click="$router.push('/lk')"
             width="fit-content"
             height="fit-content"
             min-width="unset"
             min-height="unset"
             color="white" text>
        <v-icon v-if="userName" class="mr-2">mdi-account</v-icon>
        <span v-text="buttonLkText"></span>
      </v-btn>
    </div>
  </header>
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';

@Component({})
export default class Header extends Vue {
  @Prop() user!: any;

  get userName(): string | null {
    if (!this.user.firstName) {
      return null;
    }

    return this.user.firstName + ' ' + this.user.lastName;
  }

  get buttonLkText() {
    return this.userName ?? 'Личный кабинет'
  }
}
</script>
