<template>
    <form>
        <p>名前：<input type = "text" v-model="name"></p>
        <p>コメント：<textarea v-model="comment" cols="70" rows="14"></textarea></p>
        <button @click="postComment" onclick="return false">送信</button>
    </form>
</template>

<script>
import moment from "moment";
import firebase from "firebase/app";
import "firebase/firestore";

export default {
    props: {
    },
    data(){
        return{
            name: "",
            comment:""
        }
    },
    methods: {
        postComment() {
            let now = moment();
            now
            let db = firebase.firestore();
            let col = db.collection("comments")
            col.get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    console.log(doc.id, " => ", doc.data());
                });
            });
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