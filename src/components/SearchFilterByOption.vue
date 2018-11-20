<template>


  <div class="input-group mb-3">
    <div class="input-group-prepend">
      <span class="input-group-text ic-Info-Icon" />
    </div>
    <input
      type="text"
      class="form-control"
      id=""
      placeholder="Rechercher une carte par identifiant"
      v-model="modelInputValue"
      aria-label="Rechercher une carte par identifiant"
    >
    <div class="input-group-append">
      <span class="input-group-text">
        <select
          class="form-control"
          id=""
          v-model="modelSelect"
        >
          <option
            :value="null"
          >
            Type
          </option>
          <option
            v-for="option in options"
            :key="option.code"
            :value="option"
          >
            {{ option.label }}
          </option>
        </select>
        <span
          class="ic-Arrow-Down-Icon"
        />
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SearchFilterByOption',
  props: {
    options: {
      type: Array,
    },
    selectedOption: {
      type: Object,
    },
    inputValue: {
      type: String,
    },
    result: {
      type: Object,
    },
  },
  data() {
    return {
      tmpSelectedOption: undefined,
      tmpSelectedInput: undefined,
    };
  },
  computed: {
    modelSelect: {
      get() {
        return this.selectedOption;
      },
      set(newOption) {
        this.tmpSelectedOption = newOption;
        this.$emit('update:result', {
          inputValue: this.tmpSelectedInput,
          options: newOption,
        });
      },
    },
    modelInputValue: {
      get() {
        return this.inputValue;
      },
      set(newValue) {
        this.tmpSelectedInput = newValue;
        this.$emit('update:result', {
          inputValue: newValue,
          options: this.tmpSelectedOption,
        });
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.input-group {
  background: #e9ecef;
  padding: 6px;
}
input {
  height: auto;
}
.input-group-prepend {
  border-top: 1px solid rgba(0, 0, 0, 0.125);
  border-bottom: 1px solid rgba(0, 0, 0, 0.125);
  border-left: 1px solid rgba(0, 0, 0, 0.125);
}
input.form-control {
  border-top: 1px solid rgba(0, 0, 0, 0.125);
  border-bottom: 1px solid rgba(0, 0, 0, 0.125);
}
.input-group-append {
  border-top: 1px solid rgba(0, 0, 0, 0.125);
  border-bottom: 1px solid rgba(0, 0, 0, 0.125);
  border-right: 1px solid rgba(0, 0, 0, 0.125);
}

.input-group-prepend,
.input-group-append,
input.form-control {
  margin: 5px 0;
}

select {
  box-shadow: none;
  background-image: none;
  -webkit-appearance: none;
}

input,
span,
select {
  border: none;
  background-image: none;
}
select,
option {
  background-color: #e9ecef;
}
.ic-Info-Icon {
  background-color: white;
}
input.form-control:focus {
  background-color: white;
  box-shadow: none;
}
select.form-control:focus {
  background-color: transparent;
  box-shadow: none;
}
</style>
