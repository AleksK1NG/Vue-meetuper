<template>
  <div class="meetup-create-page">
    <AppHero />
    <section class="section">
      <div class="container">
        <MeetupCreateWizard @meetupConfirmed="createMeetup" />
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
  },

  methods: {
    createMeetup(meetupToCreate) {
      this.$store
        .dispatch('createMeetup', meetupToCreate)
        .then(() => {
          this.$toasted.success('Success :)', {
            duration: 5000,
            position: 'top-center'
          });
        })
        .catch(() => {
          this.$toasted.error('Error :(', {
            duration: 5000,
            position: 'top-center'
          });
        });
    }
  }
};
</script>

<style scoped lang="scss">
.meetup-create-page {
  min-height: 100vh;
}
</style>
