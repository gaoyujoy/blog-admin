<script setup lang="ts">
import { onMounted, ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { tagsApi } from "../api";
import type { Tag } from "../types";
const tags = ref<Tag[]>([]);
const loading = ref(false);
const name = ref("");
const editingId = ref("");
const editingName = ref("");
async function load() {
  loading.value = true;
  try {
    tags.value = (await tagsApi.list()).data;
  } finally {
    loading.value = false;
  }
}
async function create() {
  if (!name.value.trim()) return;
  try {
    await tagsApi.create(name.value);
    name.value = "";
    ElMessage.success("标签已创建");
    load();
  } catch {
    ElMessage.error("创建失败，标签可能已存在");
  }
}
function startEdit(tag: Tag) {
  editingId.value = tag._id;
  editingName.value = tag.name;
}
async function saveEdit() {
  if (!editingName.value.trim()) return;
  await tagsApi.update(editingId.value, editingName.value);
  editingId.value = "";
  load();
}
async function remove(tag: Tag) {
  await ElMessageBox.confirm(`确定删除标签“${tag.name}”？`, "提示");
  await tagsApi.remove(tag._id);
  load();
}
onMounted(load);
</script>
<template>
  <div class="page-title">
    <h2>标签管理</h2>
  </div>
  <el-card shadow="never" style="margin-bottom: 18px">
    <el-form class="tag-create-form" inline @submit.prevent="create">
      <el-form-item label="新标签">
        <el-input
          v-model="name"
          placeholder="如：Vue"
          @keyup.enter="create"
        /> </el-form-item
      ><el-button type="primary" @click="create"> 新增标签 </el-button>
    </el-form> </el-card
  ><el-card shadow="never">
    <el-table v-loading="loading" :data="tags">
      <el-table-column type="index" label="#" width="70" /><el-table-column
        label="标签"
      >
        <template #default="{ row }">
          <el-input
            v-if="editingId === row._id"
            v-model="editingName"
            size="small"
            style="max-width: 260px"
          /><span v-else># {{ row.name }}</span>
        </template> </el-table-column
      ><el-table-column label="操作" width="180">
        <template #default="{ row }">
          <template v-if="editingId === row._id">
            <el-button link type="primary" @click="saveEdit"> 保存 </el-button
            ><el-button link @click="editingId = ''">
              取消
            </el-button> </template
          ><template v-else>
            <el-button link type="primary" @click="startEdit(row)">
              编辑 </el-button
            ><el-button link type="danger" @click="remove(row)">
              删除
            </el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>
