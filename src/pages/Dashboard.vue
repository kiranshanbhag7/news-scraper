<template>
  <div>
    <div class="news-block">
      <div class="website-card" v-if="newsList" v-for="(news, nIndex) in newsList" :key="nIndex">
        <div class="news-header">{{news.name}}</div>
        <div class="news-item" v-if="news.items" v-for="(item, iIndex) in news.items" :key="iIndex">
          <a class="name" :href="item.link" target="_blank">{{item.name}}</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'dashboard',
  data() {
    return {
      newsList: []
    }
  },
  mounted() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/v1/news/list');
    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        this.newsList = JSON.parse(xhr.response).newsList;
      }
    };
    xhr.send();
  }
};
</script>

<style scoped>
  .news-block {
    display: block;
    color: black;
    margin: 15px;
  }
  .website-card {
    border-radius: 6px 6px 6px 6px;
    box-shadow: 0px 0px 1px 0px rgba(0, 0, 0, 0.24),
    0px 1px 3px 0px rgba(0, 0, 0, 0.12);
    border: 2px solid rgb(0, 0, 0);
    padding: 24px;
    margin: 24px;
  }
  .news-header {
    font-size: 22px;
    font-weight: 600;
  }
  .news-item {
    font-size: 14px;
    color: blue;
    margin: 10px;
  }
</style>
