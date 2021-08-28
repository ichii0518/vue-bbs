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
import firebase from "firebase/app";
import "firebase/firestore";

export default {
    data(){
        return{
            posts: []
        }
    },
    components: {
        Post
    },
    methods: {
        loadPosts() {
            let newposts = [];
            let db = firebase.firestore();
            let col = db.collection("comments")
            col.get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    let data = doc.data();
                    data.time = data.time.toDate();
                    newposts.push(data);
                });
                this.posts = newposts;
            });
        }
    },
    created() {
        console.log("最初のコメントを読み込んでいます");
        this.loadPosts();
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