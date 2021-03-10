<template>
  <!--
  <div class="d-flex justify-end mx-2 my-2 my-pagination">
-->
  <div class="my-pagination my-2">
    <v-row>
      <v-col cols="12" md="8" class="text-center">
        <v-pagination
          v-model="$_page"
          :length="$_pageCount"
          :total-visible="totalVisible"
        ></v-pagination>
      </v-col>

      <v-col cols="12" md="4" class="d-flex justify-end">
        <span class="pt-2 ml-2">
          {{ startItem }}-{{ endItem }} / {{ itemsLength }}
        </span>
        <span class="pt-2 ml-2">表示数</span>
        <v-select
          :items="itemsPerPageOptions"
          :value="itemsPerPage"
          @input="$emit('update:items-per-page', $event)"
          :menu-props="{contentClass: 'my-pagination-select__content'}"
          class="ml-2"
        ></v-select>
      </v-col>
    </v-row>
  </div>
</template>

<style lang="scss">
$pg-font-size: 0.75rem;

.my-pagination {
  font-size: $pg-font-size;
  .v-pagination {
    justify-content: start;
    &__navigation {
      font-size: $pg-font-size;
      height: 24px;
      width: 24px;
      padding: 0 0;
      margin: 0.3rem 2px;
      border-radius: 0;
    }
    &__item {
      font-size: $pg-font-size;
      padding: 0 0;
      margin: 0.1rem;
      height: 24px;
      min-width: 24px;
      border-radius: 0;
    }
    &__more {
      height: 24px;
      width: 24px;
    }
  }
  .v-select {
    max-width: 60px;
    font-size: $pg-font-size;
    padding-top: 0;
    margin-top: 0;
    &__selection {
      font-size: $pg-font-size;
    }
  }
}

@media screen and (max-width: 768px) {
  .my-pagination {
    .v-select {
      max-width: 60px;
    }
  }
}

.my-pagination-select__content {
  .v-list-item {
    min-height: 24px;
    &__content {
      padding: 4px 0;
    }
    &__title {
      font-size: $pg-font-size;
    }
  }
}
</style>

<script>
export default {
  name: 'Pagination',
  props: {
    page: {
      type: Number,
      default: 1,
      required: true,
    },
    pageCount: {
      type: Number,
      default: 0,
      required: true,
    },
    totalVisible: {
      type: Number,
      default: 7,
    },
    itemsPerPage: {
      type: Number,
      default: 10,
    },
    itemsLength: {
      type: Number,
      default: 0,
    },
    itemsPerPageOptions: {
      type: Array,
      default: () => [10, 20, 50],
    },
  },
  computed: {
    $_page: {
      get() {
        return this.page
      },
      set(value) {
        this.$emit('update:page', parseInt(value))
      },
    },
    $_pageCount: {
      get() {
        return this.pageCount
      },
      set(value) {
        this.$emit('update:page-count', value)
      },
    },
    startItem() {
      return this.itemsPerPage * (this.page - 1) + 1
    },
    endItem() {
      return Math.min(this.itemsPerPage * this.page, this.itemsLength)
    },
  },
  mounted() {
    // console.log(`${this.itemsPerPageOptions}-${this.pgItemsPerPageOptions}`)
  },
}
</script>
