<template>
  <v-dialog v-model="filterDialog"
            max-width="450px">
    <template v-slot:activator="{ on, attrs }">
      <v-btn v-bind="attrs" v-on="on"
             class="ma-2" color="green" outlined>
        Фильтр
      </v-btn>
    </template>
    <v-card v-if="filterDialog">
      <v-form>
        <v-card-title>
          <span class="text-h5 text-pre-wrap">Фильтр</span>
        </v-card-title>
        <v-card-subtitle class="pb-2">Выберите отображаемые файлы</v-card-subtitle>

        <v-card-text>
          <v-checkbox class="mt-0"
                      label="Изображения"
                      hide-details/>

          <v-checkbox class="mt-2"
                      label="Файлы"
                      hide-details/>

          <v-checkbox class="mt-2"
                      label="Документы"
                      hide-details/>

          <v-checkbox class="mt-2"
                      label="Только опубликованные"
                      hide-details/>

          <v-checkbox class="mt-2"
                      label="Только используемые"
                      hide-details/>
        </v-card-text>

        <v-card-actions class="pb-3 mx-2">
          <v-btn class="ma-0 pa-0"
                 width="fit-content"
                 height="fit-content"
                 color="primary darken-1"
                 text>
            Сохранить
          </v-btn>
          <v-spacer></v-spacer>

          <v-btn class="ma-0 pa-0"
                 width="fit-content"
                 height="fit-content"
                 color="red darken-1"
                 text>
            Отмена
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import {Vue, Component} from 'vue-property-decorator';

@Component({})
export default class Filter extends Vue {
  filterDialog: boolean = false;
}
</script>
