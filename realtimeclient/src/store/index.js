import Vue from "vue";
import Vuex from "vuex";
import axios from "@/api/axios.js";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    socket: null,
    rooms: [],
  },
  getters: {},
  mutations: {
    SET_ROOM_LIST: (state, data) => {
      state.rooms = data.data;
    },
  },
  actions: {
    socketConnect() {
      this.socket = new WebSocket("wss://localhost:9999/");
    },

    getRoomList({ commit }) {
      axios
        .get("rooms")
        .then((res) => {
          commit("SET_ROOM_LIST", res);
          console.log(res);
          //왜안도미>?
        })
        .catch((err) => {
          console.log(err);
        });
    },

    createRoom({ commit }, roomName) {
      console.log(commit);
      console.log(roomName);
      //const room = {};
    },
    enterRoom(roomName) {
      const sender = prompt("사용자명을 입력하세요");
      if (sender !== "") {
        localStorage.setItem("sender", sender);
        localStorage.setItem("roomName", roomName);
        this.$router.push({ name: "room-chat" });
      }
    },
  },
  modules: {},
});
