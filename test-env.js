// 测试环境变量读取
console.log('🔍 检查环境变量...');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);
console.log('MONGODB_URI length:', process.env.MONGODB_URI?.length || 0);

if (process.env.MONGODB_URI) {
    console.log('✅ MONGODB_URI 已设置');
    console.log('连接字符串预览:', process.env.MONGODB_URI.substring(0, 50) + '...');
} else {
    console.log('❌ MONGODB_URI 未设置');
    console.log('当前工作目录:', process.cwd());
    console.log('可用的环境变量键:', Object.keys(process.env).filter(key => key.includes('MONGO')));
}