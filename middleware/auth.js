export default defineNuxtRouteMiddleware(async (to, from) => {
  if (process.client) {
    const token = localStorage.getItem("token");
    if (token == null || token == undefined || token == "") {
      return navigateTo({ path: "/auth/login" });
    }
  }
});
