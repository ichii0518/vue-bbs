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
            let posts = [];
            let db = firebase.firestore();
            let col = db.collection("comments")
            col.get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    let data = doc.data();
                    data.time = data.time.toDate();
                    data.id = doc.id;
                    data.replys = [];
                    posts.push(data);
                    });
                this.posts = this.sortByTime(this.makeTree(posts));
                });
        },
        makeTree(posts) {
            let self = this;
            // 返信ではないコメントをツリーに追加
            let tree = [];
            posts.forEach((post, index) => {
                if (post.parentId === void 0) {
                    tree.push(post);
                    delete posts[index]
                }
            });
            posts = posts.filter((element) => {return element !== void 0});
            
            while (posts.length != 0){
                // 全てのpostをループ
                posts.forEach((post, index) => {
                    let result = false;
                    // ツリーにpostを追加する
                    for (let treeNode of tree) {
                        result = self.addPost(treeNode, post);
                        if (result) {
                            delete posts[index];
                            break;
                        }
                    }
                });
                posts = posts.filter((element) => {return element !== void 0});
            }
            return tree;
        },
        addPost(currentNode, post) {
            let self = this;
            // もし現在のノードに付けられるなら、つけてtrueを返す
            if (currentNode.id == post.parentId) {
                currentNode.replys.push(post)
                return true;
            } else {
                // 現在のノードの子ノードを調査
                let result = false
                for (let treeNode of currentNode.replys) {
                    result = self.addPost(treeNode, post)
                    if (result) break //つけられたらfor文を抜ける
                }
                //このresultは子孫ノードのどこかにつけられればtrueになり、
                //どこにもつけられなければfalseになる
                return result;
            }
        },
        sortByTime(tree) {
            let self = this
            tree.sort((a, b) => a.time - b.time);
            for (let node of tree) {
                if (node.replys.length != 0){
                    self.sortByTime(node.replys)
                }
            }
            return tree;
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
        height: 2rem;
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