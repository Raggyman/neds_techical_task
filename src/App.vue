<template>
  <div id="app">
    <v-layout row style="width: 50%;">
      <v-flex md2></v-flex>
      <div v-for="category in raceCategories" :key="category.category">
        <v-flex
          md3
          style="padding: 10px;"
          v-on:click="addToCategoryFilter(category.categoryId)"
          :class="{
            active: filterCategoryList.includes(category.categoryId),
          }"
        >
          <img height="30px" :src="iconForRace(category.categoryId).imageUrl" />
        </v-flex>
      </div>
    </v-layout>

    <div v-for="(race, index) in orderByTimeRaces" :key="race.id">
      <div
        v-if="
          checkRaceDisplay(race.advertised_start.seconds, race.category_id) &&
            index <= 4
        "
      >
        <v-layout row style="width: 50%;">
          <v-flex md2></v-flex>
          <v-flex md1 class="text-top">
            <img height="40px" :src="iconForRace(race.category_id).imageUrl" />
          </v-flex>
          <v-flex md1
            ><b>R{{ race.race_number }} </b></v-flex
          >
          <v-flex md3>
            <p class="text-left text-uppercase">
              {{ race.meeting_name }}
            </p>
          </v-flex>
          <v-flex md3> </v-flex>
          <v-flex md2>
            {{ getFormatedCountDownTime(race.advertised_start.seconds) }}
            <!-- {{ race.advertised_start.seconds - referenceTime - countdownTimer }} -->
          </v-flex>
        </v-layout>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import store from "@/store";
import _ from "lodash";

@Component({
  components: {},
})
export default class App extends Vue {
  public referenceTime: number = Math.floor(Date.now() / 1000);
  public countdownTimer = 0;
  public lastFiredRequest = 0;
  public filterCategoryList = [];

  // When the application loads, we want to obtain the latest nextRace data.
  public async created() {
    this.lastFiredRequest = Math.floor(Date.now() / 1000);
    this.$store.commit("getNextRaces");
  }
  public async mounted() {
    this.startTimer();
  }

  // Supporting Functions

  public raceCategories = [
    {
      name: "Greyhound Racing",
      categoryId: "9daef0d7-bf3c-4f50-921d-8e818c60fe61",
      imageUrl: "https://www.neds.com.au/images/icons/racing/greyhound.svg",
    },
    {
      name: "Harness Racing",
      categoryId: "161d9be2-e909-4326-8c2c-35ed71fb460b",
      imageUrl: "https://www.neds.com.au/images/icons/racing/harness.svg",
    },
    {
      name: "Horse Racing",
      categoryId: "4a2788f8-e825-4d36-9894-efd4baf1cfae",
      imageUrl: "https://www.neds.com.au/images/icons/racing/horse-racing.svg",
    },
  ];

  //  This function adds a race category to the filter.
  public addToCategoryFilter(categoryId: string) {
    const index = this.filterCategoryList.indexOf(categoryId);
    if (index > -1) {
      this.filterCategoryList.splice(index, 1);
    } else {
      this.filterCategoryList.push(categoryId);
    }
  }

  // This is a check to see if the current race has expired.
  // If the race has expired, then we should make a request for
  // and updated Next Race details.
  // We also have to ensure that we don't fire multiple requests for data if we have
  // more than one race expire at the same time.
  @Watch("orderByTimeRaces", { deep: true })
  public checkRaceDisplay(advertisedStart: number, categoryId: string) {
    if (advertisedStart - this.referenceTime - this.countdownTimer > -60) {
      // Check if filter applies
      if (this.filterCategoryList.length > 0) {
        return this.filterCategoryList.includes(categoryId);
      } else {
        return true;
      }
    } else {
      if (Math.floor(Date.now() / 1000) - this.lastFiredRequest >= 10) {
        this.lastFiredRequest = Math.floor(Date.now() / 1000);
        this.$store.commit("getNextRaces");
      }
    }
  }

  // Format the count down timer
  public getFormatedCountDownTime(advertisedStart: number) {
    const secondsToCovert =
      advertisedStart - this.referenceTime - this.countdownTimer;
    const hours = ~~(secondsToCovert / 3600);
    const minutes = ~~((secondsToCovert % 3600) / 60);
    const seconds = ~~(secondsToCovert % 60);
    let convertedTime = "";
    if (secondsToCovert > 0) {
      if (hours > 0) {
        convertedTime += "" + hours + "h " + (minutes < 10 ? "0" : "");
      }
      convertedTime += "" + minutes + "m " + (seconds < 10 ? "0" : "");
      convertedTime += "" + seconds + "s ";
    } else {
      convertedTime += "" + seconds + "s ";
    }
    return convertedTime;
  }

  // This orders the race by time
  get orderByTimeRaces() {
    return _.orderBy(
      store.state.nextRaces.race_summaries,
      "advertised_start.seconds"
    );
  }

  // This pulls from the list of caterogries the associated icon for the race
  public iconForRace(categoryId: string) {
    return this.raceCategories.find(
      (category) => category.categoryId == categoryId
    );
  }

  // This is used to allow the binding for the display
  public startTimer() {
    this.countdownTimer = setInterval(() => (this.countdownTimer += 1), 1000);
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.active {
  background-color: coral;
  width: 100%;
}
</style>
