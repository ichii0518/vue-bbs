<template>
    <ul>
        <li v-for="(post, index) in posts" :key="index">
            <Post :n="index + 1" :time="post.time" 
                :commenter="post.commenter" :comment="post.comment">
            </Post>
        </li>
    </ul>
</template>

<script>
import Post from './Post.vue'
const moment = require("moment")

export default {
    data(){
        return{
            posts: [
                {
                    commenter: "a",
                    time: moment().toDate(),
                    comment: "test1"
                },
                {
                    commenter: "b",
                    time: moment().toDate(),
                    comment: "test2"
                },
            ]
            //loadPosts()
        }
    },
    components: {
        Post
    },
    methods: {
        loadPosts() {
            alert("コメントを読み込んだことにします")
        }
    }
}
</script>

<style scoped>
    li {
        list-style-type: none;
        position: relative;
        margin: 1rem auto;
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
        top: 60%;
        left: -1em;
    }
</style>