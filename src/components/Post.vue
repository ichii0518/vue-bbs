<template>
    <div class="post">
        <p><span v-if="isReply">Re:</span>{{ n }} {{ commenter }} {{ moment(time).format("YYYY-MM-DD HH:mm:ss") }}</p>
        <p>{{ comment }}</p>
    </div>
    <!--再帰的に呼び出し-->
    <ul class="replys">
        <li v-for="(post, index) in replys" :key="index">
            <Post :n="index + 1" :time="post.time" 
                :commenter="post.commenter" :comment="post.comment"
                :replys="post.replys" :isReply="true">
            </Post>
        </li>
    </ul>
</template>

<script>
const moment = require("moment")

export default {
    props: {
        n: Number,
        commenter: String,
        time: Date,
        comment: String,
        replys: Array,
        isReply: Boolean
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
        margin: 1rem auto;
    }

        li {
        list-style-type: none;
        position: relative;
    }

    li::before {
        position: absolute;
        content: "";
        border-left: solid 0.1rem black;
        width: 10px;
        height: calc(100% + 1.25em);
        top: 0;
        left: -1em;
    }

    li:last-child::before {
        height: 60%;
    }

    li::after {
        position: absolute;
        content: "";
        border-top: solid 0.1rem black;
        width: 1em;
        height: 10px;
        top: 2em;
        left: -1em;
    }
</style>