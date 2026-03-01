# 短链接管理系统前端

## 环境要求
- Node.js (建议使用较新LTS版本)
- 包管理器：npm/pnpm/yarn任意（推荐pnpm）
- IDE：VSCode（推荐装ESLint/Prettier插件）

## 启动命令
1. 安装依赖
   ```bash
   npm install
   ```

2. 启动开发服务器
   ```bash
   npm run dev
   ```

3. 构建生产版本
   ```bash
   npm run build
   ```

## Mock模式
- 开发环境下默认启用Mock数据
- Mock数据配置在 `src/mocks/` 目录
- 生产环境会自动禁用Mock

## 联调模式配置
1. 修改 `src/api/http.ts` 中的 `baseURL` 为后端服务地址
2. 或在 `vite.config.ts` 中配置代理：
   ```typescript
   export default defineConfig({
     server: {
       proxy: {
         '/api': {
           target: 'http://localhost:8080', // 后端服务地址
           changeOrigin: true
         }
       }
     }
   })
   ```

## 页面入口
- **功能演示页**：http://localhost:5173/demo
- **管控后台**：http://localhost:5173/admin

## 项目结构
```
src/
  api/            # 接口封装
    http.ts       # HTTP请求封装
    shorturl.ts   # 短链接业务API
  mocks/          # Mock数据
    index.ts      # Mock入口
    shorturl.ts   # 短链接Mock数据
  pages/          # 页面
    demo/         # 功能演示页
    admin/        # 管控后台
  router/         # 路由配置
  utils/          # 工具类
```

## 功能说明
1. **功能演示页**：
   - 输入长链接 → 生成短码 → 复制短链接
   - 支持URL格式校验

2. **管控后台**：
   - 短链接列表展示
   - 按名称搜索
   - 新增/编辑/删除短链接
   - 启用/禁用短链接
   - 操作后自动刷新列表
   - 按钮防重复提交

## 技术栈
- Vue 3 + TypeScript
- Element Plus
- Axios
- Mock.js
- Vite