<template>
  <div class="meetup-detail-page">
    <section class="hero">
      <div class="hero-body">
        <div class="container">
          <h2 class="subtitle">
            {{ meetup.startDate | formatDate }}
          </h2>
          <h1 class="title">
            {{ meetup.title }}
          </h1>
          <article class="media v-center">
            <figure class="media-left">
              <p class="image is-64x64">
                <img class="is-rounded" :src="meetupCrearor.avatar" />
              </p>
            </figure>
            <div class="media-content">
              <div class="content">
                <p>
                  Created by <strong>{{ meetupCrearor.name }}</strong>
                </p>
              </div>
            </div>
          </article>
        </div>
        <div class="is-pulled-right">
          <button v-if="isMember" @click="leaveMeetup" class="button is-danger">
            Leave Meetup
          </button>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="container">
        <div class="columns">
          <div class="column is-3">
            <aside class="is-medium menu">
              <div class="meetup-side-box">
                <div class="meetup-side-box-date m-b-sm">
                  <p><b>Date</b></p>
                  <p>{{ meetup.startDate | formatDate }}</p>
                </div>
                <div class="meetup-side-box-date m-b-sm">
                  <p><b>Time</b></p>
                  <span>{{ meetup.timeFrom }}</span> -
                  <span>{{ meetup.timeTo }}</span>
                </div>
                <div class="meetup-side-box-place m-b-sm">
                  <p><b>How to find us</b></p>
                  <p>{{ meetup.location }}</p>
                </div>
                <div class="meetup-side-box-more-info">
                  <p><b>Additional Info</b></p>
                  <p>{{ meetup.shortInfo }}</p>
                </div>
              </div>
              <div class="meetup-side-box-map">
                <img
                  src="https://cnet2.cbsistatic.com/img/H_zPLL8-QTZOLxJvgHQ1Jkz0EgY=/830x467/2013/07/10/f0bcef02-67c2-11e3-a665-14feb5ca9861/maps_routemap.png"
                  class="venueMap-mapImg span--100"
                  alt="Location image of meetup venue"
                />
              </div>
              <!-- Threads Start -->
              <p class="menu-label">
                Threads
              </p>
              <ul>
                <li v-for="thread in orderedThreads" :key="thread._id">
                  {{ thread.title }}
                </li>
              </ul>
              <p class="menu-label">
                Who is Going
              </p>
              <div class="columns is-multiline is-mobile">
                <!-- Joined People Images -->
                <div
                  v-for="person in meetup.joinedPeople"
                  :key="person._id"
                  class="column is-3"
                >
                  <figure class="image is-64x64">
                    <img class="is-rounded" :src="person.avatar" alt="Image" />
                  </figure>
                </div>
              </div>
              <!-- Threads Ends -->
            </aside>
          </div>
          <div class="column is-7 is-offset-1">
            <div class="content is-medium">
              <h3 class="title is-3">About the Meetup</h3>
              <p>
                {{ meetup.description }}
              </p>
              <!-- Join Meetup -->
              <button
                v-if="canJoin"
                @click="joinMeetup"
                class="button is-primary"
              >
                Join In
              </button>
              <button
                v-if="!isAuthenticated"
                :disabled="true"
                class="button is-warning"
              >
                You need authenticate in order to join
              </button>
              <ThreadCreateModal
                @threadSubmitted="createThread"
                :btnTitle="`Welcome ${user.username}, Start a new Thread`"
                :title="'Create Thread'"
                v-if="isMember || isMeetupOwner"
              />
            </div>
            <!-- Thread List START -->
            <ThreadList :threads="orderedThreads" :canMakePost="canMakePost" />
            <!-- Thread List END -->
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import ThreadCreateModal from '../components/ThreadCreateModal';
import ThreadList from '../components/ThreadList';
export default {
  name: 'PageMeetupDetail',
  components: {
    ThreadCreateModal,
    ThreadList
  },
  computed: {
    ...mapGetters([
      'meetup',
      'threads',
      'isAuthenticated',
      'isMeetupOwner',
      'isMember',
      'user',
      'orderedThreads'
    ]),

    meetupCrearor() {
      return this.meetup.meetupCreator || {};
    },
    isMeetupOwner() {
      return this.$store.getters['isMeetupOwner'](this.meetupCrearor._id);
    },
    isMember() {
      return this.$store.getters['isMember'](this.meetup._id);
    },
    canJoin() {
      return !this.isMeetupOwner && this.isAuthenticated && !this.isMember;
    },
    canMakePost() {
      return this.isAuthenticated && (this.isMember || this.isMeetupOwner);
    }
  },
  created() {
    this.$store.dispatch('fetchMeetupById', this.$route.params.id);
    this.$store.dispatch('fetchThreads', this.$route.params.id);

    this.$socket.on('meetup/postPublished', (post) => {
      alert(post.text);
      console.log('Socket post.text => ', post);
    });
  },
  methods: {
    joinMeetup() {
      console.log('Join Meetup');
      this.$store
        .dispatch('joinMeetup', this.meetup._id)
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
    },
    leaveMeetup() {
      this.$store
        .dispatch('leaveMeetup', this.meetup._id)
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
    },
    createThread({ title, done }) {
      this.$store
        .dispatch('postThreads', { title, meetupId: this.meetup._id })
        .then(() => {
          this.$toasted.success('Success :)', {
            duration: 5000,
            position: 'top-center'
          });
          done();
        })
        .catch(() => {
          this.$toasted.error('Error :(', {
            duration: 5000,
            position: 'top-center'
          });
          done();
        });
    }
  }
};
</script>

<style scoped lang="scss">
.tag.is-warning {
  opacity: 0.5;
}
.meetup-detail-page {
  background-color: #f5f5f5;
  .mapouter {
    text-align: right;
    height: 500px;
    width: 600px;
  }
  .gmap_canvas {
    overflow: hidden;
    background: none !important;
    height: 500px;
    width: 600px;
  }
  .hero-body {
    background-color: white;
    border: 1px solid rgba(46, 62, 72, 0.12);
    color: white;
    background-image: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)),
      url('https://images.unsplash.com/photo-1531263060782-b024de9b9793?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1650&q=80');
    background-size: cover;
    background-repeat: no-repeat;
    background-attachment: fixed;
    > p,
    h1,
    h2,
    strong {
      color: white;
    }
  }
  .meetup-side-box {
    background-color: white;
    border-radius: 10px;
    font-size: 16px;
    padding: 15px;
  }
}
pre,
.message {
  max-width: 960px;
}
.v-center {
  align-items: center;
}
li {
  margin: 10px;
}
.hero.is-primary {
  background: linear-gradient(to top right, #524ad0 10%, #d099fa);
}
.box {
  box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.2);
}
.box span.icon {
  float: right;
  font-size: 1.7em;
  padding: 2rem 2rem 0 0;
}
.is-large.fab {
  font-size: 7em;
}
.is-large.fas {
  font-size: 5em;
  margin-left: 0.2em;
}
.media-content {
  overflow: hidden;
}
.menu-list li a:hover {
  background: #d9d9d9;
}
.token.number {
  display: inline;
  padding: inherit;
  font-size: inherit;
  line-height: inherit;
  text-align: inherit;
  vertical-align: inherit;
  border-radius: inherit;
  font-weight: inherit;
  white-space: inherit;
  background: inherit;
  margin: inherit;
}
.footer {
  background-color: white;
}
</style>
