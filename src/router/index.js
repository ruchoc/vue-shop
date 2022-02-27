import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../pages/Login.vue";
import Home from "../pages/Home.vue";

Vue.use(VueRouter);

const routes = [
  { path: "/", redirect: "/login" },
  { path: "/login", component: Login },
  { path: "/home", component: Home },
];

const router = new VueRouter({
  routes,
});

router.beforeEach((to,from,next)=>{
  if(to.path=='/login') return next()
  if(window.sessionStorage.getItem('token')) next()
  else next('/login')
})

export default router;
