<template>
  <div>
    <AppHero />
    <div v-if="!loading" class="container">
      <section class="section">
        <div class="m-b-lg">
          <h1 class="title is-inline">Featured Meetups in "Location"</h1>
          <AppDropdown />
          <router-link
            v-if="user"
            :to="{ name: 'PageMeetupCreate' }"
            class="button is-primary is-pulled-right m-r-sm"
          >
            Create Meetups
          </router-link>
          <router-link
            :to="{ name: 'PageMeetupFind' }"
            class="button is-primary is-pulled-right m-r-sm"
            >All</router-link
          >
        </div>
        <div class="row columns is-multiline">
          <!-- MeetupItem Iterate meetups -->
          <MeetupItem
            v-for="meetup in meetups"
            :key="meetup._id"
            :meetup="meetup"
          />
        </div>
      </section>
      <section class="section">
        <div>
          <h1 class="title">Categories</h1>
          <div class="columns cover is-multiline is-mobile">
            <!-- CategoryItem Category Section -->
            <CategoryItem
              v-for="category in categories"
              :key="category._id"
              :category="category"
            />
          </div>
        </div>
      </section>
    </div>
    <div v-else class="container">
      <AppSpinner />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import CategoryItem from '../components/CategoryItem';
import MeetupItem from '../components/MeetupItem';
export default {
  components: {
    CategoryItem,
    MeetupItem
  },
  data() {
    return {
      isDataLoaded: false
    };
  },
  computed: {
    ...mapGetters([
      'meetups',
      'categories',
      'categoriesLoading',
      'threadsLoding',
      'user'
    ]),
    loading() {
      return this.categoriesLoading && this.threadsLoding;
    }
  },
  created() {
    // console.log(
    //   'page home loading status => ',
    //   this.categoriesLoading,
    //   this.threadsLoding
    // );
    this.$store.dispatch('fetchMeetups');
    this.$store.dispatch('fetchCategories');
  }
};
</script>

<style scoped></style>
