<template>
    <div class="post">
        <p><span v-if="isReply">Re:</span>
        {{ n }} {{ commenter }} {{ format(time) }}
        <a href="#form" @click="$emit('replyLinkClicked', id)">返信</a>
        </p>
        <p>{{ comment }}</p>
        <p v-if="hasReply()">
            <a href="javascript:void 0" @click="switchReply">{{ switchingMessage() }}</a>
        </p>
    </div>
    <!--返信を再帰的に呼び出し-->
    <ul class="replys" v-if="showsReply">
        <li v-for="(post, index) in replys" :key="index">
            <Post :n="index + 1" :time="post.time" :id="post.id"
                :commenter="post.commenter" :comment="post.comment"
                :replys="post.replys" :isReply="true"
                @replyLinkClicked="$emit('replyLinkClicked', $event)">
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
        id: String,
        comment: String,
        replys: Array,
        isReply: Boolean
    },
    emits: ["replyLinkClicked"],
    data(){
        return{
            posts: {},
            showsReply: true,
        }
    },
    methods: {
        format(time) {
            return moment(time).format("YYYY-MM-DD HH:mm:ss");
        },
        hasReply() {
            return this.replys.length != 0;
        },
        switchReply() {
            this.showsReply = !this.showsReply;
        },
        switchingMessage() {
            if (this.showsReply) {
                return "返信を非表示"
            }
            return "返信を表示"
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