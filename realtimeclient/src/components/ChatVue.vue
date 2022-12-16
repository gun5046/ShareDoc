<template>
    <div>
        <div>
            <textarea @change="sendMsg">
            </textarea>
        </div>
    </div>
</template>

<script>
export default {
    data: () => {

    },
    methods: {
        sendMsg() {
            console.log("10")
            console.log("123")
        }
    }
}
</script>

<style>

</style>