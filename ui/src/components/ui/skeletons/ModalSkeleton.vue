<template>
  <div>
    <div class="row">
      <div class="col-md-12">
        <h2 class="text-gray font-weight-light" style="font-size: 2rem">
          <button class="modal-default-button btn btn-light btn-sm ml-1" disabled v-if="isLoading">
            {{ $t('processing') }}...
            <CircleLoader />
          </button>
        </h2>
      </div>
    </div>
  </div>
</template>

<script>
import CircleLoader from '@/components/ui/CircleLoader';

export default {
  components: {
    CircleLoader,
  },
  props: {
    isLoading: Boolean,
  },
};
</script>

<style lang="scss" scoped></style>
