<template>
  <div class="card mt-4">
    <div class="card-body">
      <div class="row">
        <div class="col-7">
          <slot name="form" :firstAttemptAction="firstAttemptAction" />
        </div>
        <div class="col-5">
          <slot name="messages" />

          <div class="mt-4" v-if="requestErrors && requestErrors.length">
            <h6 class="text-danger">{{ $t('errors.all') }}</h6>
            <ul class="text-danger list-unstyled">
              <li v-for="error in requestErrors" :key="error.message">
                <template v-if="$loGet(error, 'extensions.error') === 'ALARM_SET_LIMIT'">
                  <span
                    v-html="
                      $t('getparc.lineDetail.alarms.limiterror', {
                        limit: $loGet(error, 'extensions.limit'),
                      })
                    "
                  ></span>
                </template>
                <template v-else>
                  {{ error.message }}
                </template>
              </li>
            </ul>
          </div>

          <button
            v-if="shouldDoubleValidate"
            class="btn btn-success pl-4 pr-4 pt-2 pb-2 mt-2"
            @click="secondAttemptAction"
          >
            <em class="ic-Minus-Icon" />
            {{ $t('confirm') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
  props: {
    apiConfig: Object,
  },

  data() {
    return {
      requestErrors: undefined,
      shouldDoubleValidate: false,
      tempDataUuid: undefined,
    };
  },
  methods: {
    ...mapMutations(['flashMessage', 'confirmAction']),

    resetState() {
      this.requestErrors = undefined;
      this.shouldDoubleValidate = false;
      this.tempDataUuid = undefined;
    },

    async secondAttemptAction() {
      const response = await this.apiConfig.apiFn({
        ...this.apiConfig.params,
        tempDataUuid: this.tempDataUuid,
      });

      if (response.errors && response.errors.length) {
        this.formatErrors(response.errors);
      } else {
        this.flashMessage({ level: 'success', message: this.$t('genericSuccessMessage') });
        this.resetState();
        this.$emit('success');
      }
    },

    formatErrors(errors) {
      this.requestErrors = errors.map((e) => {
        return {
          message: e.message,
          extensions: e.extensions,
        };
      });
    },

    firstAttemptAction() {
      this.confirmAction({
        message: 'confirmAction',
        actionFn: async () => {
          this.doAction();
        },
      });
    },

    async doAction() {
      const response = await this.apiConfig.apiFn(this.apiConfig.params);

      if (response && response.errors && response.errors.length) {
        this.formatErrors(response.errors);
        if (response.validated > 0) {
          this.shouldDoubleValidate = true;
          this.tempDataUuid = response.tempDataUuid;
        }
      } else {
        this.flashMessage({ level: 'success', message: this.$t('genericSuccessMessage') });
        this.resetState();
        this.$emit('success');
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
