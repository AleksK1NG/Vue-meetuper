<template>
  <div class="meetup-create-form">
    <div class="current-step is-pulled-right">
      {{ currentStep }} of {{ allStepsCount }}
    </div>
    <!-- Form Steps -->
    <keep-alive>
      <component
        :is="currentComponent"
        @stepUpdated="mergeStepData"
        ref="currentComponent"
        :meetupToCreate="form"
      />
    </keep-alive>

    <progress class="progress" :value="currentProgress" max="100"
      >{{ currentProgress }} %</progress
    >
    <div class="controll-btns m-b-md">
      <button
        v-if="currentStep !== 1"
        class="button is-primary m-r-sm"
        @click="moveToPrevStep"
      >
        Back
      </button>
      <button
        v-if="currentStep !== allFormStepsCount"
        class="button is-primary"
        @click="moveToNextStep"
        :disabled="!canProceed"
      >
        Next
      </button>
      <!-- Confirm Data -->
      <button v-else class="button is-primary" @click="emitMeetupConfirm">Confirm</button>
    </div>
  </div>
</template>

<script>
import MeetupLocation from './MeetupLocation';
import MeetupDetail from './MeetupDetail';
import MeetupDescription from './MeetupDescription';
import MeetupConfirmation from './MeetupConfirmation';
export default {
  name: 'MeetupCreateWizard',
  components: {
    MeetupLocation,
    MeetupDetail,
    MeetupDescription,
    MeetupConfirmation
  },
  data() {
    return {
      form: {
        location: null,
        title: null,
        startDate: null,
        category: null,
        image: null,
        shortInfo: null,
        description: null,
        timeTo: null,
        timeFrom: null
      },
      currentStep: 1,
      allStepsCount: 4,
      canProceed: false,
      formSteps: [
        'MeetupLocation',
        'MeetupDetail',
        'MeetupDescription',
        'MeetupConfirmation'
      ]
    };
  },
  computed: {
    currentProgress() {
      return (100 / this.allStepsCount) * this.currentStep;
    },
    allFormStepsCount() {
      return this.formSteps.length;
    },
    currentComponent() {
      return this.formSteps[this.currentStep - 1];
    }
  },
  methods: {
    moveToNextStep() {
      if (this.currentStep < 4) {
        this.currentStep++;
      }
      // Fix allowed next with empty fields, alternative way of use created(){}
      // https://vuejs.org/v2/api/#Vue-nextTick
      // Defer the callback to be executed after the next DOM update cycle.
      this.$nextTick(() => {
        this.canProceed = !this.$refs['currentComponent'].$v.$invalid;
      });
    },
    moveToPrevStep() {
      if (this.currentStep > 1) {
        this.currentStep--;
      }
      this.canProceed = true;
    },
    mergeStepData(step) {
      this.form = { ...this.form, ...step.data };
      this.canProceed = step.isValid;
    },
    emitMeetupConfirm() {
      this.$emit('meetupConfirmed', this.form)
    }
  }
};
</script>

<style scoped>
.meetup-create-form {
  box-sizing: border-box;
  margin-left: auto;
  margin-right: auto;
  max-width: 840px;
  padding: 24px 16px 8px;
  width: 100%;
}
</style>
