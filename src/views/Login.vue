<script setup lang="ts">
import { reactive, ref } from 'vue'; import { useRouter } from 'vue-router'; import { ElMessage } from 'element-plus'; import { authApi } from '../api';
const router = useRouter(); const loading = ref(false); const form = reactive({ username: 'gaoyu', password: 'gjy321456' });
async function submit() { loading.value = true; try { const { data } = await authApi.login(form); localStorage.setItem('admin-token', data.accessToken); router.push('/posts'); } catch { ElMessage.error('账号或密码错误'); } finally { loading.value = false; } }
</script>
<template><main class="login-page"><section class="login-card"><div class="admin-logo"><span>&gt;_</span> Coder Blog</div><h1>欢迎回来</h1><p>登录管理你的技术记录</p><el-form @submit.prevent="submit"><el-form-item><el-input v-model="form.username" placeholder="账号" /></el-form-item><el-form-item><el-input v-model="form.password" type="password" show-password placeholder="密码" @keyup.enter="submit" /></el-form-item><el-button type="primary" :loading="loading" style="width:100%" @click="submit">登录后台</el-button></el-form></section></main></template>
