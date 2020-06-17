<template>
  <div class="p-4 slide-up-reveal">
    <template v-if="!editMode">
      <div v-if="shouldSelectPartner" class="row mb-2">
        <div class="col-md-6">
          <SectionTitle :num="1">{{ $t('getparc.history.col.partyId') }}</SectionTitle>
          <PartnerCombo :value.sync="selectedPartner" include-mailing-lists />
        </div>
      </div>
      <ScopeChoice
        :key="'choice_' + (selectedPartner ? selectedPartner.id : '')"
        :num="scopeIndex"
        :partner="selectedPartner"
        :container-height="containerHeight"
        @scope="onScopeChange"
      >
        <slot name="scopechoice" :partner="selectedPartner"></slot>
      </ScopeChoice>
    </template>

    <div class="mb-4">
      <slot @change="onChange" />
    </div>
    <AlarmInfoBlock
      :num="notifIndex"
      @save="$emit('save', $event)"
      :can-save="canSave"
      :partner="selectedPartner"
      :suspension="suspension"
      :duplicate-from="duplicateFrom"
    />
  </div>
</template>

<script>
import ScopeChoice from './ScopeChoice';
import AlarmInfoBlock from './AlarmInfoBlock';
import SectionTitle from '@/components/SectionTitle';
import PartnerCombo from '@/components/CustomComboxes/PartnerCombo.vue';
import get from 'lodash.get';

export default {
  components: {
    ScopeChoice,
    AlarmInfoBlock,
    PartnerCombo,
    SectionTitle,
  },
  props: {
    alarm: Object,
    duplicateFrom: Object,
    haveForm: Boolean,
    suspension: Boolean,
    checkErrorsFn: {
      type: Function,
      required: false,
    },
    containerHeight: {
      type: String,
      required: false,
    },
  },

  mounted() {
    if (this.duplicateFrom) {
      this.selectedPartner = {
        ...get(this.duplicateFrom, 'party', {}),
        label: get(this.duplicateFrom, 'party.name'),
        data: get(this.duplicateFrom, 'party'),
      };
    }
  },

  data() {
    return {
      selectedPartner: undefined,
      shouldSelectPartner: true,
      lastChosenScope: undefined,
    };
  },

  methods: {
    onScopeChange(scopeChoice) {
      this.lastChosenScope = scopeChoice;
      this.$emit('scope', scopeChoice);
    },
  },

  computed: {
    canSave() {
      let scopeIsValid =
        this.lastChosenScope &&
        (this.lastChosenScope.partner ||
          this.lastChosenScope.searchById ||
          this.lastChosenScope.offer);

      if (this.editMode) {
        scopeIsValid = true;
      }

      let formIsValid = true;
      if (this.checkErrorsFn) {
        formIsValid = this.checkErrorsFn();
      }

      return !!scopeIsValid && !!formIsValid;
    },
    editMode() {
      return this.duplicateFrom && this.duplicateFrom.toModify;
    },
    scopeIndex() {
      if (this.editMode) {
        return 0;
      }
      return this.shouldSelectPartner ? 2 : 1;
    },

    notifIndex() {
      return this.scopeIndex + 1 + (this.haveForm ? 1 : 0);
    },
  },
};
</script>

<style lang="scss" scoped></style>
