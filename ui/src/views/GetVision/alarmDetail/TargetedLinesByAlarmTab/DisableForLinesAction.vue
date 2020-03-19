<template>
  <div class="card mt-4">
    <div class="card-body">
      <div class="row">
        <div class="col-7">
          <div>
            <button class="btn btn-primary pl-4 pr-4 pt-2 pb-2" @click="disableLines">
              <i class="ic-Minus-Icon" />
              {{ $t('getvsion.alarm.disable_alarm_lines') }}
            </button>
          </div>
          <div class="text-info">{{ rows.length }} lignes seront exclues de l'alarme</div>
        </div>
        <div class="col-5">
          <div class="text-info">
            <span>
              <i class="ic-Alert-Icon"></i>Les lignes retirées de l’alarme seront accessibles dans
              l’onglet « Lignes exclues de l’alarme ».
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
