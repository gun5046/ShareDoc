<template>
    <div>
        <div>
            <input type="text" v-model="roomName" />
            <button @click="createRoom">regist</button>
        </div>
    </div>
</template>

<script>
export default {
    data: () => {
        return {
            roomName: "",
        };
    },

    methods: {
        async createRoom() {
            if (this.roomName === "") {
                alert("입력하시오")
                return
            }

            await this.$store.dispatch("createRoom", this.roomName)
            this.$router.push({ name: "room-list" })
        }
    }
}
</script>

<style>

</style>