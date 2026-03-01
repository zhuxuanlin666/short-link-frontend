<template>
  <div class="admin-container">
    <h1>短链接管理</h1>
    
    <div class="search-bar">
      <el-input v-model="searchForm.name" placeholder="按短链接名称搜索" style="width: 300px" />
      <el-button type="primary" @click="search" style="margin-left: 10px">查询</el-button>
      <el-button type="success" @click="openAddModal" style="margin-left: 10px">新增</el-button>
    </div>
    
    <el-table :data="shortLinks" style="width: 100%" border v-loading="loading">
      <el-table-column prop="name" label="名称" width="180" />
      <el-table-column prop="shortCode" label="短码" width="120" />
      <el-table-column prop="originalUrl" label="原始链接" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="scope">
          <el-tag :type="scope.row.status === 'ENABLED' ? 'success' : 'danger'">
            {{ scope.row.status === 'ENABLED' ? '启用' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="创建时间" width="180" />
      <el-table-column label="操作" width="200">
        <template #default="scope">
          <el-button size="small" @click="openEditModal(scope.row)">编辑</el-button>
          <el-button size="small" type="danger" @click="deleteShortLink(scope.row.id)">删除</el-button>
          <el-button 
            size="small" 
            :type="scope.row.status === 'ENABLED' ? 'warning' : 'success'"
            @click="toggleStatus(scope.row.id, scope.row.status === 'ENABLED' ? 'DISABLED' : 'ENABLED')"
          >
            {{ scope.row.status === 'ENABLED' ? '禁用' : '启用' }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <!-- 新增/编辑弹窗 -->
    <el-dialog
      :title="isEdit ? '编辑短链接' : '新增短链接'"
      v-model="dialogVisible"
      width="500px"
    >
      <el-form :model="form" label-width="80px">
        <el-form-item label="名称" required>
          <el-input v-model="form.name" placeholder="请输入短链接名称" />
        </el-form-item>
        <el-form-item label="原始链接" required>
          <el-input v-model="form.originalUrl" placeholder="请输入长链接" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm" :loading="submitLoading">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { shorturlApi, ShortLink } from '../../api/shorturl'

const searchForm = ref({
  name: ''
})

const shortLinks = ref<ShortLink[]>([])
const dialogVisible = ref(false)
const isEdit = ref(false)
const form = ref({
  id: 0,
  name: '',
  originalUrl: ''
})
const submitLoading = ref(false)
const loading = ref(false)

onMounted(() => {
  loadShortLinks()
})

const loadShortLinks = async () => {
  loading.value = true
  try {
    const response = await shorturlApi.getList()
    shortLinks.value = response.data
  } catch (error) {
    ElMessage.error('加载失败，请重试')
  } finally {
    loading.value = false
  }
}

const search = async () => {
  loading.value = true
  try {
    const response = await shorturlApi.getList({ name: searchForm.value.name })
    shortLinks.value = response.data
  } catch (error) {
    ElMessage.error('搜索失败，请重试')
  } finally {
    loading.value = false
  }
}

const openAddModal = () => {
  isEdit.value = false
  form.value = {
    id: 0,
    name: '',
    originalUrl: ''
  }
  dialogVisible.value = true
}

const openEditModal = (row: ShortLink) => {
  isEdit.value = true
  form.value = {
    id: row.id,
    name: row.name,
    originalUrl: row.originalUrl
  }
  dialogVisible.value = true
}

const submitForm = async () => {
  if (!form.value.name || !form.value.originalUrl) {
    ElMessage.warning('请填写完整信息')
    return
  }
  
  submitLoading.value = true
  try {
    if (isEdit.value) {
      await shorturlApi.update(form.value.id, {
        name: form.value.name,
        originalUrl: form.value.originalUrl
      })
      ElMessage.success('编辑成功')
    } else {
      await shorturlApi.create({
        name: form.value.name,
        originalUrl: form.value.originalUrl
      })
      ElMessage.success('新增成功')
    }
    dialogVisible.value = false
    loadShortLinks()
  } catch (error) {
    ElMessage.error('操作失败，请重试')
  } finally {
    submitLoading.value = false
  }
}

const deleteShortLink = (id: number) => {
  ElMessageBox.confirm('确定要删除这个短链接吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
  .then(async () => {
    await shorturlApi.delete(id)
    ElMessage.success('删除成功')
    loadShortLinks()
  })
  .catch(() => {})
}

const toggleStatus = async (id: number, status: 'ENABLED' | 'DISABLED') => {
  try {
    if (status === 'ENABLED') {
      await shorturlApi.enable(id)
    } else {
      await shorturlApi.disable(id)
    }
    ElMessage.success(`短链接已${status === 'ENABLED' ? '启用' : '禁用'}`)
    loadShortLinks()
  } catch (error) {
    ElMessage.error('操作失败，请重试')
  }
}
</script>

<style scoped>
.admin-container {
  max-width: 1000px;
  margin: 30px auto;
  padding: 20px;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.search-bar {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}
</style>