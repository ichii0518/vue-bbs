<template>
  <h1>掲示板</h1>
  <Board ref="board"></Board>
  <Form @onPosted="this.$refs.board.loadPosts()"></Form>
</template>

<script>
import Board from "./components/Board.vue"
import Form from './components/Form.vue'

export default {
  name: 'App',
  components: {
    Board,
    Form
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
</style>
