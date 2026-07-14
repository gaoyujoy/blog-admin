<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { marked } from "marked";
import hljs from "highlight.js/lib/common";
import "highlight.js/styles/github-dark.css";
import { ElMessage } from "element-plus";
import { postsApi, tagsApi } from "../api";
import type { Tag } from "../types";
const route = useRoute();
const router = useRouter();
const loading = ref(false);
const tags = ref<Tag[]>([]);
const isNew = route.params.id === undefined;
const form = reactive({
  title: "",
  slug: "",
  excerpt: "",
  content: "# 新文章\n\n在这里开始记录。",
  tags: [] as string[],
  published: true,
});
const previewHtml = computed(() => {
  const renderer = new marked.Renderer();
  renderer.code = ({ text, lang }) => {
    const language = (lang || "")
      .trim()
      .split(/\s+/)[0]
      .toLowerCase()
      .replace(/[^a-z0-9_+-]/g, "");
    const highlighted =
      language && hljs.getLanguage(language)
        ? hljs.highlight(text, { language }).value
        : hljs.highlightAuto(text).value;
    const className = language
      ? ` class="hljs language-${language}"`
      : ' class="hljs"';
    return `<pre><code${className}>${highlighted}</code></pre>`;
  };
  return marked.parse(form.content || "", { renderer }) as string;
});
onMounted(async () => {
  tags.value = (await tagsApi.list()).data;
  if (!isNew)
    Object.assign(form, (await postsApi.get(String(route.params.id))).data);
});
async function save() {
  if (!form.title || !form.slug || !form.excerpt || !form.content) {
    ElMessage.warning("请填写完整内容");
    return;
  }
  loading.value = true;
  try {
    if (isNew) await postsApi.create(form);
    else await postsApi.update(String(route.params.id), form);
    ElMessage.success("文章已保存");
    router.push("/posts");
  } finally {
    loading.value = false;
  }
}
</script>
<template>
  <div class="editor-page">
    <div class="page-title">
      <h2>{{ isNew ? "新建文章" : "编辑文章" }}</h2>
      <div>
        <el-button @click="router.push('/posts')"> 取消 </el-button
        ><el-button type="primary" :loading="loading" @click="save">
          保存文章
        </el-button>
      </div>
    </div>
    <el-card
      class="post-settings-card"
      shadow="never"
      style="margin-bottom: 22px"
    >
      <template #header> 文章设置 </template
      ><el-form class="post-settings-form" inline label-width="84px">
        <el-form-item label="标签">
          <el-select v-model="form.tags" multiple placeholder="选择标签">
            <el-option
              v-for="tag in tags"
              :key="tag._id"
              :label="tag.name"
              :value="tag.name"
            />
          </el-select> </el-form-item
        ><el-form-item label="公开状态">
          <el-switch
            v-model="form.published"
            active-text="展示"
            inactive-text="隐藏"
          />
        </el-form-item>
      </el-form>
    </el-card>
    <div class="editor-grid">
      <el-card shadow="never">
        <el-form label-position="top">
          <el-form-item label="标题">
            <el-input
              v-model="form.title"
              placeholder="文章标题"
            /> </el-form-item
          ><el-form-item label="Slug">
            <el-input
              v-model="form.slug"
              placeholder="url-friendly-slug"
            /> </el-form-item
          ><el-form-item label="简介">
            <el-input
              v-model="form.excerpt"
              maxlength="180"
              show-word-limit
              placeholder="文章列表中展示的简介"
            /> </el-form-item
          ><el-form-item label="正文（Markdown）">
            <el-input
              v-model="form.content"
              type="textarea"
              placeholder="支持 Markdown"
              class="md-textarea"
            />
          </el-form-item>
        </el-form> </el-card
      ><el-card shadow="never">
        <template #header> Markdown 预览 </template>
        <div class="preview" v-html="previewHtml" />
      </el-card>
    </div>
  </div>
</template>
