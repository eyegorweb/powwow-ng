<template>
  <div class="card">
    <div class="card-body">
      <div class="d-flex">
        <div class=" flex-grow-1">
          <slot />
        </div>
        <div class="pl-1 to-bottom ">
          <button @click="$emit('validate')" class="btn btn-primary pl-4 pr-4 pt-2 pb-2">
            {{ $t('set') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.to-bottom {
  align-items: flex-end;
  display: flex;
  margin-bottom: 1rem;
}
</style>
