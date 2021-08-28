<template>
    <form id="form">
        <p><span v-if="isReply">返信先：{{ destNum }} <button @click="cancelReplying" onclick="return false">返信をキャンセル</button></span>
         名前：<input type = "text" v-model="name"></p>
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
            isReply: false
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
        },
        setId(event) {
            let id = event[0];
            let destNum = event[1];
            console.log("idに" + destNum + "をセットしました");
            this.parentId = id;
            this.destNum = destNum
            this.isReply = true;
        },
        cancelReplying() {
            this.parentId = void 0;
            this.isReply = false;
        }
    }
}
</script>

<style scoped>
    form {
        border: solid 0.1rem black;
    }
</style>