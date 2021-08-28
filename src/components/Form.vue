<template>
    <form>
        <p>返信先：{{ parentId }} 名前：<input type = "text" v-model="name"></p>
        <p>コメント：<textarea v-model="comment" cols="70" rows="14"></textarea></p>
        <button @click="postComment" onclick="return false">送信</button>
    </form>
</template>

<script>
import firebase from "firebase/app";
import "firebase/firestore";

export default {
    props: {
    },
    data(){
        return{
            name: "",
            comment: "",
            parentId: void 0,
        }
    },
    methods: {
        postComment() {
            let db = firebase.firestore();
            let col = db.collection("comments");
            col.add(
                {
                    "commenter": this.name,
                    "comment": this.comment,
                    "time": firebase.firestore.Timestamp.now(),
                    "parentId": this.parentId
                }
            )
            .then((docRef) => {
                console.log("コメントを送信しました", docRef.id)
            })
            .catch((e) => {
                console.error("コメントの送信に失敗しました", e)
            })
            this.$emit("onPosted");
            this.name = "";
            this.comment = "";
        }
    }
}
</script>

<style scoped>
    form {
        border: solid 0.1rem black;
    }
</style>