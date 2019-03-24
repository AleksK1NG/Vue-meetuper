<template>
  <div class="meetup-create-page">
    <AppHero />
    <section class="section">
      <div class="container">
        <MeetupCreateWizard />
      </div>
    </section>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import MeetupCreateWizard from '../components/MeetupCreate/MeetupCreateWizard';

export default {
  name: 'PageMeetupCreate',
  components: {
    MeetupCreateWizard
  },
  computed: {
    ...mapGetters(['categories'])
  },
  created() {
    console.log('categories => ', this.categories);
    if (this.categories.length === 0) {
      this.$store.dispatch('fetchCategories');
    }
  }
};
</script>

<style scoped lang="scss">
.meetup-create-page {
  min-height: 100vh;
}
</style>
