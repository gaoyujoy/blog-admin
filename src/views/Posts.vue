<script setup lang="ts">
import { onMounted, ref } from "vue";
import { RouterLink } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import { postsApi } from "../api";
import type { Post } from "../types";
const posts = ref<Post[]>([]);
const loading = ref(false);
async function load() {
  loading.value = true;
  try {
    posts.value = (await postsApi.list({ page: 1, limit: 100 })).data.items;
  } finally {
    loading.value = false;
  }
}
async function remove(post: Post) {
  await ElMessageBox.confirm(`确定删除“${post.title}”？`, "提示");
  await postsApi.remove(post._id);
  ElMessage.success("已删除");
  load();
}
onMounted(load);
const date = (d: string) => new Date(d).toLocaleDateString("zh-CN");
</script>
<template>
  <div class="page-title">
    <div>
      <h2>文章管理</h2>
      <span class="muted">共 {{ posts.length }} 篇</span>
    </div>
    <router-link to="/posts/new">
      <el-button type="primary"> 新建文章 </el-button>
    </router-link>
  </div>
  <el-card shadow="never">
    <el-table v-loading="loading" :data="posts">
      <el-table-column
        prop="title"
        label="标题"
        min-width="240"
      /><el-table-column label="标签" min-width="180">
        <template #default="{ row }">
          <el-tag
            v-for="tag in row.tags"
            :key="tag"
            size="small"
            style="margin: 2px"
          >
            {{ tag }}
          </el-tag>
        </template> </el-table-column
      ><el-table-column label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.published ? 'success' : 'info'">
            {{ row.published ? "展示中" : "隐藏" }}
          </el-tag>
        </template> </el-table-column
      ><el-table-column label="创建时间" width="130">
        <template #default="{ row }">
          {{ date(row.createdAt) }}
        </template> </el-table-column
      ><el-table-column label="操作" width="145">
        <template #default="{ row }">
          <router-link :to="`/posts/${row._id}/edit`">
            <el-button link type="primary"> 编辑 </el-button> </router-link
          ><el-button link type="danger" @click="remove(row)"> 删除 </el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>
