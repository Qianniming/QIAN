# 🐳 Docker部署配置指南

## 📋 概述
此文档说明如何为NANUK项目配置Docker部署（可选）。

**注意：Vercel部署已经成功，Docker部署是可选的备用方案。**

## 🎯 为什么需要Docker部署？
- **多云支持**：除了Vercel外的其他平台部署
- **本地开发**：统一的开发和生产环境
- **私有部署**：企业内部服务器部署
- **备份方案**：降低对单一平台的依赖

## 📦 当前Docker配置状态

### ✅ 已配置的文件：
- `Dockerfile` - Next.js应用容器化配置
- `docker-compose.yml` - 开发环境Docker Compose
- `docker-compose.prod.yml` - 生产环境Docker Compose

### ❌ 需要配置的Next.js设置：
为了启用Docker部署，需要在`next.config.js`中启用standalone输出：

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // 🐳 Docker部署时启用standalone输出
  output: 'standalone',
  
  // ... 其他配置
}
```

## 🔧 GitHub Actions Docker部署配置

### 1. 在GitHub仓库中配置Secrets：

进入 GitHub 仓库 → Settings → Secrets and variables → Actions

添加以下secrets：

```
DOCKER_USERNAME=你的Docker Hub用户名
DOCKER_PASSWORD=你的Docker Hub密码或访问令牌
```

### 2. 更新GitHub Actions工作流：

在`.github/workflows/deploy.yml`中添加Docker部署作业：

```yaml
  docker:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
      
    - name: Set up Docker Buildx
      uses: docker/setup-buildx-action@v3
      
    - name: Login to Docker Hub
      uses: docker/login-action@v3
      with:
        username: ${{ secrets.DOCKER_USERNAME }}
        password: ${{ secrets.DOCKER_PASSWORD }}
        
    - name: Build and push Docker image
      uses: docker/build-push-action@v5
      with:
        context: .
        push: true
        tags: |
          ${{ secrets.DOCKER_USERNAME }}/nanuk:latest
          ${{ secrets.DOCKER_USERNAME }}/nanuk:${{ github.sha }}
        cache-from: type=gha
        cache-to: type=gha,mode=max
```

## 🚀 本地Docker部署测试

### 开发环境：
```bash
# 启动开发环境（包含MongoDB）
docker-compose up -d

# 查看日志
docker-compose logs -f nanuk-app

# 停止服务
docker-compose down
```

### 生产环境测试：
```bash
# 启动生产环境
docker-compose -f docker-compose.prod.yml up -d

# 查看日志
docker-compose -f docker-compose.prod.yml logs -f

# 停止服务
docker-compose -f docker-compose.prod.yml down
```

## 🔍 故障排除

### 常见问题：

1. **构建失败**：
   - 确认`next.config.js`中启用了`output: 'standalone'`
   - 检查所有依赖是否正确安装

2. **容器启动失败**：
   - 检查环境变量是否正确配置
   - 确认端口3000未被占用

3. **数据库连接失败**：
   - 检查MongoDB连接字符串
   - 确认网络配置正确

## 📋 当前状态总结

- ✅ **Vercel部署**：已成功，推荐使用
- ⏳ **Docker部署**：配置完整，需要时可启用
- ❌ **GitHub Actions Docker**：需要配置Secrets才能使用

## 💡 建议

1. **保持现状**：Vercel部署已经成功，无需立即配置Docker
2. **备用方案**：可以在需要时快速启用Docker部署
3. **学习目的**：Docker配置可用于学习容器化技术

---

**注意**：除非有特殊需求，建议继续使用Vercel部署。Docker部署作为备用方案保留。