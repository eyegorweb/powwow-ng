<template>
  <div>
    <h4 class="text-primary text-uppercase">
      Historique des demandes de test Réseau / Localisation
    </h4>
    <div class="row">
      <div class="col-5">
        <div class="bg-white p-2">
          <SimpleMap />
        </div>
      </div>
      <div class="col-7">
        <table class="table table-blue mt-1">
          <thead>
            <tr>
              <th>Date de la demande</th>
              <th>Statut de la demande</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="mock-value">10/11/2019 00:00:00</td>
              <td>
                <div class="d-flex">
                  <div>
                    <CheckMarkText>
                      <template>
                        <ul class="list-unstyled mock-value">
                          <li class="font-weight-bold">Terminé</li>
                          <li class="position">Lat.: 48.00088 - Lon.: 5044.11</li>
                        </ul>
                      </template>
                    </CheckMarkText>
                  </div>
                  <div>
                    <button class="btn link-btn p-0 find-line-button font-weight-bold">
                      Localiser sur la carte
                    </button>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="row">
          <div class="col-2"></div>
          <div class="col-10">
            <div class="row">
              <div class="col">
                <button class="btn btn-block btn-outline-primary">Rafraîchir</button>
              </div>
              <div class="col">
                <button class="btn btn-block btn-primary">Faire une nouvelle demande</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SimpleMap from '@/components/SimpleMap';
import CheckMarkText from '@/components/CheckMarkText';

export default {
  components: {
    SimpleMap,
    CheckMarkText,
  },
};
</script>

<style lang="scss" scoped>
.position {
  color: $gray;
}

.find-line-button {
  color: $primary !important;
}
</style>
