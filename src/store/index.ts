import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    nextRaces: {},
  },
  mutations: {
    getNextRaces(state) {
      // eslint-disable-next-line no-unused-vars
      console.log("Getting Next Races");
      axios
        .get(
          "https://api.neds.com.au/rest/v1/racing/?method=nextraces&count=10"
        )
        .then((response) => {
          state.nextRaces = response.data.data;
        });
    },
  },
  actions: {},
  modules: {},
});
