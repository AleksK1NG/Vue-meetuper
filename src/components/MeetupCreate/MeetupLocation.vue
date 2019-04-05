<template>
  <div>
    <h1 class="title m-b-sm">What's your new Meetup location?</h1>
    <div class="m-b-lg">
      <span v-if="location && !wantChangeLocation" class="subtitle">{{
        location
      }}</span>
      <a @click="toggleLocation" v-if="location && !wantChangeLocation"
        >(change location)</a
      >
      <a @click="toggleLocation" v-if="location && wantChangeLocation"
        >(Set Default location)</a
      >
      <input
        v-if="!location || wantChangeLocation"
        @input="emitFormData"
        @blur="$v.form.location.$touch()"
        v-model="form.location"
        type="text"
        class="input"
      />
      <div v-if="$v.form.location.$error">
        <span v-if="!$v.form.location.required" class="help is-danger"
          >Location is required</span
        >
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { required } from 'vuelidate/lib/validators';
export default {
  name: 'MeetupLocation',
  data() {
    return {
      wantChangeLocation: false,
      form: {
        location: null
      }
    };
  },
  computed: {
    ...mapGetters(['location'])
  },
  validations: {
    form: {
      location: { required }
    }
  },
  created() {
    if (this.location) {
      this.form.location = this.location;
      this.emitFormData();
    }
  },
  methods: {
    emitFormData() {
      this.$emit('stepUpdated', {
        data: this.form,
        isValid: !this.$v.$invalid
      });
    },
    toggleLocation() {
      if (this.location) {
        this.form.location = this.location;
        this.emitFormData();
      }
      this.wantChangeLocation = !this.wantChangeLocation;
    }
  }
};
</script>

<style scoped></style>
