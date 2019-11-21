<template>
  <div class="mt-4">
    <div class="row">
      <div class="col-md-9">
        <div class="skeleton-line"></div>
      </div>
    </div>
    <div class="row mb-5">
      <div class="col-md-9">
        <h4>
          <b>GetParc</b>
          - {{ $t('getparc.management-act-detail') }}
          <i class="ic-Info-Icon" />
        </h4>
      </div>
    </div>
    <div class="main-content data-detail-container">
      <div class="overview-container m-3 bg-white">
        <div class="d-flex header">
          <div class="flex-grow-1 mb-3">
            <h4 class="detail-title">{{ $t('getparc.history.details.detailTitle') }}</h4>
          </div>
          <div>
            <div class="skeleton-line"></div>
          </div>
        </div>

        <div class="d-flex">
          <div class="flex-fill">
            <div class="overview-item mr-5">
              <div class="skeleton-line"></div>
            </div>
            <div class="overview-item mr-5">
              <h6>{{ $t('getparc.history.details.massActionDateCreated') }} :</h6>
              <div class="skeleton-line"></div>
            </div>
            <div class="overview-item mr-5">
              <h6>{{ $t('getparc.history.details.massActionDateStarted') }} :</h6>
              <div class="skeleton-line"></div>
            </div>
            <div class="overview-item mr-5">
              <h6>{{ $t('getparc.history.details.massActionDateEnded') }} :</h6>
              <div class="skeleton-line"></div>
            </div>
          </div>

          <div class="flex-fill">
            <div class="overview-item mr-5">
              <h6>{{ $t('getparc.history.details.massActionDetail') }} :</h6>
              <div class="skeleton-line"></div>
            </div>
            <div class="overview-item mr-5">
              <h6>{{ $t('getparc.history.details.name') }} :</h6>
              <div class="skeleton-line"></div>
            </div>
            <div class="overview-item mr-5">
              <h6>{{ $t('getparc.history.details.creator') }} :</h6>
              <div class="skeleton-line"></div>
            </div>
            <div class="overview-item mr-5">
              <h6>{{ $t('getparc.history.details.creatorMail') }} :</h6>
              <div class="skeleton-line"></div>
            </div>
          </div>

          <div class="flex-fill">
            <div class="overview-item">
              <h6>{{ $t('getparc.history.details.quantityTargeted') }} :</h6>
              <div class="skeleton-line"></div>
            </div>
            <div class="overview-item">
              <h6>{{ $t('getparc.history.details.quantityFailed') }} :</h6>
              <div class="skeleton-line"></div>
            </div>
            <div class="overview-item">
              <h6>{{ $t('getparc.history.details.quantityInProgress') }} :</h6>
              <div class="skeleton-line"></div>
            </div>
            <div class="overview-item">
              <h6>{{ $t('getparc.history.details.quantityTerminated') }} :</h6>
              <div class="skeleton-line"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
$fontSize: 0.8rem;
.main-content {
  padding-bottom: 4vh;
}

.data-detail-container {
  $loader-size: 1.5em;
  $check-height: $loader-size/2;
  $check-width: $check-height/2;
  $check-left: $loader-size/6;
  $check-thickness: 2px;
  $check-color: $success;

  .overview-container {
    padding: 1rem 2rem;
    .detail-title {
      text-transform: uppercase;
      font-size: 1rem;
      line-height: 3rem;
      font-weight: 600;
    }
    .overview-item {
      padding: 7px 10px 7px 0;
      border-bottom: 1px dashed $medium-gray;
      &:first-child {
        // border-bottom: none;
      }
      &:last-child {
        border-bottom: none;
      }

      h4 {
        font-size: 0.875rem;
      }

      h6 {
        color: $gray-680;
        font-size: $fontSize;
        font-weight: 500;
      }

      p {
        font-size: $fontSize;
        margin: 0;
      }

      div {
        font-size: $fontSize;
      }
    }
  }

  .circle-loader {
    border: 3px solid rgba(0, 0, 0, 0.2);
    border-left-color: $secondary;
    position: relative;
    display: inline-block;
    vertical-align: top;
    border-radius: 50%;
    width: $loader-size;
    height: $loader-size;
  }
  .cross-loader {
    position: relative;
    display: inline-block;
    vertical-align: top;
    border-radius: 50%;
    width: 1.5em;
    height: 1.5em;
    position: absolute;
    right: 20px;
  }

  .load-complete {
    border-color: $check-color;
    background-color: transparent;
    border-width: 1px;
    transition: border 500ms ease-out;
  }

  .checkmark {
    display: none;

    &.checked {
      display: block;
    }
    &:after {
      opacity: 1;
      height: $check-height;
      width: $check-width;
      transform-origin: left top;
      border-right: $check-thickness solid $success;
      border-top: $check-thickness solid $success;
      content: '';
      left: $check-left;
      top: $check-height;
      position: absolute;
      transform: scaleX(-1) rotate(135deg);
    }
  }

  .cross {
    $cross-size: $loader-size / 2;

    height: $cross-size;
    width: $cross-size;
    position: absolute;
    right: 0;
    font-size: 24px;
    margin: -0.5rem 0 0 0;

    &:before,
    &:after {
      position: absolute;
      left: 0.55rem;
      top: $cross-size / 2;
      content: ' ';
      height: $cross-size;
      width: 2px;
      background-color: $success;
    }
    &:before {
      transform: rotate(45deg);
    }
    &:after {
      transform: rotate(-45deg);
    }
  }
}
</style>
