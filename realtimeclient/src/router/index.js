import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("@/views/HomeView"),
    children: [
      {
        path: "",
        name: "room-list",
        component: () => import("@/components/RoomVue"),
      },
      {
        path: "/room",
        name: "room-create",
        component: () => import("@/components/CreateRoomVue"),
      },
      {
        path: "/chat",
        name: "room-chat",
        component: () => import("@/components/ChatVue"),
      },
    ],
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
