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

    ERROR_OCCURENCE: (state, err) => {
      console.log(err);
    },
  },
  actions: {
    socketConnect() {
      this.socket = new WebSocket("wss://localhost:9999/");
    },

    async getRoomList({ commit }) {
      await axios
        .get("rooms")
        .then((res) => {
          commit("SET_ROOM_LIST", res);
        })
        .catch((err) => {
          commit("ERROR_OCCURENCE", err);
        });
    },

    async createRoom({ commit }, roomName) {
      await axios.post("room", `${roomName}`).catch((err) => {
        commit("ERROR_OCCURENCE", err);
      });
    },

    enterRoom({ commit }, roomName) {
      try {
        const sender = prompt("사용자명을 입력하세요");
        if (sender !== "") {
          localStorage.setItem("sender", sender);
          localStorage.setItem("roomName", roomName);
        }
      } catch (err) {
        commit("ERROR_OCCURENCE", err);
      }
    },
  },
  modules: {},
});
