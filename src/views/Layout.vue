<script setup lang="ts">
import { useRouter } from "vue-router";
const router = useRouter();
function logout() {
  localStorage.removeItem("admin-token");
  router.push("/login");
}
</script>
<template>
  <div class="admin-layout">
    <aside class="admin-side">
      <div class="admin-logo"><span>&gt;_</span> Coder Blog</div>
      <nav class="admin-menu">
        <router-link to="/posts"> 📝 文章 </router-link
        ><router-link to="/tags"> # 标签 </router-link
        ><router-link to="/comments"> 💬 评论 </router-link>
      </nav>
    </aside>
    <section class="admin-main">
      <header class="admin-top">
        <span class="muted">内容管理</span
        ><el-button link @click="logout"> 退出登录 </el-button>
      </header>
      <main class="admin-content">
        <router-view />
      </main>
    </section>
  </div>
</template>
