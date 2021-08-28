<template>
    <ul>
        <li v-for="(post, index) in posts" :key="index">
            <Post :n="index + 1" :time="post.time" :id="post.id" 
                :commenter="post.commenter" :comment="post.comment"
                :replys="post.replys"
                :setId="setId" :getPostPathById="this.getPostPathById">
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
    props: {
        setId: Function
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
            /* 返信ではないコメントをツリーに追加、
            追加したコメントをpostsから消していく*/
            let tree = [];
            posts.forEach((post, index) => {
                if (post.parentId === void 0) {
                    tree.push(post);
                    delete posts[index]
                }
            });
            // 配列を詰める
            posts = posts.filter((element) => {return element !== void 0});
            
            // postsが空になるまで繰り返す
            while (posts.length != 0){
                // 全てのpostをループ
                posts.forEach((post, index) => {
                    let result = false;
                    // ツリーにpostを追加する、成功したらpostsから消す
                    for (let treeNode of tree) {
                        result = self.addPost(treeNode, post);
                        if (result) {
                            delete posts[index];
                            break;
                        }
                    }
                });
                // 配列を詰める
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
                /*このresultは子孫ノードのどこかにつけられればtrueになり、
                どこにもつけられなければfalseになる*/
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
        getPostPathById(id){
            let post = this.getPostById(id)
            let path = ""
            let currentNode = post
            do {
                let index = this.getPostIndexById(currentNode.id)
                path = index + "/" + path
                let parent = this.getPostById(currentNode.parentId)
                currentNode = parent
            } while (currentNode !== null);
            path = path.slice(0, -1)
            return path
        },
        getPostIndexById(id) {
            let self = this
            let post = self.getPostById(id)
            // 返信ではないpostの場合そのままのインデックスを取得
            if (post.parentId === void 0) {
                return self.posts.findIndex((p) => {
                    return p == post;
                }) + 1;
            }
            // 返信である場合、親を取得し、親の返信の中でのインデックスを取得する
            let parent = self.getPostById(post.parentId)
            return parent.replys.findIndex((p) => {
                    return p == post;
            }) + 1;
        },
        getPostById(id) {
            let self = this
            for (let post of self.posts) {
                let ret = self.searchPostById(post, id);
                if (ret !== null) return ret
            }
            return null;
        },
        searchPostById(currentPost, id) {
            // そのpostのidが探しているものと一致するならそれを返す
            if (currentPost.id == id) {
                return currentPost
            }
            // 全ての返信を探す
            for (let reply of currentPost.replys) {
                let ret = this.searchPostById(reply, id)
                if (ret !== null) return ret;
            }
            return null;
        }
    },
    created() {
        console.log("コメントを初期化しています");
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