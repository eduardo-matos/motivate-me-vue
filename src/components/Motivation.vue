<template>
  <div style="height: 2000px">
    <h1 v-if="title">{{ title }}</h1>

    <input class="max-items" v-model="maxItems" placeholder="Max items to be fetched" />

    <ul class="quotes" v-if="quotes && quotes.length">
      <li class="quote" v-for="quote in quotes" :key="quote.id">
        <blockquote>{{ quote.text }}</blockquote>
      </li>
    </ul>

    <button class="load-more" @click="loadMore">Load More</button>
  </div>
</template>

<script>
import axios from 'axios'
import scroll from '@/components/scroll';

export default {
  props: ['title', 'items'],
  data() {
    return {
      quotes: this.items || [],
      uid: Math.random().toString().substring(2),
      maxItems: 10,
    };
  },
  mounted() {
    scroll.start();
    this.removeScrollListener = scroll.on('bottom', this.onBottom.bind(this));
  },
  beforeDestroy() {
    this.removeScrollListener();
  },
  methods: {
    loadMore() {
      axios.get('/my-server', { params: { max: parseInt(this.maxItems) } }).then(response => {
        this.quotes.push(...response.data);
      });
    },
    onBottom() {
      this.loadMore();
    },
  },
}
</script>