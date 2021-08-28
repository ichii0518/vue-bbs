<template>
    <div class="post">
        <p>{{ n }} {{ commenter }} {{ moment(time).format("YYYY-MM-DD HH:mm:ss") }}</p>
        <p>{{ comment }}</p>
    </div>
</template>

<script>
const moment = require("moment")

export default {
    props: {
        n: Number,
        commenter: String,
        time: Date,
        comment: String
    },
    data(){
        return{
            posts: {},
            moment: moment
        }
    }
}
</script>

<style scoped>
    .post {
        border: solid 0.1rem black;
        border-radius: 20%;
    }
</style>