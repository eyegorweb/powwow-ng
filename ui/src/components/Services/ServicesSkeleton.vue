<template>
  <div class="row">
    <div class="col-md-8">
      <div class="s-container">
        <div :key="service.code" v-for="service in otherServices" class="service">
          <div class="skeleton-line"></div>
        </div>
      </div>
    </div>
    <div class="col-md-4">
      <div class="skeleton-line"></div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      otherServices: [
        { code: 's1' },
        { code: '2' },
        { code: '3' },
        { code: '4' },
        { code: '5' },
        { code: '6' },
        { code: 's71' },
        { code: '8' },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
.s-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.service {
  flex-basis: 45%;
  margin-bottom: 1.5rem;
}

@media screen and (max-width: 1366px) {
  .services-container {
    width: 100% !important;
  }
}

.toggle {
  max-width: 220px;
}
.services-container {
  display: flex;
  flex-wrap: wrap;
  width: 80%;
  margin: auto;
  .single-service {
    flex-basis: 50%;
  }
}

@media screen and (max-width: 1366px) {
  .services-container {
    width: 100% !important;
  }
}

.services-container {
  display: flex;
  flex-wrap: wrap;
  width: 80%;
  margin: auto;
  .single-service {
    flex-basis: 50%;
  }
}

.apn-container {
  display: flex;
  flex-direction: row;
  span {
    flex-grow: 0;
  }
  .card {
    max-width: 210px;
    flex-grow: 1;
    margin-left: 10px;
  }
}
</style>
