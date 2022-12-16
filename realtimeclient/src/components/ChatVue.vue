<template>
    <div>
        <div>
            <h1>{{ roomName }}</h1>
            <h5> Sender : {{ sender }}</h5>
        </div>
        <div>
            <textarea type="text" v-model="msg" @keydown="sendMsg" />

        </div>
    </div>
</template>

<script>
export default {
    data: () => {
        return {
            sender: "",
            roomName: "",
            msg: "",
            ignoreKey: ['ArrowUp', 'ArrowDown', 'ArrowRight', 'ArrowLeft', 'Backspace', 'Alt', 'Control', 'CapsLock', 'Shift', 'Tap']
        }
    },
    methods: {
        sendMsg(event) {
            if (this.ignoreKey.includes(event.key)) return;
            console.log(event.key)
        }
    },
    created() {
        this.sender = localStorage.getItem("sender")
        this.roomName = localStorage.getItem("roomName")
    },
}
</script>

<style>

</style>