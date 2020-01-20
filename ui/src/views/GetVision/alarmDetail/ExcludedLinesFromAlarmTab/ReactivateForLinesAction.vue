<template>
  <div class="card">
    <div class="card-body">
      <div class="row">
        <div class="col-7">
          <div>
            <button class="btn btn-primary pl-4 pr-4 pt-2 pb-2" @click="disableLines">
              <i class="ic-Plus-Icon" />
              {{ $t('getvsion.alarm.react_alarm_lines') }}
            </button>
          </div>
          <div class="text-info">{{ total }} lignes ciblées par l'alarme</div>
        </div>
        <div class="col-5">
          <div class="text-warning">
            <span>
              <i class="ic-Alert-Icon"></i>Les alarmes de sur-consommation déjà activées.. (ceci est
              un exemple)
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    alarm: Object,
    total: Number,
    rows: Array,
    filters: Array,
  },

  methods: {
    disableLines() {
      console.log('Disable lines here');
    },
  },
};
</script>

<style lang="scss" scoped></style>
