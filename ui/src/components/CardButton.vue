<template>
  <div class="addNew" :class="{ disabled: disabled }" @click="$emit('click')">
    <div class="addNew-logo">
      <i class="icon ic-User-Icon"></i>
    </div>
    <div><slot /></div>
  </div>
</template>

<script>
export default {
  props: {
    disabled: Boolean,
  },
};
</script>

<style lang="scss" scoped>
.addNew {
  width: 49%;
  height: 220px;
  border-radius: 5px;
  font-size: 14px;
  padding: 30px 20px;
  border: #dddddd solid 1px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 600;
  flex-direction: column;
  cursor: pointer;

  &-logo {
    width: 50px;
    height: 50px;
    background-color: #009dcc;
    border-radius: 100px;
    margin-bottom: 10px;
    display: flex;
    justify-content: center;
    align-items: center;

    i {
      color: white;
    }
  }

  &.disabled {
    .addNew-logo {
      opacity: 40%;
    }
  }
}
</style>
