<template>
  <form class="post-create">
    <div class="field">
      <textarea
        v-auto-expand
        v-model="text"
        class="textarea textarea-post"
        placeholder="Write a post"
        rows="1"
      ></textarea>
      <button
        @click.prevent="sendPost"
        :disabled="!text"
        class="button is-primary m-t-sm"
      >
        Send
      </button>
    </div>
  </form>
</template>

<script>
import { mapGetters } from 'vuex';
import autoExpand from '../directives/autoExpand';
export default {
  name: 'PostCreate',
  directives: { autoExpand },
  props: {
    threadId: {
      required: true,
      type: String
    }
  },
  data() {
    return {
      text: null
    };
  },
  computed: {
    ...mapGetters(['meetup'])
  },
  methods: {
    sendPost() {
      this.$store
        .dispatch('sendPost', {
          text: this.text,
          threadId: this.threadId
        })
        .then((createdPost) => {
          this.$toasted.success('Success :)', {
            duration: 5000,
            position: 'top-center'
          });
          this.$socket.emit('meetup/postSaved', {
            ...createdPost,
            meetup: this.meetup._id
          });
          this.text = '';
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
.textarea-post {
  padding-bottom: 30px;
}
.post-create {
  margin-bottom: 15px;
}
</style>
