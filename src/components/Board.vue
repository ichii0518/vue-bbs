<template>
    <ul>
        <li v-for="(post, index) in posts" :key="index">
            <Post :n="index + 1" :time="post.time" :id="post.id" 
                :commenter="post.commenter" :comment="post.comment"
                :replys="post.replys" @replyLinkClicked="$emit('replyLinkClicked', [$event, getPostIndexById($event)])">
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
                    data.id = doc.id;
                    data.replys = [];
                    newposts.push(data);
                });
                //投稿を木にする処理
                newposts.forEach((newpost) => {
                    if (newpost.parentId !== void 0) {
                        // 親を探す
                        let parent = newposts.filter((post) => {
                            return post.id == newpost.parentId;
                        })[0];
                        // 親のリプライとして追加(親が存在する場合のみ)
                        if (parent !== void 0) {
                            parent.replys.push(newpost);
                            // ツリーの高さ1のところから削除
                            let index = newposts.indexOf(newpost);
                            newposts.splice(index, 1);
                        } else{
                            console.error("返信先の見つからないコメントがありました")
                        }
                    }
                });
                this.posts = newposts;
            });
        },
        getPostIndexById(id) {
            return this.posts.findIndex((post) => {
                return post.id == id;
            }) + 1;
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