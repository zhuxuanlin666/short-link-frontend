<template>
  <div class="demo-container">
    <h1>短链接生成演示</h1>
    <el-form :model="form" label-width="80px">
      <el-form-item label="原始链接">
        <el-input v-model="form.originalUrl" placeholder="请输入长链接" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="generateShortUrl" :loading="loading">生成短链接</el-button>
      </el-form-item>
    </el-form>
    
    <div v-if="shortUrl" class="result">
      <h3>生成结果</h3>
      <el-input v-model="shortUrl" readonly />
      <el-button type="success" @click="copyShortUrl" style="margin-top: 10px">复制链接</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { shorturlApi } from '../../api/shorturl'

const form = ref({
  originalUrl: ''
})

const shortUrl = ref('')
const loading = ref(false)

const generateShortUrl = async () => {
  if (!form.value.originalUrl) {
    ElMessage.warning('请输入原始链接')
    return
  }
  
  // 简单的URL格式校验
  try {
    new URL(form.value.originalUrl)
  } catch {
    ElMessage.error('请输入正确的URL')
    return
  }
  
  loading.value = true
  try {
    // 调用API生成短码
    const response = await shorturlApi.generateShortCode()
    const shortCode = response.data.shortCode
    shortUrl.value = `http://localhost:5173/${shortCode}`
    ElMessage.success('短链接生成成功')
  } catch (error) {
    console.error('生成短链接失败:', error)
    // 错误已在拦截器中提示
  } finally {
    loading.value = false
  }
}

const copyShortUrl = () => {
  navigator.clipboard.writeText(shortUrl.value)
    .then(() => {
      ElMessage.success('链接已复制到剪贴板')
    })
    .catch(() => {
      ElMessage.error('复制失败，请手动复制')
    })
}
</script>

<style scoped>
.demo-container {
  max-width: 600px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.result {
  margin-top: 30px;
  padding: 20px;
  background-color: #f5f7fa;
  border-radius: 8px;
}
</style>