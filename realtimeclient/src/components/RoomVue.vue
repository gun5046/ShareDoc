<template>
    <div>
        <router-link to="/room">방 생성</router-link>
        <div>
            <div v-for="(item, index) in rooms" :key="index">
                <h5 @click="enterRoom(item.roomName)">{{ item.roomName }}</h5>
            </div>

        </div>
    </div>
</template>

<script>
import { mapState } from "vuex";
export default {
    computed: {
        ...mapState(["rooms"])
    },
    created() {
        this.$store.dispatch("getRoomList");
    },
    methods: {
        enterRoom(name) {
            this.$store.dispatch("enterRoom", name)
            this.$router.push({ name: "room-chat" })
        }
    }
}
</script>

<style>

</style>