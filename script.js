// 数据模型和本地存储管理
const Store = {
    // 获取存储的数据
    get: function(key, defaultValue = null) {
        const data = localStorage.getItem(key);
        if (data) {
            try {
                return JSON.parse(data);
            } catch (e) {
                console.error('解析存储数据失败:', e);
                return defaultValue;
            }
        }
        return defaultValue;
    },
    // 存储数据
    set: function(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error('存储数据失败:', e);
            return false;
        }
    },
    // 删除数据
    remove: function(key) {
        localStorage.removeItem(key);
    },
    // 清空所有数据
    clear: function() {
        localStorage.clear();
    }
};

// Chart.js 加载检测和等待函数
function waitForChart(callback, maxAttempts = 50) {
    let attempts = 0;
    
    function checkChart() {
        attempts++;
        
        if (typeof Chart !== 'undefined') {
            console.log('Chart.js 已加载，版本:', Chart.version);
            callback();
            return;
        }
        
        if (attempts >= maxAttempts) {
            console.error('Chart.js 加载超时，图表功能可能无法正常使用');
            // 即使Chart.js未加载，也继续执行其他功能
            callback();
            return;
        }
        
        // 每100ms检查一次
        setTimeout(checkChart, 100);
    }
    
    checkChart();
}

// 安全的图表创建函数
function safeCreateChart(canvasId, config, chartName) {
    if (typeof Chart === 'undefined') {
        console.error('Chart.js 未加载，无法创建图表:', chartName);
        return null;
    }
    
    const canvas = document.getElementById(canvasId);
    if (!canvas) {
        console.error('找不到画布元素:', canvasId);
        return null;
    }
    
    // 设置图表默认颜色方案 - 哆啦A梦主题
    Chart.defaults.color = '#333333';
    Chart.defaults.borderColor = '#E0E0E0';
    
    // 哆啦A梦主题调色板
    const doraemonColors = [
        '#1E90FF', // 蓝色 - 哆啦A梦的主色
        '#FFCC00', // 黄色 - 铃铛
        '#00b894', // 青绿色
        '#8c54ff', // 紫色
        '#64b5f6', // 浅蓝色
        '#fff176', // 浅黄色
        '#4dd0e1', // 浅青色
        '#a5d6a7', // 浅绿色
        '#90caf9', // 淡蓝色
        '#ce93d8'  // 淡紫色
    ];
    
    // 对线条和柱状图应用哆啦A梦配色
    if (config.data && config.data.datasets) {
        config.data.datasets.forEach((dataset, index) => {
            // 如果没有明确设置颜色，使用主题色
            if (!dataset.backgroundColor) {
                dataset.backgroundColor = doraemonColors[index % doraemonColors.length];
            }
            if (!dataset.borderColor && dataset.type !== 'pie' && dataset.type !== 'doughnut') {
                dataset.borderColor = doraemonColors[index % doraemonColors.length];
            }
        });
    }
    
    try {
        const chart = new Chart(canvas, config);
        console.log(`${chartName} 创建成功`);
        return chart;
    } catch (error) {
        console.error(`创建 ${chartName} 失败:`, error);
        return null;
    }
}

// 初始化示例产品数据
function initializeProducts() {
    // 检查是否为在线部署环境（GitHub Pages, Vercel等）
    const isOnlineDeployment = window.location.protocol === 'https:' || 
                              window.location.hostname.includes('github.io') ||
                              window.location.hostname.includes('vercel.app') ||
                              window.location.hostname.includes('netlify.app');
    
    // 强制重新初始化数据（用于测试和在线部署）
    const forceReset = isOnlineDeployment || 
                      localStorage.getItem('forceDoraemonReset') === 'true' || 
                      !localStorage.getItem('productsInitialized'); // 检查是否已初始化
    
    let products = Store.get('products', []);
    
    // 如果没有产品数据或强制重置，添加示例产品
    if (products.length === 0 || forceReset) {
        console.log(isOnlineDeployment ? '检测到在线部署环境，强制初始化模拟数据' : '本地环境初始化数据');
        
        // 清除重置标记
        localStorage.removeItem('forceDoraemonReset');
        
        products = [
            { id: 1, name: '竹蜻蜓', category: '飞行道具', unit: '个', costPrice: 350, sellPrice: 699 },
            { id: 2, name: '任意门', category: '空间道具', unit: '个', costPrice: 650, sellPrice: 1299 },
            { id: 3, name: '时光机', category: '时间道具', unit: '台', costPrice: 880, sellPrice: 1699 },
            { id: 4, name: '四次元口袋', category: '空间道具', unit: '个', costPrice: 1200, sellPrice: 2499 },
            { id: 5, name: '记忆面包', category: '学习道具', unit: '片', costPrice: 25, sellPrice: 49 },
            { id: 6, name: '翻译蒟蒻', category: '语言道具', unit: '个', costPrice: 45, sellPrice: 89 },
            { id: 7, name: '如意电话亭', category: '通讯道具', unit: '个', costPrice: 170, sellPrice: 349 },
            { id: 8, name: '缩小灯', category: '变形道具', unit: '个', costPrice: 120, sellPrice: 249 },
            { id: 9, name: '透明斗篷', category: '隐身道具', unit: '件', costPrice: 250, sellPrice: 499 },
            { id: 10, name: '穿透环', category: '空间道具', unit: '对', costPrice: 85, sellPrice: 169 },
            { id: 11, name: '石头帽', category: '防护道具', unit: '顶', costPrice: 65, sellPrice: 129 },
            { id: 12, name: '透视眼镜', category: '视觉道具', unit: '副', costPrice: 95, sellPrice: 199 },
            { id: 13, name: '空气炮', category: '武器道具', unit: '个', costPrice: 110, sellPrice: 219 },
            { id: 14, name: '钻地洞', category: '空间道具', unit: '个', costPrice: 140, sellPrice: 279 },
            { id: 15, name: '时间布', category: '时间道具', unit: '块', costPrice: 230, sellPrice: 459 },
            { id: 16, name: '速度光线枪', category: '速度道具', unit: '把', costPrice: 320, sellPrice: 639 },
            { id: 17, name: '变声糖', category: '变形道具', unit: '盒', costPrice: 40, sellPrice: 79 },
            { id: 18, name: '梦境摄影机', category: '影像道具', unit: '台', costPrice: 260, sellPrice: 529 },
            { id: 19, name: '气象棒', category: '气象道具', unit: '根', costPrice: 130, sellPrice: 259 },
            { id: 20, name: '超能力手套', category: '超能力道具', unit: '对', costPrice: 180, sellPrice: 369 },
            { id: 21, name: '友谊纽扣', category: '情感道具', unit: '对', costPrice: 60, sellPrice: 119 },
            { id: 22, name: '记忆气球', category: '记忆道具', unit: '个', costPrice: 90, sellPrice: 179 },
            { id: 23, name: '遗忘草', category: '记忆道具', unit: '株', costPrice: 75, sellPrice: 149 },
            { id: 24, name: '对话糖', category: '语言道具', unit: '盒', costPrice: 55, sellPrice: 109 },
            { id: 25, name: '增强饼干', category: '力量道具', unit: '盒', costPrice: 85, sellPrice: 169 },
            { id: 26, name: '如果电话亭', category: '空间道具', unit: '个', costPrice: 420, sellPrice: 839 },
            { id: 27, name: '倒霉棒', category: '命运道具', unit: '根', costPrice: 70, sellPrice: 139 },
            { id: 28, name: '传送门', category: '空间道具', unit: '个', costPrice: 380, sellPrice: 759 },
            { id: 29, name: '复制镜', category: '复制道具', unit: '面', costPrice: 290, sellPrice: 579 },
            { id: 30, name: '绝对安全帽', category: '防护道具', unit: '顶', costPrice: 150, sellPrice: 299 }
        ];
        Store.set('products', products);
        
        // 标记已初始化
        localStorage.setItem('productsInitialized', 'true');
        
        // 初始化库存数据
        const inventory = products.map(product => {
            return {
                productId: product.id,
                quantity: Math.floor(Math.random() * 50) + 30, // 随机初始库存 30-80
                avgCost: product.costPrice,
                lastUpdate: new Date().toISOString()
            };
        });
        Store.set('inventory', inventory);
        
        // 生成模拟交易记录
        const transactions = generateMayTransactions(products);
        Store.set('transactions', transactions);
        
        console.log('✅ 已初始化30个产品和完整模拟数据');
        console.log('📦 产品数量:', products.length);
        console.log('📊 交易记录数量:', transactions.length);
        console.log('🏪 库存记录数量:', inventory.length);
    } else {
        console.log('使用现有数据，产品数量:', products.length);
        const transactions = Store.get('transactions', []);
        console.log('现有交易记录数量:', transactions.length);
    }
}

// 生成5月份的交易记录
function generateMayTransactions(products) {
    const transactions = [];
    let transactionId = 1;
    
    // 限制日期范围，避免生成过多数据
    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth(), Math.max(1, today.getDate() - 7)); // 只生成过去7天的数据
    const endDate = new Date(today);
    
    console.log(`生成交易记录，日期范围: ${startDate.toDateString()} 到 ${endDate.toDateString()}`);
    
    // 每天生成销售记录
    for (let currentDate = new Date(startDate); currentDate <= endDate; currentDate.setDate(currentDate.getDate() + 1)) {
        // 每天销售3-6个商品（减少数量）
        const dailySalesCount = Math.floor(Math.random() * 4) + 3;
        
        for (let i = 0; i < dailySalesCount; i++) {
            // 随机选择产品
            const randomProduct = products[Math.floor(Math.random() * products.length)];
            
            // 节假日和周末销量增加
            const isWeekend = (currentDate.getDay() === 0 || currentDate.getDay() === 6);
            const multiplier = isWeekend ? 1.2 : 1;
            
            // 随机销售数量，减少数量
            const randomQuantity = Math.ceil((Math.floor(Math.random() * 3) + 1) * multiplier);
            
            // 生成随机时间
            const hour = Math.floor(Math.random() * 10) + 9; // 9点到19点
            const minute = Math.floor(Math.random() * 60);
            const saleDate = new Date(currentDate);
            saleDate.setHours(hour, minute, 0);
            
            // 添加销售记录
            transactions.push({
                id: transactionId++,
                date: saleDate.toISOString(),
                type: 'sale',
                productId: randomProduct.id,
                quantity: randomQuantity,
                price: randomProduct.sellPrice,
                remark: isWeekend ? '周末促销' : '日常销售'
            });
        }
        
        // 偶尔加入损耗记录 (10%的概率，减少频率)
        if (Math.random() < 0.1) {
            const randomProduct = products[Math.floor(Math.random() * products.length)];
            const lossDate = new Date(currentDate);
            lossDate.setHours(20, 0, 0);
            
            transactions.push({
                id: transactionId++,
                date: lossDate.toISOString(),
                type: 'damage',
                productId: randomProduct.id,
                quantity: Math.floor(Math.random() * 2) + 1,
                price: randomProduct.costPrice,
                remark: '展示损耗'
            });
        }
    }
    
    // 只在周一生成一次补货记录
    const monday = new Date(startDate);
    while (monday.getDay() !== 1) {
        monday.setDate(monday.getDate() + 1);
    }
    
    if (monday <= endDate) {
        // 补货5-8种商品（减少数量）
        const restockCount = Math.floor(Math.random() * 4) + 5;
        const restockProducts = new Set();
        
        while (restockProducts.size < restockCount) {
            const randomIndex = Math.floor(Math.random() * products.length);
            restockProducts.add(randomIndex);
        }
        
        [...restockProducts].forEach(productIndex => {
            const product = products[productIndex];
            const restockDate = new Date(monday);
            restockDate.setHours(8, 0, 0);
            
            transactions.push({
                id: transactionId++,
                date: restockDate.toISOString(),
                type: 'purchase',
                productId: product.id,
                quantity: Math.floor(Math.random() * 15) + 10, // 10-25个单位
                price: product.costPrice,
                remark: '每周例行补货'
            });
        });
    }
    
    // 按日期排序
    transactions.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    console.log(`已生成${transactions.length}条交易记录`);
    return transactions;
}

// 工具函数
const Utils = {
    // 格式化日期为 YYYY-MM-DD
    formatDate: function(dateStr) {
        const date = new Date(dateStr);
        return date.toISOString().split('T')[0];
    },
    
    // 格式化日期时间为本地格式
    formatDateTime: function(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleString();
    },
    
    // 格式化金额为人民币格式
    formatCurrency: function(amount) {
        return '¥' + parseFloat(amount).toFixed(2);
    },
    
    // 获取当前日期的 YYYY-MM-DD 格式
    getCurrentDate: function() {
        return new Date().toISOString().split('T')[0];
    },
    
    // 获取当前月份的 YYYY-MM 格式
    getCurrentMonth: function() {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    },
    
    // 生成唯一ID
    generateId: function(array) {
        if (array.length === 0) return 1;
        return Math.max(...array.map(item => item.id)) + 1;
    }
};

// 页面导航控制
function setupNavigation() {
    console.log('设置导航...');
    
    const navLinks = document.querySelectorAll('nav ul li a, #logoLink'); // 包含logo链接
    const pages = document.querySelectorAll('.page');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 获取目标页面ID
            const targetPageId = this.getAttribute('href').substring(1);
            console.log(`导航点击: ${targetPageId}`);
            
            // 调用统一的页面导航函数
            navigateToPage(targetPageId);
        });
    });
    
    console.log(`已设置${navLinks.length}个导航链接`);
}

// 初始化日期显示
function setupDateDisplay() {
    const dateDisplay = document.getElementById('currentDate');
    const now = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
    dateDisplay.textContent = now.toLocaleDateString('zh-CN', options);
}

// 仪表盘功能
let dashboardUpdateInProgress = false; // 防止重复更新的标志

function updateDashboard() {
    // 防止重复更新
    if (dashboardUpdateInProgress) {
        console.log('仪表盘更新正在进行中，跳过重复调用');
        return;
    }
    
    dashboardUpdateInProgress = true;
    console.log('开始更新仪表盘...');
    
    try {
        // 更新数据卡片（不依赖图表）
        updateDashboardCards();
        
        // 检查 Chart.js 是否已加载
        if (typeof Chart === 'undefined') {
            console.warn('Chart.js 未加载，等待加载完成后再渲染图表...');
            waitForChart(() => {
                console.log('Chart.js 加载完成，现在渲染图表...');
                renderSalesTrendChart();
                renderTopProductsChart();
                dashboardUpdateInProgress = false; // 重置标志
            });
        } else {
            console.log('Chart.js 已加载，直接渲染图表...');
            renderSalesTrendChart();
            renderTopProductsChart();
            dashboardUpdateInProgress = false; // 重置标志
        }
        
        // 渲染库存预警表格（不依赖图表）
        renderLowStockTable();
        
        console.log('仪表盘更新完成');
    } catch (error) {
        console.error('仪表盘更新出错:', error);
        dashboardUpdateInProgress = false; // 出错时也要重置标志
    }
}

// 更新仪表盘卡片数据
function updateDashboardCards() {
    const transactions = Store.get('transactions', []);
    const products = Store.get('products', []);
    const inventory = Store.get('inventory', []);
    
    // 获取今天的日期（YYYY-MM-DD格式）
    const today = Utils.getCurrentDate();
    
    // 计算今日销售额
    const todaySales = transactions
        .filter(t => t.type === 'sale' && Utils.formatDate(t.date) === today)
        .reduce((sum, t) => sum + (t.price * t.quantity), 0);
    
    // 获取当前月份
    const currentMonth = Utils.getCurrentMonth();
    
    // 计算本月销售额
    const monthSales = transactions
        .filter(t => t.type === 'sale' && Utils.formatDate(t.date).startsWith(currentMonth))
        .reduce((sum, t) => sum + (t.price * t.quantity), 0);
    
    // 计算库存总价值
    const inventoryValue = inventory.reduce((sum, item) => {
        return sum + (item.avgCost * item.quantity);
    }, 0);
    
    // 更新DOM
    document.getElementById('todaySales').textContent = Utils.formatCurrency(todaySales);
    document.getElementById('monthSales').textContent = Utils.formatCurrency(monthSales);
    document.getElementById('totalProducts').textContent = products.length;
    document.getElementById('inventoryValue').textContent = Utils.formatCurrency(inventoryValue);
}

// 渲染销售趋势图表
function renderSalesTrendChart() {
    if (typeof Chart === 'undefined') {
        console.warn('Chart.js尚未加载，无法渲染销售趋势图表');
        return;
    }
    
    try {
        console.log('尝试渲染销售趋势图表...');
        
        // 获取最近15天的数据
        const transactions = Store.get('transactions', []);
        const today = new Date();
        const twoWeeksAgo = new Date(today);
        twoWeeksAgo.setDate(today.getDate() - 14);
        
        // 筛选近15天的销售数据
        const recentSales = transactions.filter(t => {
            const transDate = new Date(t.date);
            return t.type === 'sale' && transDate >= twoWeeksAgo;
        });
        
        // 如果没有足够的数据，生成示例数据
        let salesByDay = {};
        let labels = [];
        
        if (recentSales.length < 5) {
            console.log('销售数据不足，生成示例数据');
            
            // 生成过去15天的日期标签
            for (let i = 14; i >= 0; i--) {
                const date = new Date(today);
                date.setDate(today.getDate() - i);
                const dateStr = date.toISOString().split('T')[0];
                labels.push(dateStr.substring(5)); // 只显示月-日
                
                // 生成随机销售额 (1000-8000)
                salesByDay[dateStr] = Math.floor(Math.random() * 7000) + 1000;
            }
        } else {
            // 处理实际数据
            console.log('使用实际销售数据');
            
            // 获取日期范围
            for (let i = 14; i >= 0; i--) {
                const date = new Date(today);
                date.setDate(today.getDate() - i);
                const dateStr = date.toISOString().split('T')[0];
                labels.push(dateStr.substring(5)); // 只显示月-日
                salesByDay[dateStr] = 0; // 初始化为0
            }
            
            // 计算每天的销售总额
            recentSales.forEach(sale => {
                const dateStr = new Date(sale.date).toISOString().split('T')[0];
                if (salesByDay[dateStr] !== undefined) {
                    salesByDay[dateStr] += sale.price * sale.quantity;
                }
            });
        }
        
        // 准备图表数据
        const salesData = Object.values(salesByDay);
        
        // 创建图表配置
        const config = {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: '日销售额 (¥)',
                    data: salesData,
                    backgroundColor: 'rgba(30, 144, 255, 0.2)',  // 哆啦A梦蓝色半透明
                    borderColor: '#1E90FF',  // 哆啦A梦蓝色
                    borderWidth: 2,
                    pointBackgroundColor: '#1E90FF',
                    pointBorderColor: '#fff',
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    tension: 0.3,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            font: {
                                size: 12,
                                family: "'Microsoft YaHei', sans-serif"
                            }
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed.y !== null) {
                                    label += new Intl.NumberFormat('zh-CN', { 
                                        style: 'currency', 
                                        currency: 'CNY',
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 0
                                    }).format(context.parsed.y);
                                }
                                return label;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            font: {
                                size: 10,
                                family: "'Microsoft YaHei', sans-serif"
                            }
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        },
                        ticks: {
                            font: {
                                size: 10,
                                family: "'Microsoft YaHei', sans-serif"
                            },
                            callback: function(value) {
                                return '¥' + value.toLocaleString('zh-CN');
                            }
                        }
                    }
                }
            }
        };
        
        // 渲染图表
        const salesTrendChart = safeCreateChart('salesTrendChart', config, '销售趋势图');
        console.log('销售趋势图表渲染完成');
        
    } catch (error) {
        console.error('渲染销售趋势图表时出错:', error);
    }
}

// 渲染畅销产品图表
function renderTopProductsChart() {
    console.log('开始渲染热销商品图表...');
    
    // 检查 Chart.js 是否已加载
    if (typeof Chart === 'undefined') {
        console.warn('Chart.js 未加载，无法创建热销商品图表');
        return;
    }
    
    // 检查画布元素是否存在
    const ctx = document.getElementById('topProductsChart');
    if (!ctx) {
        console.error('找不到热销商品图表画布元素');
        return;
    }
    
    const transactions = Store.get('transactions', []);
    const products = Store.get('products', []);
    
    console.log(`获取到 ${transactions.length} 条交易记录，${products.length} 个产品`);
    
    // 获取当前月份
    const currentMonth = Utils.getCurrentMonth();
    console.log(`当前月份: ${currentMonth}`);
    
    // 按产品ID计算销售总额
    const salesByProduct = {};
    
    const monthSales = transactions.filter(t => t.type === 'sale' && Utils.formatDate(t.date).startsWith(currentMonth));
    console.log(`本月销售记录: ${monthSales.length} 条`);
    
    monthSales.forEach(t => {
        if (!salesByProduct[t.productId]) {
            salesByProduct[t.productId] = 0;
        }
        salesByProduct[t.productId] += t.price * t.quantity;
    });
    
    // 转换为数组并排序
    const productSales = Object.keys(salesByProduct).map(productId => {
        const product = products.find(p => p.id === parseInt(productId));
        return {
            id: parseInt(productId),
            name: product ? product.name : '未知产品',
            sales: salesByProduct[productId]
        };
    }).sort((a, b) => b.sales - a.sales).slice(0, 5); // 只显示前5名
    
    console.log('热销商品数据:', productSales);
    
    // 准备图表数据
    const labels = productSales.map(p => p.name);
    const data = productSales.map(p => p.sales);
    
    console.log('图表标签:', labels);
    console.log('图表数据:', data);
    
    // 安全销毁现有图表（如果存在）
    if (window.topProductsChart && typeof window.topProductsChart.destroy === 'function') {
        try {
            window.topProductsChart.destroy();
            console.log('已销毁现有热销商品图表');
        } catch (error) {
            console.warn('销毁现有图表时出错:', error);
        }
    }
    
    // 图表配置
    const config = {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: '销售额 (¥)',
                data: data,
                backgroundColor: [
                    'rgba(194, 51, 47, 0.7)',
                    'rgba(233, 180, 76, 0.7)',
                    'rgba(155, 41, 21, 0.7)',
                    'rgba(58, 96, 110, 0.7)',
                    'rgba(86, 59, 128, 0.7)'
                ],
                borderColor: [
                    'rgba(194, 51, 47, 1)',
                    'rgba(233, 180, 76, 1)',
                    'rgba(155, 41, 21, 1)',
                    'rgba(58, 96, 110, 1)',
                    'rgba(86, 59, 128, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false, // 允许图表填满容器
            interaction: {
                intersect: false,
                mode: 'nearest'
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return Utils.formatCurrency(context.parsed.x);
                        }
                    }
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    grid: {
                        display: true,
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    ticks: {
                        callback: function(value) {
                            return '¥' + value;
                        }
                    }
                },
                y: {
                    grid: {
                        display: false
                    }
                }
            },
            layout: {
                padding: {
                    left: 10,
                    right: 10,
                    top: 10,
                    bottom: 10
                }
            }
        }
    };
    
    // 创建图表
    try {
        window.topProductsChart = new Chart(ctx, config);
        console.log('✅ 热销商品图表创建成功');
    } catch (error) {
        console.error('❌ 热销商品图表创建失败:', error);
    }
}

// 渲染库存预警表格
function renderLowStockTable() {
    const products = Store.get('products', []);
    const inventory = Store.get('inventory', []);
    const tableBody = document.querySelector('#lowStockTable tbody');
    
    if (!tableBody) return;
    
    // 清空表格
    tableBody.innerHTML = '';
    
    // 找出需要预警的商品（负库存或低于20的商品）
    const alertItems = inventory.filter(item => item.quantity < 20);
    
    if (alertItems.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="4" style="text-align: center;">暂无库存预警</td></tr>';
        return;
    }
    
    // 按库存数量排序，负库存优先显示
    alertItems.sort((a, b) => a.quantity - b.quantity);
    
    alertItems.forEach(item => {
        const product = products.find(p => p.id === item.productId);
        if (!product) return;
        
        const row = document.createElement('tr');
        
        let statusClass = '';
        let statusText = '';
        let quantityDisplay = `${item.quantity} ${product.unit}`;
        
        if (item.quantity < 0) {
            statusClass = 'status-negative';
            statusText = '负库存';
            quantityDisplay = `<span class="negative-quantity">${item.quantity} ${product.unit}</span>`;
            row.className = 'negative-stock';
        } else if (item.quantity <= 5) {
            statusClass = 'status-critical';
            statusText = '严重不足';
            row.className = 'critical-stock';
        } else if (item.quantity <= 10) {
            statusClass = 'status-warning';
            statusText = '库存不足';
            row.className = 'warning-stock';
        } else {
            statusClass = 'status-low';
            statusText = '库存偏低';
            row.className = 'low-stock';
        }
        
        row.innerHTML = `
            <td data-label="商品名称">${product.name}</td>
            <td data-label="分类">${product.category}</td>
            <td data-label="当前库存">${quantityDisplay}</td>
            <td data-label="状态"><span class="${statusClass}">${statusText}</span></td>
        `;
        
        tableBody.appendChild(row);
    });
}

// 产品管理功能
function renderProductsTable() {
    const products = Store.get('products', []);
    const productsList = document.getElementById('productsList');
    
    // 清空表格
    productsList.innerHTML = '';
    
    // 添加产品行
    products.forEach(product => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td data-label="ID">${product.id}</td>
            <td data-label="产品名称">${product.name}</td>
            <td data-label="类别">${product.category}</td>
            <td data-label="单位">${product.unit}</td>
            <td data-label="参考进价">${Utils.formatCurrency(product.costPrice)}</td>
            <td data-label="建议售价">${Utils.formatCurrency(product.sellPrice)}</td>
            <td data-label="操作">
                <button class="btn-secondary edit-product" data-id="${product.id}">编辑</button>
                <button class="btn-danger delete-product" data-id="${product.id}">删除</button>
            </td>
        `;
        
        productsList.appendChild(row);
    });
    
    // 添加编辑和删除事件
    addProductEventListeners();
}

// 添加产品表格的事件监听器
function addProductEventListeners() {
    // 编辑产品按钮
    document.querySelectorAll('.edit-product').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            openProductModal(productId);
        });
    });
    
    // 删除产品按钮
    document.querySelectorAll('.delete-product').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            if (confirm('确定要删除这个产品吗？这将同时删除相关的库存和交易记录。')) {
                deleteProduct(productId);
            }
        });
    });
}

// 设置产品模态框事件
function setupProductModal() {
    const modal = document.getElementById('productModal');
    if (!modal) {
        console.warn('找不到productModal元素，跳过产品模态框设置');
        return;
    }
    
    const closeBtn = modal.querySelector('.close');
    const cancelBtn = document.getElementById('cancelProductBtn');
    const productForm = document.getElementById('productForm');
    
    // 关闭模态框
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    } else {
        console.warn('找不到产品模态框的关闭按钮(.close)');
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    } else {
        console.warn('找不到cancelProductBtn元素');
    }
    
    // 点击模态框外部关闭
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // 产品表单提交
    if (productForm) {
        productForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveProduct();
        });
    } else {
        console.warn('找不到productForm元素');
    }
}

// 打开产品编辑模态框
function openProductModal(productId = null) {
    console.log('打开产品模态框', productId ? '编辑ID:' + productId : '添加新产品');
    
    // 重置表单
    const form = document.getElementById('productForm');
    form.reset();
    
    // 重置隐藏字段
    document.getElementById('productId').value = '';
    
    // 隐藏删除按钮（默认情况下）
    const deleteBtn = document.getElementById('deleteProductBtn');
    if (deleteBtn) {
        deleteBtn.style.display = 'none';
    }
    
    // 设置标题
    const title = document.getElementById('productModalTitle');
    title.textContent = '添加新产品';
    
    // 如果是编辑现有产品
    const products = Store.get('products', []);
    
    if (productId) {
        // 编辑现有产品
        const product = products.find(p => p.id === productId);
        if (product) {
            document.getElementById('productId').value = product.id;
            document.getElementById('productName').value = product.name;
            document.getElementById('productCategory').value = product.category;
            document.getElementById('unit').value = product.unit;
            document.getElementById('costPrice').value = product.costPrice;
            document.getElementById('sellPrice').value = product.sellPrice;
            
            title.textContent = '编辑产品';
            if (deleteBtn) {
                deleteBtn.style.display = 'inline-block';
            }
        }
    }
    
    // 显示模态框
    const modal = document.getElementById('productModal');
    modal.style.display = 'block';
}

// 保存产品数据
function saveProduct() {
    console.log('保存产品');
    
    // 获取表单数据
    const productId = document.getElementById('productId').value;
    const name = document.getElementById('productName').value.trim();
    const category = document.getElementById('productCategory').value;
    const unit = document.getElementById('unit').value.trim();
    const costPrice = parseFloat(document.getElementById('costPrice').value);
    const sellPrice = parseFloat(document.getElementById('sellPrice').value);
    
    // 验证输入
    if (!name || !unit || isNaN(costPrice) || isNaN(sellPrice)) {
        alert('请填写所有必填字段！');
        return;
    }
    
    // 获取现有产品
    const products = Store.get('products', []);
    
    if (productId) {
        // 更新现有产品
        const id = parseInt(productId);
        const index = products.findIndex(p => p.id === id);
        
        if (index !== -1) {
            products[index] = {
                id,
                name,
                category,
                unit,
                costPrice,
                sellPrice
            };
        }
    } else {
        // 添加新产品
        const newId = Utils.generateId(products);
        
        products.push({
            id: newId,
            name,
            category,
            unit,
            costPrice,
            sellPrice
        });
        
        // 为新产品初始化库存
        const inventory = Store.get('inventory', []);
        inventory.push({
            productId: newId,
            quantity: 0,
            avgCost: costPrice,
            lastUpdate: new Date().toISOString()
        });
        
        Store.set('inventory', inventory);
    }
    
    // 保存产品数据
    Store.set('products', products);
    
    // 关闭模态框
    document.getElementById('productModal').style.display = 'none';
    
    // 刷新产品表格
    renderProductsTable();
}

// 删除产品
function deleteProduct(productId) {
    // 获取现有数据
    let products = Store.get('products', []);
    let inventory = Store.get('inventory', []);
    let transactions = Store.get('transactions', []);
    
    // 删除产品
    products = products.filter(p => p.id !== productId);
    
    // 删除相关库存
    inventory = inventory.filter(i => i.productId !== productId);
    
    // 删除相关交易记录
    transactions = transactions.filter(t => t.productId !== productId);
    
    // 保存更新后的数据
    Store.set('products', products);
    Store.set('inventory', inventory);
    Store.set('transactions', transactions);
    
    // 刷新产品表格
    renderProductsTable();
    
    // 更新其他相关视图
    updateDashboard();
}

// 库存管理功能
function renderInventoryTable() {
    const inventory = Store.get('inventory', []);
    const products = Store.get('products', []);
    const inventoryList = document.getElementById('inventoryList');
    
    // 清空表格
    inventoryList.innerHTML = '';
    
    // 填充库存数据
    inventory.forEach(item => {
        const product = products.find(p => p.id === item.productId);
        if (!product) return; // 跳过找不到产品的记录
        
        const row = document.createElement('tr');
        
        const totalValue = item.avgCost * item.quantity;
        
        // 根据库存数量设置状态和样式
        let stockStatus = '';
        let stockClass = '';
        let quantityDisplay = `${item.quantity} ${product.unit}`;
        
        if (item.quantity < 0) {
            stockStatus = '<span class="status-negative">负库存</span>';
            stockClass = 'negative-stock';
            quantityDisplay = `<span class="negative-quantity">${item.quantity} ${product.unit}</span>`;
        } else if (item.quantity <= 5) {
            stockStatus = '<span class="status-critical">严重不足</span>';
            stockClass = 'critical-stock';
        } else if (item.quantity <= 10) {
            stockStatus = '<span class="status-warning">库存不足</span>';
            stockClass = 'warning-stock';
        } else if (item.quantity <= 20) {
            stockStatus = '<span class="status-low">库存偏低</span>';
            stockClass = 'low-stock';
        } else {
            stockStatus = '<span class="status-normal">正常</span>';
            stockClass = 'normal-stock';
        }
        
        row.className = stockClass;
        row.innerHTML = `
            <td data-label="产品名称">${product.name}</td>
            <td data-label="分类">${product.category}</td>
            <td data-label="库存数量">${quantityDisplay}</td>
            <td data-label="单位">${product.unit}</td>
            <td data-label="平均成本">${Utils.formatCurrency(item.avgCost)}</td>
            <td data-label="总价值">${Utils.formatCurrency(totalValue)}</td>
            <td data-label="状态">${stockStatus}</td>
            <td data-label="最后更新">${Utils.formatDateTime(item.lastUpdate)}</td>
            <td data-label="操作">
                <button class="btn-secondary adjust-inventory" data-id="${item.productId}">调整</button>
            </td>
        `;
        
        inventoryList.appendChild(row);
    });
    
    // 添加调整库存事件
    document.querySelectorAll('.adjust-inventory').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            openInventoryModal(productId);
        });
    });
    
    // 设置搜索功能
    setupInventorySearch();
}

// 设置库存搜索功能
function setupInventorySearch() {
    const searchInput = document.getElementById('inventorySearch');
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const rows = document.querySelectorAll('#inventoryList tr');
        
        rows.forEach(row => {
            const productName = row.querySelector('td:first-child').textContent.toLowerCase();
            const category = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
            
            if (productName.includes(searchTerm) || category.includes(searchTerm)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    });
}

// 设置库存调整模态框
function setupInventoryModal() {
    const modal = document.getElementById('inventoryModal');
    if (!modal) {
        console.warn('找不到inventoryModal元素，跳过库存模态框设置');
        return;
    }
    
    const closeBtn = modal.querySelector('.close');
    const cancelBtn = document.getElementById('cancelInventoryBtn');
    const form = document.getElementById('inventoryForm');
    const inventoryProductName = document.getElementById('inventoryProductId'); // 修正元素ID
    
    // 填充产品下拉菜单
    populateProductSelect('inventoryProductId'); // 修正元素ID
    
    // 当选择不同产品时，更新当前库存显示
    if (inventoryProductName) {
        inventoryProductName.addEventListener('change', function() {
            const productId = parseInt(this.value);
            updateCurrentStockDisplay(productId);
        });
    } else {
        console.warn('找不到inventoryProductName元素');
    }
    
    // 关闭模态框
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    } else {
        console.warn('找不到库存模态框的关闭按钮(.close)');
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    } else {
        console.warn('找不到cancelInventoryBtn元素');
    }
    
    // 点击模态框外部关闭
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // 库存调整表单提交
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            adjustInventory();
        });
    } else {
        console.warn('找不到inventoryForm元素');
    }
}

// 打开库存调整模态框
function openInventoryModal(productId = null) {
    const modal = document.getElementById('inventoryModal');
    const form = document.getElementById('inventoryForm');
    const productSelect = document.getElementById('inventoryProductId'); // 修正元素ID
    
    // 重置表单
    form.reset();
    
    if (productId) {
        // 预先选择指定的产品
        productSelect.value = productId;
        document.getElementById('inventoryProductId').value = productId;
        
        // 更新当前库存显示
        updateCurrentStockDisplay(productId);
    } else {
        // 默认选择第一个产品并更新库存显示
        if (productSelect.options.length > 0) {
            const firstProductId = parseInt(productSelect.options[0].value);
            updateCurrentStockDisplay(firstProductId);
        }
    }
    
    // 显示模态框
    modal.style.display = 'block';
}

// 更新当前库存显示
function updateCurrentStockDisplay(productId) {
    const inventory = Store.get('inventory', []);
    const item = inventory.find(i => i.productId === productId);
    const products = Store.get('products', []);
    const product = products.find(p => p.id === productId);
    
    const currentStockDiv = document.getElementById('currentStock');
    
    if (item && product) {
        currentStockDiv.textContent = `${item.quantity} ${product.unit}`;
    } else {
        currentStockDiv.textContent = '0';
    }
}

// 填充产品下拉菜单
function populateProductSelect(selectId) {
    const select = document.getElementById(selectId);
    const products = Store.get('products', []);
    
    // 清空现有选项
    select.innerHTML = '';
    
    // 添加产品选项
    products.forEach(product => {
        const option = document.createElement('option');
        option.value = product.id;
        option.textContent = product.name;
        select.appendChild(option);
    });
}

// 调整库存
function adjustInventory() {
    const productSelect = document.getElementById('inventoryProductId');
    const productId = parseInt(productSelect.value);
    const adjustmentType = document.getElementById('adjustmentType').value;
    const adjustmentQuantity = parseInt(document.getElementById('adjustmentQuantity').value);
    const reason = document.getElementById('adjustmentReason').value.trim();
    
    console.log('调整库存参数:', { productId, adjustmentType, adjustmentQuantity, reason });
    
    // 验证输入
    if (!productId || isNaN(adjustmentQuantity) || adjustmentQuantity < 0 || !reason) {
        alert('请填写所有必填字段！');
        return;
    }
    
    // 获取当前库存
    const inventory = Store.get('inventory', []);
    const inventoryIndex = inventory.findIndex(i => i.productId === productId);
    
    if (inventoryIndex === -1) {
        alert('找不到该产品的库存记录！');
        return;
    }
    
    const currentItem = inventory[inventoryIndex];
    const currentQuantity = currentItem.quantity;
    let newQuantity = currentQuantity;
    
    // 根据调整类型计算新库存
    switch (adjustmentType) {
        case 'add':
            newQuantity = currentQuantity + adjustmentQuantity;
            break;
        case 'subtract':
            newQuantity = Math.max(0, currentQuantity - adjustmentQuantity);
            break;
        case 'set':
            newQuantity = adjustmentQuantity;
            break;
    }
    
    // 更新库存
    inventory[inventoryIndex] = {
        ...currentItem,
        quantity: newQuantity,
        lastUpdate: new Date().toISOString()
    };
    
    Store.set('inventory', inventory);
    
    // 如果是增加库存，添加一条采购记录
    if (adjustmentType === 'add' && adjustmentQuantity > 0) {
        const products = Store.get('products', []);
        const product = products.find(p => p.id === productId);
        
        if (product) {
            const transactions = Store.get('transactions', []);
            const newId = Utils.generateId(transactions);
            
            transactions.push({
                id: newId,
                date: new Date().toISOString(),
                type: 'purchase',
                productId: productId,
                quantity: adjustmentQuantity,
                price: product.costPrice,
                remark: '库存调整: ' + reason
            });
            
            Store.set('transactions', transactions);
        }
    }
    
    // 关闭模态框
    document.getElementById('inventoryModal').style.display = 'none';
    
    // 刷新库存表格
    renderInventoryTable();
    
    // 只在当前页面是仪表盘时才更新仪表盘
    const currentPage = document.querySelector('.page[style*="block"]') || document.querySelector('.page.active');
    if (currentPage && currentPage.id === 'dashboard') {
        updateDashboard();
    } else {
        console.log('当前不在仪表盘页面，跳过仪表盘更新');
    }
}

// 每日数据提交功能
function setupDailyEntryForm() {
    const form = document.getElementById('entryForm');
    const dateInput = document.getElementById('entryDate');
    const productSelect = document.getElementById('productId');
    const priceInput = document.getElementById('price');
    const typeSelect = document.getElementById('entryType');
    const quantityGroup = document.getElementById('quantityGroup');
    const productGroup = document.getElementById('productGroup');
    const expenseTypeGroup = document.getElementById('expenseTypeGroup');
    const priceLabel = document.getElementById('priceLabel');
    const quantityInput = document.getElementById('quantity');
    const expenseTypeSelect = document.getElementById('expenseType');
    
    // 设置日期为今天
    dateInput.value = Utils.getCurrentDate();
    
    // 填充产品下拉菜单
    populateProductSelect('productId');
    
    // 检查是否已经绑定过事件监听器，避免重复绑定
    if (!form.hasAttribute('data-events-bound')) {
        // 表单提交事件（只绑定一次）
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('表单提交事件触发');
            submitDailyEntry();
        });
        
        // 表单重置事件（只绑定一次）
        form.addEventListener('reset', function() {
            console.log('表单重置事件触发');
            setTimeout(() => {
                dateInput.value = Utils.getCurrentDate();
                populateProductSelect('productId');
                // 重置为默认状态（非费用）
                productGroup.style.display = 'block';
                quantityGroup.style.display = 'block';
                expenseTypeGroup.style.display = 'none';
                priceLabel.textContent = '单价 (¥) *:';
                document.getElementById('productId').setAttribute('required', 'required');
                document.getElementById('quantity').setAttribute('required', 'required');
                document.getElementById('expenseType').removeAttribute('required');
                
                // 清空价格字段
                document.getElementById('price').value = '';
                
                console.log('表单重置完成');
            }, 10);
        });
        
        // 设置表单事件监听器（只绑定一次）
        setupFormEventListeners();
        
        // 添加测试按钮事件监听器（用于调试）
        const submitButton = form.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.addEventListener('click', function(e) {
                console.log('提交按钮被点击');
                console.log('事件对象:', e);
                console.log('表单有效性:', form.checkValidity());
                
                // 检查所有必填字段
                const requiredFields = form.querySelectorAll('[required]');
                console.log('必填字段检查:');
                requiredFields.forEach(field => {
                    console.log(`${field.id}: ${field.value} (有效: ${field.checkValidity()})`);
                });
            });
        }
        
        // 标记事件已绑定
        form.setAttribute('data-events-bound', 'true');
        console.log('表单事件监听器已绑定');
    } else {
        console.log('表单事件监听器已存在，跳过绑定');
    }
}

// 根据产品和类型更新价格
function updatePriceBasedOnProductAndType() {
    const productId = parseInt(document.getElementById('productId').value);
    const entryType = document.getElementById('entryType').value;
    const priceInput = document.getElementById('price');
    
    const products = Store.get('products', []);
    const product = products.find(p => p.id === productId);
    
    if (product) {
        if (entryType === 'sale') {
            priceInput.value = product.sellPrice;
        } else if (entryType === 'purchase') {
            priceInput.value = product.costPrice;
        }
    }
}

// 提交每日数据
function submitDailyEntry() {
    console.log('=== submitDailyEntry 函数开始执行 ===');
    
    const date = document.getElementById('entryDate').value;
    const type = document.getElementById('entryType').value;
    const price = parseFloat(document.getElementById('price').value);
    const remark = document.getElementById('remark').value.trim();
    
    console.log('表单数据读取:', { 
        date, 
        type, 
        price: document.getElementById('price').value, 
        parsedPrice: price,
        remark 
    });
    
    // 检查表单元素是否存在
    const formElements = {
        entryDate: document.getElementById('entryDate'),
        entryType: document.getElementById('entryType'),
        price: document.getElementById('price'),
        remark: document.getElementById('remark')
    };
    
    console.log('表单元素检查:', formElements);
    
    console.log('提交数据验证:', { date, type, price, remark });
    
    // 根据类型进行不同的验证和处理
    if (type === 'expense') {
        // 费用支出验证
        const expenseType = document.getElementById('expenseType').value;
        
        console.log('费用支出验证:', { date, type, expenseType, price });
        
        // 验证必填字段
        if (!date) {
            alert('请选择日期！');
            return;
        }
        if (!type) {
            alert('请选择类型！');
            return;
        }
        if (!expenseType) {
            alert('请选择费用类型！');
            return;
        }
        if (isNaN(price) || price <= 0) {
            alert('请输入有效的金额（必须大于0）！');
            return;
        }
        
        // 创建费用记录
        const transactions = Store.get('transactions', []);
        const newId = Utils.generateId(transactions);
        
        // 获取费用类型的中文名称
        const expenseTypeNames = {
            'rent': '房租',
            'utilities': '水电费',
            'salary': '人工费',
            'packaging': '包装材料',
            'transport': '运输费',
            'maintenance': '设备维护',
            'marketing': '宣传费用',
            'other': '其他费用'
        };
        
        const expenseTypeName = expenseTypeNames[expenseType] || '其他费用';
        const finalRemark = remark || expenseTypeName;
        
        // 创建当前时间戳，但使用用户选择的日期
        const currentTime = new Date();
        const selectedDate = new Date(date);
        const recordTime = new Date(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            selectedDate.getDate(),
            currentTime.getHours(),
            currentTime.getMinutes(),
            currentTime.getSeconds(),
            currentTime.getMilliseconds()
        );
        
        const newTransaction = {
            id: newId,
            date: recordTime.toISOString(), // 使用包含当前时间的完整时间戳
            type: 'expense',
            productId: null, // 费用记录不关联产品
            quantity: 1, // 费用记录数量固定为1
            price: price, // 费用记录的price字段存储总金额
            remark: finalRemark,
            expenseType: expenseType // 额外字段记录费用类型
        };
        
        transactions.push(newTransaction);
        Store.set('transactions', transactions);
        
        console.log('费用记录已添加:', newTransaction);
        
        // 先重置表单，再显示成功消息
        resetFormSafely();
        alert('费用记录添加成功！');
        
    } else {
        // 商品相关交易验证
        const productId = parseInt(document.getElementById('productId').value);
        const quantity = parseInt(document.getElementById('quantity').value);
        
        console.log('商品交易验证:', { date, type, productId, quantity, price });
        
        // 验证必填字段
        if (!date) {
            alert('请选择日期！');
            return;
        }
        if (!type) {
            alert('请选择类型！');
            return;
        }
        if (!productId || isNaN(productId)) {
            alert('请选择产品！');
            return;
        }
        if (!quantity || isNaN(quantity) || quantity <= 0) {
            alert('请输入有效的数量（必须大于0）！');
            return;
        }
        if (isNaN(price) || price < 0) {
            alert('请输入有效的单价（不能为负数）！');
            return;
        }
        
        // 检查库存不足情况（仅对销售和损耗）
        if (type === 'sale' || type === 'damage') {
            const inventory = Store.get('inventory', []);
            const allProducts = Store.get('products', []); // 重命名避免作用域冲突
            const inventoryItem = inventory.find(i => i.productId === productId);
            const product = allProducts.find(p => p.id === productId);
            
            if (inventoryItem && inventoryItem.quantity < quantity) {
                const shortfall = quantity - inventoryItem.quantity;
                const productName = product ? product.name : '未知产品';
                const unit = product ? product.unit : '';
                
                const confirmMessage = `⚠️ 库存不足警告！\n\n` +
                    `商品：${productName}\n` +
                    `当前库存：${inventoryItem.quantity} ${unit}\n` +
                    `${type === 'sale' ? '销售' : '损耗'}数量：${quantity} ${unit}\n` +
                    `缺少：${shortfall} ${unit}\n\n` +
                    `继续操作将导致库存变为负数（${inventoryItem.quantity - quantity} ${unit}）。\n\n` +
                    `是否确认继续？\n` +
                    `• 点击"确定"：继续录入，库存将变为负数\n` +
                    `• 点击"取消"：返回修改数量`;
                
                if (!confirm(confirmMessage)) {
                    console.log('用户取消了库存不足的操作');
                    return; // 用户选择取消，不继续操作
                }
                
                console.log(`用户确认继续操作，库存将从 ${inventoryItem.quantity} 变为 ${inventoryItem.quantity - quantity}`);
            }
        }
        
        // 添加新的交易记录
        const transactions = Store.get('transactions', []);
        const newId = Utils.generateId(transactions);
        
        // 创建当前时间戳，但使用用户选择的日期
        const currentTime = new Date();
        const selectedDate = new Date(date);
        const recordTime = new Date(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            selectedDate.getDate(),
            currentTime.getHours(),
            currentTime.getMinutes(),
            currentTime.getSeconds(),
            currentTime.getMilliseconds()
        );
        
        const newTransaction = {
            id: newId,
            date: recordTime.toISOString(), // 使用包含当前时间的完整时间戳
            type,
            productId,
            quantity,
            price,
            remark
        };
        
        transactions.push(newTransaction);
        Store.set('transactions', transactions);
        
        // 更新库存（费用不影响库存）
        updateInventoryAfterTransaction(newTransaction);
        
        console.log('商品交易记录已添加:', newTransaction);
        
        // 先重置表单，再显示成功消息
        resetFormSafely();
        alert('交易记录添加成功！');
    }
    
    // 刷新今日记录表格
    renderDailyRecordsTable();
    
    // 只在当前页面是仪表盘时才更新仪表盘
    const currentPage = document.querySelector('.page[style*="block"]') || document.querySelector('.page.active');
    if (currentPage && currentPage.id === 'dashboard') {
        updateDashboard();
    } else {
        console.log('当前不在仪表盘页面，跳过仪表盘更新');
    }
}

// 安全重置表单函数
function resetFormSafely() {
    console.log('开始安全重置表单...');
    
    const form = document.getElementById('entryForm');
    
    // 重置表单
    form.reset();
    
    // 设置默认值
    document.getElementById('entryDate').value = Utils.getCurrentDate();
    
    // 重新填充产品下拉菜单
    populateProductSelect('productId');
    
    // 重置表单字段显示状态为默认（商品交易模式）
    document.getElementById('productGroup').style.display = 'block';
    document.getElementById('quantityGroup').style.display = 'block';
    document.getElementById('expenseTypeGroup').style.display = 'none';
    document.getElementById('priceLabel').textContent = '单价 (¥) *:';
    document.getElementById('productId').setAttribute('required', 'required');
    document.getElementById('quantity').setAttribute('required', 'required');
    document.getElementById('expenseType').removeAttribute('required');
    
    // 清空价格字段
    document.getElementById('price').value = '';
    
    console.log('表单重置完成');
}

// 设置表单事件监听器的独立函数
function setupFormEventListeners() {
    const productSelect = document.getElementById('productId');
    const typeSelect = document.getElementById('entryType');
    
    // 检查是否已经绑定过事件监听器，避免重复绑定
    if (productSelect.hasAttribute('data-events-bound') && typeSelect.hasAttribute('data-events-bound')) {
        console.log('表单事件监听器已存在，跳过重复绑定');
        return;
    }
    
    // 为产品选择添加事件监听器（只绑定一次）
    if (!productSelect.hasAttribute('data-events-bound')) {
        productSelect.addEventListener('change', updatePriceBasedOnProductAndType);
        productSelect.setAttribute('data-events-bound', 'true');
        console.log('产品选择事件监听器已绑定');
    }
    
    // 为类型选择添加事件监听器（只绑定一次）
    if (!typeSelect.hasAttribute('data-events-bound')) {
        typeSelect.addEventListener('change', handleTypeChange);
        typeSelect.setAttribute('data-events-bound', 'true');
        console.log('类型选择事件监听器已绑定');
    }
}

// 类型改变处理函数
function handleTypeChange() {
    const selectedType = this.value;
    const quantityGroup = document.getElementById('quantityGroup');
    const productGroup = document.getElementById('productGroup');
    const expenseTypeGroup = document.getElementById('expenseTypeGroup');
    const priceLabel = document.getElementById('priceLabel');
    const quantityInput = document.getElementById('quantity');
    const productSelect = document.getElementById('productId');
    const expenseTypeSelect = document.getElementById('expenseType');
    
    if (selectedType === 'expense') {
        // 费用支出：隐藏产品和数量，显示费用类型
        productGroup.style.display = 'none';
        quantityGroup.style.display = 'none';
        expenseTypeGroup.style.display = 'block';
        priceLabel.textContent = '金额 (¥) *:';
        
        // 移除产品和数量的必填要求，添加费用类型必填要求
        productSelect.removeAttribute('required');
        quantityInput.removeAttribute('required');
        expenseTypeSelect.setAttribute('required', 'required');
        quantityInput.value = '1'; // 设置默认值
        
        console.log('切换到费用支出模式');
    } else {
        // 其他类型：显示产品和数量，隐藏费用类型
        productGroup.style.display = 'block';
        quantityGroup.style.display = 'block';
        expenseTypeGroup.style.display = 'none';
        priceLabel.textContent = '单价 (¥) *:';
        
        // 恢复产品和数量的必填要求，移除费用类型必填要求
        productSelect.setAttribute('required', 'required');
        quantityInput.setAttribute('required', 'required');
        expenseTypeSelect.removeAttribute('required');
        
        // 根据产品和类型更新价格
        updatePriceBasedOnProductAndType();
        
        console.log('切换到商品交易模式');
    }
}

// 更新库存
function updateInventoryAfterTransaction(transaction) {
    const inventory = Store.get('inventory', []);
    const itemIndex = inventory.findIndex(i => i.productId === transaction.productId);
    
    if (itemIndex === -1) return; // 如果找不到库存项，不做任何操作
    
    const item = inventory[itemIndex];
    
    if (transaction.type === 'sale' || transaction.type === 'damage') {
        // 销售或损耗，减少库存（允许负数）
        const newQuantity = item.quantity - transaction.quantity;
        inventory[itemIndex] = {
            ...item,
            quantity: newQuantity,
            lastUpdate: transaction.date
        };
        
        console.log(`库存更新: ${item.quantity} → ${newQuantity} (${transaction.type === 'sale' ? '销售' : '损耗'} ${transaction.quantity})`);
    } else if (transaction.type === 'purchase') {
        // 采购，增加库存并重新计算平均成本
        const oldValue = item.quantity * item.avgCost;
        const newValue = transaction.quantity * transaction.price;
        const newQuantity = item.quantity + transaction.quantity;
        const newAvgCost = newQuantity > 0 ? (oldValue + newValue) / newQuantity : transaction.price;
        
        inventory[itemIndex] = {
            ...item,
            quantity: newQuantity,
            avgCost: newAvgCost,
            lastUpdate: transaction.date
        };
        
        console.log(`库存更新: ${item.quantity} → ${newQuantity} (采购 ${transaction.quantity})`);
    }
    
    Store.set('inventory', inventory);
}

// 渲染今日记录表格
function renderDailyRecordsTable() {
    console.log('开始渲染今日记录表格...');
    
    const transactions = Store.get('transactions', []);
    const products = Store.get('products', []);
    const tableBody = document.getElementById('dailyRecordsList');
    const today = Utils.getCurrentDate();
    
    if (!tableBody) {
        console.error('找不到今日记录表格元素');
        return;
    }
    
    // 清空表格
    tableBody.innerHTML = '';
    
    // 过滤今日记录
    const todayRecords = transactions.filter(t => Utils.formatDate(t.date) === today);
    console.log(`今日记录数量: ${todayRecords.length}`);
    
    if (todayRecords.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="8" style="text-align: center;">今日暂无记录</td></tr>';
        return;
    }
    
    // 限制显示数量，避免表格过长
    const maxRecords = 50; // 最多显示50条记录
    const displayRecords = todayRecords.slice(0, maxRecords);
    
    if (todayRecords.length > maxRecords) {
        console.warn(`今日记录过多(${todayRecords.length}条)，只显示最新的${maxRecords}条`);
    }
    
    // 添加记录行
    displayRecords.forEach(record => {
        const row = document.createElement('tr');
        let totalAmount = 0;
        let productName = '';
        let quantity = '';
        let unitPrice = '';
        
        // 根据类型设置样式和内容
        let typeText;
        let typeClass;
        
        switch (record.type) {
            case 'sale':
                typeText = '销售';
                typeClass = 'type-sale';
                const saleProduct = products.find(p => p.id === record.productId);
                if (saleProduct) {
                    productName = saleProduct.name;
                    quantity = `${record.quantity} ${saleProduct.unit}`;
                    unitPrice = Utils.formatCurrency(record.price);
                    totalAmount = record.price * record.quantity;
                } else {
                    productName = '未知产品';
                    quantity = `${record.quantity}`;
                    unitPrice = Utils.formatCurrency(record.price);
                    totalAmount = record.price * record.quantity;
                }
                break;
                
            case 'purchase':
                typeText = '采购';
                typeClass = 'type-purchase';
                const purchaseProduct = products.find(p => p.id === record.productId);
                if (purchaseProduct) {
                    productName = purchaseProduct.name;
                    quantity = `${record.quantity} ${purchaseProduct.unit}`;
                    unitPrice = Utils.formatCurrency(record.price);
                    totalAmount = record.price * record.quantity;
                } else {
                    productName = '未知产品';
                    quantity = `${record.quantity}`;
                    unitPrice = Utils.formatCurrency(record.price);
                    totalAmount = record.price * record.quantity;
                }
                break;
                
            case 'damage':
                typeText = '损耗';
                typeClass = 'type-damage';
                const damageProduct = products.find(p => p.id === record.productId);
                if (damageProduct) {
                    productName = damageProduct.name;
                    quantity = `${record.quantity} ${damageProduct.unit}`;
                    unitPrice = Utils.formatCurrency(record.price);
                    totalAmount = record.price * record.quantity;
                } else {
                    productName = '未知产品';
                    quantity = `${record.quantity}`;
                    unitPrice = Utils.formatCurrency(record.price);
                    totalAmount = record.price * record.quantity;
                }
                break;
                
            case 'expense':
                typeText = '费用';
                typeClass = 'type-expense';
                productName = record.remark || '其他费用';
                quantity = '-';
                unitPrice = '-';
                totalAmount = record.price;
                break;
                
            default:
                typeText = record.type;
                typeClass = '';
                const defaultProduct = products.find(p => p.id === record.productId);
                if (defaultProduct) {
                    productName = defaultProduct.name;
                    quantity = record.quantity ? `${record.quantity} ${defaultProduct.unit}` : '-';
                    unitPrice = record.price ? Utils.formatCurrency(record.price) : '-';
                    totalAmount = record.price * (record.quantity || 1);
                } else {
                    productName = record.remark || '未知项目';
                    quantity = record.quantity ? `${record.quantity}` : '-';
                    unitPrice = record.price ? Utils.formatCurrency(record.price) : '-';
                    totalAmount = record.price * (record.quantity || 1);
                }
        }
        
        row.innerHTML = `
            <td data-label="时间">${new Date(record.date).toLocaleTimeString()}</td>
            <td data-label="类型" class="${typeClass}">${typeText}</td>
            <td data-label="项目">${productName}</td>
            <td data-label="数量">${quantity}</td>
            <td data-label="单价">${unitPrice}</td>
            <td data-label="金额">${Utils.formatCurrency(totalAmount)}</td>
            <td data-label="备注">${record.remark || '-'}</td>
            <td data-label="操作">
                <button class="btn-danger delete-record" data-id="${record.id}">删除</button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // 如果记录被截断，添加提示
    if (todayRecords.length > maxRecords) {
        const infoRow = document.createElement('tr');
        infoRow.innerHTML = `
            <td colspan="8" style="text-align: center; background-color: #fff3cd; color: #856404; padding: 10px;">
                <strong>注意：</strong> 今日共有 ${todayRecords.length} 条记录，当前只显示最新的 ${maxRecords} 条
            </td>
        `;
        tableBody.appendChild(infoRow);
    }
    
    // 添加删除记录事件
    document.querySelectorAll('.delete-record').forEach(button => {
        button.addEventListener('click', function() {
            const recordId = parseInt(this.getAttribute('data-id'));
            if (confirm('确定要删除这条记录吗？这将同时更新相关库存。')) {
                deleteTransaction(recordId);
            }
        });
    });
    
    console.log(`今日记录表格渲染完成，显示 ${displayRecords.length} 条记录`);
}

// 删除交易记录
function deleteTransaction(transactionId) {
    const transactions = Store.get('transactions', []);
    const index = transactions.findIndex(t => t.id === transactionId);
    
    if (index === -1) return;
    
    const transaction = transactions[index];
    
    // 删除记录前，先恢复库存
    const inventory = Store.get('inventory', []);
    const itemIndex = inventory.findIndex(i => i.productId === transaction.productId);
    
    if (itemIndex !== -1) {
        const item = inventory[itemIndex];
        
        if (transaction.type === 'sale' || transaction.type === 'damage') {
            // 如果是销售或损耗记录，恢复库存数量
            inventory[itemIndex] = {
                ...item,
                quantity: item.quantity + transaction.quantity,
                lastUpdate: new Date().toISOString()
            };
        } else if (transaction.type === 'purchase') {
            // 如果是采购记录，计算新的平均成本和数量
            const newQuantity = Math.max(0, item.quantity - transaction.quantity);
            
            // 如果删除后数量为0，直接使用原来的平均成本
            let newAvgCost = item.avgCost;
            
            // 如果数量不为0，重新计算平均成本
            if (newQuantity > 0 && item.quantity > 0) {
                const oldTotalValue = item.quantity * item.avgCost;
                const transactionValue = transaction.quantity * transaction.price;
                newAvgCost = (oldTotalValue - transactionValue) / newQuantity;
            }
            
            inventory[itemIndex] = {
                ...item,
                quantity: newQuantity,
                avgCost: newAvgCost,
                lastUpdate: new Date().toISOString()
            };
        }
        
        Store.set('inventory', inventory);
    }
    
    // 删除记录
    transactions.splice(index, 1);
    Store.set('transactions', transactions);
    
    // 刷新表格
    renderDailyRecordsTable();
    
    // 只在当前页面是仪表盘时才更新仪表盘
    const currentPage = document.querySelector('.page[style*="block"]') || document.querySelector('.page.active');
    if (currentPage && currentPage.id === 'dashboard') {
        updateDashboard();
    } else {
        console.log('当前不在仪表盘页面，跳过仪表盘更新');
    }
}

// 销售管理功能
function setupSalesFilters() {
    const startDateInput = document.getElementById('salesStartDate');
    const endDateInput = document.getElementById('salesEndDate');
    const filterBtn = document.getElementById('filterSalesBtn');
    
    // 设置默认日期范围（本月）
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    
    startDateInput.value = Utils.formatDate(firstDay);
    endDateInput.value = Utils.getCurrentDate();
    
    // 筛选按钮点击事件
    filterBtn.addEventListener('click', function() {
        renderSalesTable();
    });
}

// 渲染销售表格
function renderSalesTable() {
    const startDate = document.getElementById('salesStartDate').value;
    const endDate = document.getElementById('salesEndDate').value;
    
    const transactions = Store.get('transactions', []);
    const products = Store.get('products', []);
    const tableBody = document.getElementById('salesList');
    
    // 清空表格
    tableBody.innerHTML = '';
    
    // 筛选销售记录
    const salesRecords = transactions.filter(t => {
        const recordDate = Utils.formatDate(t.date);
        return t.type === 'sale' && recordDate >= startDate && recordDate <= endDate;
    });
    
    // 添加记录行
    salesRecords.forEach(record => {
        const product = products.find(p => p.id === record.productId);
        if (!product) return; // 跳过找不到产品的记录
        
        const row = document.createElement('tr');
        const totalAmount = record.price * record.quantity;
        
        row.innerHTML = `
            <td data-label="日期">${Utils.formatDate(record.date)}</td>
            <td data-label="产品">${product.name}</td>
            <td data-label="数量">${record.quantity} ${product.unit}</td>
            <td data-label="单价">${Utils.formatCurrency(record.price)}</td>
            <td data-label="金额">${Utils.formatCurrency(totalAmount)}</td>
            <td data-label="备注">${record.remark || '-'}</td>
            <td data-label="操作">
                <button class="btn-danger delete-sale" data-id="${record.id}">删除</button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // 添加删除销售记录事件
    document.querySelectorAll('.delete-sale').forEach(button => {
        button.addEventListener('click', function() {
            const recordId = parseInt(this.getAttribute('data-id'));
            if (confirm('确定要删除这条销售记录吗？这将同时更新相关库存。')) {
                deleteTransaction(recordId);
                renderSalesTable();
            }
        });
    });
    
    // 更新销售汇总数据
    updateSalesSummary(salesRecords);
}

// 更新销售汇总数据
function updateSalesSummary(salesRecords) {
    const totalAmount = salesRecords.reduce((sum, record) => sum + (record.price * record.quantity), 0);
    const totalCount = salesRecords.reduce((sum, record) => sum + record.quantity, 0);
    const averagePrice = salesRecords.length > 0 ? totalAmount / totalCount : 0;
    
    // 安全更新元素内容，检查元素是否存在
    const totalSalesAmountEl = document.getElementById('totalSalesAmount');
    const totalSalesCountEl = document.getElementById('totalSalesCount');
    const averageSalePriceEl = document.getElementById('averageSalePrice');
    
    if (totalSalesAmountEl) {
        totalSalesAmountEl.textContent = Utils.formatCurrency(totalAmount);
    } else {
        console.warn('找不到totalSalesAmount元素');
    }
    
    if (totalSalesCountEl) {
        totalSalesCountEl.textContent = totalCount;
    } else {
        console.warn('找不到totalSalesCount元素');
    }
    
    if (averageSalePriceEl) {
        averageSalePriceEl.textContent = Utils.formatCurrency(averagePrice);
    } else {
        console.warn('找不到averageSalePrice元素，跳过更新');
    }
}

// 财务管理功能
function setupFinanceFilters() {
    const monthInput = document.getElementById('financeMonth');
    const filterBtn = document.getElementById('filterFinanceBtn');
    
    // 设置默认月份（当前月）
    monthInput.value = Utils.getCurrentMonth();
    
    // 筛选按钮点击事件
    filterBtn.addEventListener('click', function() {
        renderFinanceData();
    });
}

// 渲染财务数据
function renderFinanceData() {
    const selectedMonth = document.getElementById('financeMonth').value;
    
    const transactions = Store.get('transactions', []);
    const products = Store.get('products', []);
    
    // 筛选选定月份的交易记录
    const monthRecords = transactions.filter(t => Utils.formatDate(t.date).startsWith(selectedMonth));
    
    // 计算总收入（销售）
    const incomeRecords = monthRecords.filter(t => t.type === 'sale');
    const totalIncome = incomeRecords.reduce((sum, record) => sum + (record.price * record.quantity), 0);
    
    // 计算总支出（采购 + 损耗成本 + 其他费用）
    const purchaseRecords = monthRecords.filter(t => t.type === 'purchase');
    const purchaseCost = purchaseRecords.reduce((sum, record) => sum + (record.price * record.quantity), 0);
    
    // 损耗成本（按成本价计算）
    const damageRecords = monthRecords.filter(t => t.type === 'damage');
    const damageCost = damageRecords.reduce((sum, record) => {
        const product = products.find(p => p.id === record.productId);
        const costPrice = product ? product.costPrice : record.price;
        return sum + (costPrice * record.quantity);
    }, 0);
    
    // 其他费用（从新的费用记录中获取）
    const expenseRecords = monthRecords.filter(t => t.type === 'expense');
    const otherExpenses = expenseRecords.reduce((sum, record) => sum + record.price, 0);
    
    // 总支出 = 采购成本 + 损耗成本 + 其他费用
    const totalExpense = purchaseCost + damageCost + otherExpenses;
    
    // 计算净利润
    const netProfit = totalIncome - totalExpense;
    
    // 更新财务汇总卡片（修正元素ID）
    const monthlyIncomeEl = document.getElementById('monthlyIncome');
    const monthlyExpenseEl = document.getElementById('monthlyExpense');
    const monthlyProfitEl = document.getElementById('monthlyProfit');
    
    if (monthlyIncomeEl) {
        monthlyIncomeEl.textContent = Utils.formatCurrency(totalIncome);
    } else {
        console.warn('找不到monthlyIncome元素');
    }
    
    if (monthlyExpenseEl) {
        monthlyExpenseEl.textContent = Utils.formatCurrency(totalExpense);
    } else {
        console.warn('找不到monthlyExpense元素');
    }
    
    if (monthlyProfitEl) {
        monthlyProfitEl.textContent = Utils.formatCurrency(netProfit);
        // 根据利润正负设置颜色
        if (netProfit >= 0) {
            monthlyProfitEl.style.color = '#28a745'; // 绿色表示盈利
        } else {
            monthlyProfitEl.style.color = '#dc3545'; // 红色表示亏损
        }
    } else {
        console.warn('找不到monthlyProfit元素');
    }
    
    // 在控制台输出详细的财务分析
    console.log('=== 财务分析详情 ===');
    console.log(`选择月份: ${selectedMonth}`);
    console.log(`总收入: ${Utils.formatCurrency(totalIncome)}`);
    console.log(`  - 销售收入: ${Utils.formatCurrency(totalIncome)}`);
    console.log(`总支出: ${Utils.formatCurrency(totalExpense)}`);
    console.log(`  - 采购成本: ${Utils.formatCurrency(purchaseCost)}`);
    console.log(`  - 损耗成本: ${Utils.formatCurrency(damageCost)}`);
    console.log(`  - 其他费用: ${Utils.formatCurrency(otherExpenses)}`);
    console.log(`净利润: ${Utils.formatCurrency(netProfit)}`);
    console.log(`利润率: ${totalIncome > 0 ? ((netProfit / totalIncome) * 100).toFixed(2) : 0}%`);
    
    // 渲染财务记录表格
    renderFinanceTable(monthRecords, products);
    
    // 渲染财务图表
    renderFinanceChart(selectedMonth, transactions);
}

// 渲染财务记录表格
function renderFinanceTable(records, products) {
    const tableBody = document.getElementById('financeList');
    
    // 清空表格
    tableBody.innerHTML = '';
    
    // 按日期排序
    records.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // 添加记录行
    records.forEach(record => {
        const row = document.createElement('tr');
        let totalAmount = 0;
        let productName = '';
        let quantity = '';
        let unitPrice = '';
        
        // 根据类型设置样式和内容
        let typeText;
        let typeClass;
        
        switch (record.type) {
            case 'sale':
                typeText = '销售收入';
                typeClass = 'type-sale';
                const saleProduct = products.find(p => p.id === record.productId);
                productName = saleProduct ? saleProduct.name : '未知产品';
                quantity = `${record.quantity} ${saleProduct ? saleProduct.unit : ''}`;
                unitPrice = Utils.formatCurrency(record.price);
                totalAmount = record.price * record.quantity;
                break;
                
            case 'purchase':
                typeText = '采购支出';
                typeClass = 'type-purchase';
                const purchaseProduct = products.find(p => p.id === record.productId);
                productName = purchaseProduct ? purchaseProduct.name : '未知产品';
                quantity = `${record.quantity} ${purchaseProduct ? purchaseProduct.unit : ''}`;
                unitPrice = Utils.formatCurrency(record.price);
                totalAmount = record.price * record.quantity;
                break;
                
            case 'damage':
                typeText = '损耗成本';
                typeClass = 'type-damage';
                const damageProduct = products.find(p => p.id === record.productId);
                productName = damageProduct ? damageProduct.name : '未知产品';
                quantity = `${record.quantity} ${damageProduct ? damageProduct.unit : ''}`;
                // 损耗按成本价计算
                const costPrice = damageProduct ? damageProduct.costPrice : record.price;
                unitPrice = Utils.formatCurrency(costPrice);
                totalAmount = costPrice * record.quantity;
                break;
                
            case 'expense':
                typeText = '其他费用';
                typeClass = 'type-expense';
                productName = record.remark || '其他费用';
                quantity = '-';
                unitPrice = '-';
                totalAmount = record.price;
                break;
                
            default:
                typeText = record.type;
                typeClass = '';
                const defaultProduct = products.find(p => p.id === record.productId);
                productName = defaultProduct ? defaultProduct.name : '未知';
                quantity = record.quantity ? `${record.quantity} ${defaultProduct ? defaultProduct.unit : ''}` : '-';
                unitPrice = record.price ? Utils.formatCurrency(record.price) : '-';
                totalAmount = record.price * (record.quantity || 1);
        }
        
        row.innerHTML = `
            <td data-label="日期">${Utils.formatDate(record.date)}</td>
            <td data-label="类型" class="${typeClass}">${typeText}</td>
            <td data-label="项目">${productName}</td>
            <td data-label="数量">${quantity}</td>
            <td data-label="单价">${unitPrice}</td>
            <td data-label="金额">${Utils.formatCurrency(totalAmount)}</td>
            <td data-label="备注">${record.remark || '-'}</td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // 如果没有记录，显示提示信息
    if (records.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="7" style="text-align: center;">本月暂无财务记录</td></tr>';
    }
}

// 渲染财务图表
function renderFinanceChart(month, allTransactions) {
    // 解析年份和月份
    const [year, monthNum] = month.split('-').map(Number);
    
    // 获取该月的天数
    const daysInMonth = new Date(year, monthNum, 0).getDate();
    
    // 准备数据
    const dailyData = {};
    const labels = [];
    const products = Store.get('products', []);
    
    // 初始化每天的数据
    for (let i = 1; i <= daysInMonth; i++) {
        const dateStr = `${month}-${String(i).padStart(2, '0')}`;
        labels.push(i); // 只显示日期数字
        dailyData[dateStr] = { 
            income: 0, 
            purchaseCost: 0, 
            damageCost: 0, 
            otherExpense: 0 
        };
    }
    
    // 统计每天的收入和各类支出
    allTransactions.forEach(transaction => {
        const dateStr = Utils.formatDate(transaction.date);
        if (dateStr.startsWith(month)) {
            const amount = transaction.price * (transaction.quantity || 1);
            
            switch (transaction.type) {
                case 'sale':
                    dailyData[dateStr].income += amount;
                    break;
                case 'purchase':
                    dailyData[dateStr].purchaseCost += amount;
                    break;
                case 'damage':
                    // 损耗按成本价计算
                    const product = products.find(p => p.id === transaction.productId);
                    const costPrice = product ? product.costPrice : transaction.price;
                    dailyData[dateStr].damageCost += costPrice * transaction.quantity;
                    break;
                case 'expense':
                    dailyData[dateStr].otherExpense += transaction.price;
                    break;
            }
        }
    });
    
    // 准备图表数据
    const incomeData = labels.map(day => {
        const dateStr = `${month}-${String(day).padStart(2, '0')}`;
        return dailyData[dateStr].income;
    });
    
    const purchaseData = labels.map(day => {
        const dateStr = `${month}-${String(day).padStart(2, '0')}`;
        return dailyData[dateStr].purchaseCost;
    });
    
    const damageData = labels.map(day => {
        const dateStr = `${month}-${String(day).padStart(2, '0')}`;
        return dailyData[dateStr].damageCost;
    });
    
    const expenseData = labels.map(day => {
        const dateStr = `${month}-${String(day).padStart(2, '0')}`;
        return dailyData[dateStr].otherExpense;
    });
    
    // 绘制图表
    const ctx = document.getElementById('financeChart');
    if (!ctx) {
        console.error('找不到财务图表画布元素');
        return;
    }
    
    // 销毁现有图表（如果存在）
    if (window.financeChart && typeof window.financeChart.destroy === 'function') {
        try {
            window.financeChart.destroy();
            console.log('已销毁现有财务图表');
        } catch (error) {
            console.warn('销毁现有财务图表时出错:', error);
        }
    }
    
    // 配置图表
    const chartConfig = {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: '销售收入',
                    data: incomeData,
                    backgroundColor: 'rgba(40, 167, 69, 0.8)',
                    borderColor: 'rgba(40, 167, 69, 1)',
                    borderWidth: 1,
                    stack: 'income'
                },
                {
                    label: '采购成本',
                    data: purchaseData,
                    backgroundColor: 'rgba(194, 51, 47, 0.8)',
                    borderColor: 'rgba(194, 51, 47, 1)',
                    borderWidth: 1,
                    stack: 'expense'
                },
                {
                    label: '损耗成本',
                    data: damageData,
                    backgroundColor: 'rgba(255, 193, 7, 0.8)',
                    borderColor: 'rgba(255, 193, 7, 1)',
                    borderWidth: 1,
                    stack: 'expense'
                },
                {
                    label: '其他费用',
                    data: expenseData,
                    backgroundColor: 'rgba(108, 117, 125, 0.8)',
                    borderColor: 'rgba(108, 117, 125, 1)',
                    borderWidth: 1,
                    stack: 'expense'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 15
                    }
                },
                title: {
                    display: true,
                    text: `${month} 财务收支分析`,
                    font: {
                        size: 16,
                        weight: 'bold'
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function(context) {
                            const label = context.dataset.label || '';
                            const value = Utils.formatCurrency(context.parsed.y);
                            return `${label}: ${value}`;
                        },
                        footer: function(tooltipItems) {
                            let totalIncome = 0;
                            let totalExpense = 0;
                            
                            tooltipItems.forEach(item => {
                                if (item.dataset.label === '销售收入') {
                                    totalIncome += item.parsed.y;
                                } else {
                                    totalExpense += item.parsed.y;
                                }
                            });
                            
                            const profit = totalIncome - totalExpense;
                            return `当日利润: ${Utils.formatCurrency(profit)}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: '日期',
                        font: {
                            weight: 'bold'
                        }
                    },
                    grid: {
                        display: false
                    }
                },
                y: {
                    beginAtZero: true,
                    stacked: false,
                    ticks: {
                        callback: function(value) {
                            return '¥' + value.toLocaleString();
                        }
                    },
                    title: {
                        display: true,
                        text: '金额 (¥)',
                        font: {
                            weight: 'bold'
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                }
            },
            interaction: {
                mode: 'index',
                intersect: false
            }
        }
    };
    
    // 使用安全的图表创建函数
    window.financeChart = safeCreateChart('financeChart', chartConfig, '财务图表');
    
    if (window.financeChart) {
        console.log('✅ 财务图表创建成功');
    }
}

// 报表分析功能
function setupReportFilters() {
    const reportTypeSelect = document.getElementById('reportType');
    const dateRangeInput = document.getElementById('reportDateRange');
    const generateBtn = document.getElementById('generateReportBtn');
    
    console.log('设置报表筛选器...', { reportTypeSelect, dateRangeInput, generateBtn });
    
    // 设置默认月份（当前月）
    if (dateRangeInput) {
        dateRangeInput.value = Utils.getCurrentMonth();
    }
    
    // 生成报表按钮点击事件
    if (generateBtn) {
        // 检查是否已经绑定过事件
        if (!generateBtn.hasAttribute('data-events-bound')) {
            generateBtn.addEventListener('click', function() {
                console.log('报表生成按钮被点击');
                generateReport();
            });
            
            generateBtn.setAttribute('data-events-bound', 'true');
            console.log('报表生成按钮事件已绑定');
        } else {
            console.log('报表生成按钮事件已存在，跳过绑定');
        }
    } else {
        // 如果没有数据，显示一个空图表
        try {
            const canvas = document.getElementById('reportChart');
            const ctx2d = canvas.getContext('2d');
            ctx2d.clearRect(0, 0, canvas.width, canvas.height);
            ctx2d.font = '16px Arial';
            ctx2d.textAlign = 'center';
            ctx2d.fillText('没有销售数据', canvas.width / 2, canvas.height / 2);
            console.log('显示空数据提示');
        } catch (error) {
            console.error('显示空数据提示失败:', error);
        }
    }
    
    // 报表类型变更时更新日期输入控件
    if (reportTypeSelect) {
        reportTypeSelect.addEventListener('change', function() {
            updateReportDateInput(this.value);
        });
        
        // 初始设置日期输入控件
        updateReportDateInput(reportTypeSelect.value);
    } else {
        console.error('找不到报表类型选择元素');
    }
}

// 根据报表类型更新日期输入控件
function updateReportDateInput(reportType) {
    const dateRangeInput = document.getElementById('reportDateRange');
    
    if (reportType === 'daily') {
        dateRangeInput.type = 'date';
        dateRangeInput.value = Utils.getCurrentDate();
    } else {
        dateRangeInput.type = 'month';
        dateRangeInput.value = Utils.getCurrentMonth();
    }
}

// 生成报表
function generateReport() {
    console.log('开始生成报表...');
    
    const reportType = document.getElementById('reportType').value;
    const dateRange = document.getElementById('reportDateRange').value;
    
    console.log('报表参数:', { reportType, dateRange });
    
    switch (reportType) {
        case 'daily':
            generateDailyReport(dateRange);
            break;
        case 'monthly':
            generateMonthlyReport(dateRange);
            break;
        default:
            console.warn('未知的报表类型:', reportType);
            alert('暂不支持该报表类型');
    }
}

// 生成日报表
function generateDailyReport(date) {
    console.log('生成日报表:', date);
    
    const transactions = Store.get('transactions', []);
    const products = Store.get('products', []);
    
    // 筛选当天交易记录
    const dayRecords = transactions.filter(t => Utils.formatDate(t.date) === date);
    
    console.log(`找到 ${dayRecords.length} 条当日记录`);
    
    // 设置标题
    const chartTitle = document.getElementById('reportChartTitle');
    const tableTitle = document.getElementById('reportTableTitle');
    
    if (chartTitle) chartTitle.textContent = `日报表 - ${date}`;
    if (tableTitle) tableTitle.textContent = `${date} 交易记录`;
    
    // 准备表格头部
    const tableHead = document.getElementById('reportTableHead');
    if (tableHead) {
        tableHead.innerHTML = `
            <tr>
                <th>时间</th>
                <th>类型</th>
                <th>产品</th>
                <th>数量</th>
                <th>单价</th>
                <th>金额</th>
                <th>备注</th>
            </tr>
        `;
    }
    
    // 准备表格数据
    const tableBody = document.getElementById('reportTableBody');
    if (tableBody) {
        tableBody.innerHTML = '';
        
        // 总销售额和总成本
        let totalSales = 0;
        let totalCost = 0;
        
        // 按时间排序
        dayRecords.sort((a, b) => new Date(a.date) - new Date(b.date));
        
        // 添加记录行
        dayRecords.forEach(record => {
            const product = products.find(p => p.id === record.productId);
            if (!product && record.type !== 'expense') return; // 跳过找不到产品的记录（费用除外）
            
            const row = document.createElement('tr');
            let totalAmount = 0;
            let productName = '';
            let quantity = '';
            let unitPrice = '';
            
            if (record.type === 'expense') {
                productName = record.remark || '费用支出';
                quantity = '-';
                unitPrice = '-';
                totalAmount = record.price;
                totalCost += totalAmount;
            } else if (product) {
                productName = product.name;
                quantity = `${record.quantity} ${product.unit}`;
                unitPrice = Utils.formatCurrency(record.price);
                totalAmount = record.price * record.quantity;
                
                if (record.type === 'sale') {
                    totalSales += totalAmount;
                } else if (record.type === 'purchase') {
                    totalCost += totalAmount;
                }
            }
            
            // 根据类型设置样式
            let typeText;
            let typeClass;
            
            switch (record.type) {
                case 'sale':
                    typeText = '销售';
                    typeClass = 'type-sale';
                    break;
                case 'purchase':
                    typeText = '采购';
                    typeClass = 'type-purchase';
                    break;
                case 'damage':
                    typeText = '损耗';
                    typeClass = 'type-damage';
                    break;
                case 'expense':
                    typeText = '费用';
                    typeClass = 'type-expense';
                    break;
                default:
                    typeText = record.type;
                    typeClass = '';
            }
            
            row.innerHTML = `
                <td>${new Date(record.date).toLocaleTimeString()}</td>
                <td class="${typeClass}">${typeText}</td>
                <td>${productName}</td>
                <td>${quantity}</td>
                <td>${unitPrice}</td>
                <td>${Utils.formatCurrency(totalAmount)}</td>
                <td>${record.remark || '-'}</td>
            `;
            
            tableBody.appendChild(row);
        });
        
        // 添加汇总行
        if (dayRecords.length > 0) {
            const summaryRow = document.createElement('tr');
            summaryRow.className = 'summary-row';
            summaryRow.innerHTML = `
                <td colspan="5" class="text-right"><strong>日总销售额:</strong></td>
                <td><strong>${Utils.formatCurrency(totalSales)}</strong></td>
                <td></td>
            `;
            tableBody.appendChild(summaryRow);
            
            const costRow = document.createElement('tr');
            costRow.className = 'summary-row';
            costRow.innerHTML = `
                <td colspan="5" class="text-right"><strong>日总成本:</strong></td>
                <td><strong>${Utils.formatCurrency(totalCost)}</strong></td>
                <td></td>
            `;
            tableBody.appendChild(costRow);
            
            const profitRow = document.createElement('tr');
            profitRow.className = 'summary-row';
            profitRow.innerHTML = `
                <td colspan="5" class="text-right"><strong>日净利润:</strong></td>
                <td><strong>${Utils.formatCurrency(totalSales - totalCost)}</strong></td>
                <td></td>
            `;
            tableBody.appendChild(profitRow);
        } else {
            tableBody.innerHTML = '<tr><td colspan="7" style="text-align: center;">当日无交易记录</td></tr>';
        }
    }
    
    // 生成图表
    generateReportChart(dayRecords, products, date);
}

// 生成月报表
function generateMonthlyReport(month) {
    console.log('生成月报表:', month);
    alert('月报表功能正在开发中...');
}

// 生成报表图表
function generateReportChart(records, products, date) {
    const ctx = document.getElementById('reportChart');
    if (!ctx) {
        console.error('找不到报表图表画布元素');
        return;
    }
    
    // 销毁现有图表（如果存在）
    if (window.reportChart && typeof window.reportChart.destroy === 'function') {
        try {
            window.reportChart.destroy();
            console.log('已销毁现有报表图表');
        } catch (error) {
            console.warn('销毁现有报表图表时出错:', error);
        }
    }
    
    // 准备图表数据
    const salesByProduct = {};
    
    records.filter(t => t.type === 'sale').forEach(record => {
        const product = products.find(p => p.id === record.productId);
        if (!product) return;
        
        if (!salesByProduct[product.name]) {
            salesByProduct[product.name] = 0;
        }
        
        salesByProduct[product.name] += record.price * record.quantity;
    });
    
    const productNames = Object.keys(salesByProduct);
    const salesValues = productNames.map(name => salesByProduct[name]);
    
    if (productNames.length > 0) {
        try {
            window.reportChart = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: productNames,
                    datasets: [{
                        data: salesValues,
                        backgroundColor: [
                            'rgba(194, 51, 47, 0.7)',
                            'rgba(233, 180, 76, 0.7)',
                            'rgba(58, 96, 110, 0.7)',
                            'rgba(155, 41, 21, 0.7)',
                            'rgba(86, 59, 128, 0.7)',
                            'rgba(206, 123, 48, 0.7)',
                            'rgba(47, 138, 196, 0.7)',
                            'rgba(147, 196, 47, 0.7)',
                            'rgba(196, 47, 132, 0.7)',
                            'rgba(47, 196, 173, 0.7)'
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'right'
                        },
                        title: {
                            display: true,
                            text: `${date} 销售产品分布`
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    const label = context.label || '';
                                    const value = Utils.formatCurrency(context.raw);
                                    const percentage = Math.round(context.parsed * 100) + '%';
                                    return `${label}: ${value} (${percentage})`;
                                }
                            }
                        }
                    }
                }
            });
            console.log('报表图表创建成功');
        } catch (error) {
            console.error('创建报表图表失败:', error);
        }
    } else {
        // 如果没有销售数据，显示提示
        try {
            const canvas = document.getElementById('reportChart');
            const ctx2d = canvas.getContext('2d');
            ctx2d.clearRect(0, 0, canvas.width, canvas.height);
            ctx2d.font = '16px Arial';
            ctx2d.textAlign = 'center';
            ctx2d.fillText('当日无销售数据', canvas.width / 2, canvas.height / 2);
            console.log('显示无销售数据提示');
        } catch (error) {
            console.error('显示无数据提示失败:', error);
        }
    }
}

// 设置所有事件监听器
function setupEventListeners() {
    console.log('设置事件监听器...');
    
    // 设置产品模态框
    setupProductModal();
    
    // 设置库存模态框
    setupInventoryModal();
    
    // 添加产品按钮事件
    const addProductBtn = document.getElementById('addProductBtn');
    if (addProductBtn) {
        addProductBtn.addEventListener('click', function() {
            console.log('点击了添加新产品按钮');
            openProductModal();
        });
        console.log('添加产品按钮事件已绑定');
    } else {
        console.warn('找不到addProductBtn元素，将在页面切换时重新绑定');
    }
    
    // 调整库存按钮事件
    const adjustInventoryBtn = document.getElementById('adjustInventoryBtn');
    if (adjustInventoryBtn) {
        adjustInventoryBtn.addEventListener('click', function() {
            console.log('点击了调整库存按钮');
            openInventoryModal();
        });
        console.log('调整库存按钮事件已绑定');
    } else {
        console.warn('找不到adjustInventoryBtn元素，将在页面切换时重新绑定');
    }
    
    // 添加重置数据按钮事件
    const resetDataBtn = document.getElementById('resetData');
    if (resetDataBtn) {
        resetDataBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('确定要重置所有数据吗？这将清除所有产品、库存和交易记录，并重新加载哆啦A梦道具列表。')) {
                console.log('执行数据重置...');
                localStorage.clear();
                alert('数据已重置，页面将重新加载');
                window.location.reload();
            }
        });
        console.log('重置数据按钮事件已绑定');
    }
}

// 页面加载完成后初始化应用
document.addEventListener('DOMContentLoaded', function() {
    console.log('页面加载完成，开始初始化应用...');
    
    // 初始化应用
    initializeApp();
    
    console.log('应用初始化完成');
});

// 应用初始化
function initializeApp() {
    console.log('开始初始化应用...');
    
    // 检查URL参数，是否需要重置数据
    if (window.location.search.includes('reset=true')) {
        console.log('检测到重置参数，将强制重置数据');
        localStorage.setItem('forceDoraemonReset', 'true');
        // 移除URL参数并刷新页面
        window.history.replaceState({}, document.title, window.location.pathname);
        window.location.reload();
        return; // 中止继续执行，等待页面刷新
    }
    
    // 初始化示例数据
    initializeProducts();
    
    // 设置日期显示
    setupDateDisplay();
    
    // 设置导航
    setupNavigation();
    
    // 等待 Chart.js 加载完成后再渲染图表
    waitForChart(() => {
        console.log('Chart.js 已加载，开始渲染仪表盘图表...');
        // 只渲染仪表盘图表，避免重复渲染
        updateDashboard();
    });
    
    // 渲染不依赖图表的内容（只渲染一次）
    console.log('渲染基础页面内容...');
    renderInventoryTable();
    renderProductsTable();
    setupDailyEntryForm();
    renderDailyRecordsTable();
    setupSalesFilters();
    setupFinanceFilters();
    setupReportFilters();
    
    // 添加各页面按钮事件监听
    setupEventListeners();
    
    // 添加快捷操作按钮事件监听
    setupQuickActionButtons();
    
    // 默认显示仪表盘页面
    const dashboardPage = document.getElementById('dashboard');
    const firstNavLink = document.querySelector('nav ul li a');
    if (dashboardPage) {
        dashboardPage.classList.add('active');
    }
    if (firstNavLink) {
        firstNavLink.classList.add('active');
    }
    
    console.log('应用初始化完成');
}

// 快捷操作按钮设置
function setupQuickActionButtons() {
    console.log('设置快捷操作按钮...');
    
    // 设置快捷销售录入按钮
    const enterSalesBtn = document.getElementById('quick-enter-sales');
    if (enterSalesBtn) {
        enterSalesBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('点击了录入今日销售按钮');
            // 切换到每日数据录入页面
            navigateToPage('daily-entry');
            // 聚焦到销售类型选项
            setTimeout(() => {
                const typeSelect = document.getElementById('entryType');
                if (typeSelect) {
                    typeSelect.value = 'sale';
                    typeSelect.dispatchEvent(new Event('change'));
                }
            }, 100);
        });
        console.log('录入今日销售按钮事件已绑定');
    } else {
        console.error('未找到录入今日销售按钮');
    }
    
    // 设置查看库存状态按钮
    const checkInventoryBtn = document.getElementById('quick-check-inventory');
    if (checkInventoryBtn) {
        checkInventoryBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('点击了查看库存状态按钮');
            // 切换到库存管理页面
            navigateToPage('inventory');
        });
        console.log('查看库存状态按钮事件已绑定');
    } else {
        console.error('未找到查看库存状态按钮');
    }
    
    // 设置添加新商品按钮
    const addProductBtn = document.getElementById('quick-add-product');
    if (addProductBtn) {
        addProductBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('点击了添加新商品按钮');
            // 切换到商品管理页面并显示添加商品表单
            navigateToPage('products');
            // 显示添加商品表单
            setTimeout(() => {
                openProductModal();
            }, 100);
        });
        console.log('添加新商品按钮事件已绑定');
    } else {
        console.error('未找到添加新商品按钮');
    }
    
    // 设置生成日报按钮
    const generateReportBtn = document.getElementById('quick-generate-report');
    if (generateReportBtn) {
        generateReportBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('点击了生成今日报表按钮');
            // 切换到报表分析页面
            navigateToPage('reports');
            // 选择日报选项
            setTimeout(() => {
                const reportType = document.getElementById('reportType');
                const reportDateRange = document.getElementById('reportDateRange');
                if (reportType) {
                    reportType.value = 'daily';
                    reportType.dispatchEvent(new Event('change'));
                }
                if (reportDateRange) {
                    // 更新日期为今天
                    reportDateRange.value = Utils.getCurrentDate();
                }
            }, 100);
        });
        console.log('生成今日报表按钮事件已绑定');
    } else {
        console.error('未找到生成今日报表按钮');
    }
}

// 页面导航辅助函数
function navigateToPage(pageId) {
    console.log(`导航到页面: ${pageId}`);
    
    // 移除所有导航链接的激活状态
    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => link.classList.remove('active'));
    
    // 为对应的导航链接添加激活状态
    const targetNavLink = document.querySelector(`nav ul li a[href="#${pageId}"]`);
    if (targetNavLink) {
        targetNavLink.classList.add('active');
    }
    
    // 隐藏所有页面
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // 显示目标页面
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
        
        // 根据页面类型进行特定的渲染
        switch (pageId) {
            case 'dashboard':
                // 仪表板页面：更新图表和数据
                updateDashboard();
                break;
                
            case 'products':
                // 产品管理页面：渲染产品表格并绑定事件
                renderProductsTable();
                bindPageSpecificEvents('products');
                break;
                
            case 'inventory':
                // 库存管理页面：渲染库存表格并绑定事件
                renderInventoryTable();
                bindPageSpecificEvents('inventory');
                break;
                
            case 'daily-entry':
                // 每日数据录入页面：设置表单和渲染记录
                setupDailyEntryForm();
                renderDailyRecordsTable();
                break;
                
            case 'sales':
                // 销售管理页面：设置筛选器和渲染表格
                setupSalesFilters();
                renderSalesTable();
                break;
                
            case 'finance':
                // 财务管理页面：设置筛选器和渲染数据
                setupFinanceFilters();
                renderFinanceData();
                break;
                
            case 'reports':
                // 报表分析页面：设置筛选器
                setupReportFilters();
                break;
                
            case 'help':
                // 使用说明页面：无需特殊处理
                break;
                
            default:
                console.log(`页面 ${pageId} 无需特殊渲染`);
        }
        
        console.log(`成功导航到页面: ${pageId}`);
    } else {
        console.error(`找不到页面: ${pageId}`);
    }
}

// 图表大小调整函数
function resizeCharts() {
    console.log('调整图表大小...');
    
    // 调整销售趋势图表
    if (window.salesTrendChart && typeof window.salesTrendChart.resize === 'function') {
        try {
            window.salesTrendChart.resize();
            console.log('销售趋势图表大小已调整');
        } catch (error) {
            console.warn('调整销售趋势图表大小时出错:', error);
        }
    }
    
    // 调整热销商品图表
    if (window.topProductsChart && typeof window.topProductsChart.resize === 'function') {
        try {
            window.topProductsChart.resize();
            console.log('热销商品图表大小已调整');
        } catch (error) {
            console.warn('调整热销商品图表大小时出错:', error);
        }
    }
    
    // 调整财务图表
    if (window.financeChart && typeof window.financeChart.resize === 'function') {
        try {
            window.financeChart.resize();
            console.log('财务图表大小已调整');
        } catch (error) {
            console.warn('调整财务图表大小时出错:', error);
        }
    }
    
    // 调整报表图表
    if (window.reportChart && typeof window.reportChart.resize === 'function') {
        try {
            window.reportChart.resize();
            console.log('报表图表大小已调整');
        } catch (error) {
            console.warn('调整报表图表大小时出错:', error);
        }
    }
}

// 监听窗口大小改变事件
let resizeTimeout;
window.addEventListener('resize', function() {
    // 使用防抖机制，避免频繁调整
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(resizeCharts, 250);
});
    
// 页面特定的事件绑定
function bindPageSpecificEvents(pageId) {
    console.log(`绑定页面 ${pageId} 的特定事件...`);
    
    switch (pageId) {
        case 'products':
            // 绑定产品管理页面的事件
            const addProductBtn = document.getElementById('addProductBtn');
            if (addProductBtn && !addProductBtn.hasAttribute('data-bound')) {
                addProductBtn.addEventListener('click', function() {
                    console.log('点击了添加新产品按钮');
                    openProductModal();
                });
                addProductBtn.setAttribute('data-bound', 'true');
                console.log('产品页面：添加产品按钮事件已绑定');
            }
            
            // 绑定产品搜索功能
            const productSearch = document.getElementById('productSearch');
            if (productSearch && !productSearch.hasAttribute('data-bound')) {
                productSearch.addEventListener('input', function() {
                    const searchTerm = this.value.toLowerCase();
                    const rows = document.querySelectorAll('#productsList tr');
                    
                    rows.forEach(row => {
                        const productName = row.querySelector('td:nth-child(2)');
                        const category = row.querySelector('td:nth-child(3)');
                        
                        if (productName && category) {
                            const nameText = productName.textContent.toLowerCase();
                            const categoryText = category.textContent.toLowerCase();
                            
                            if (nameText.includes(searchTerm) || categoryText.includes(searchTerm)) {
                                row.style.display = '';
                            } else {
                                row.style.display = 'none';
                            }
                        }
                    });
                });
                productSearch.setAttribute('data-bound', 'true');
                console.log('产品页面：搜索功能已绑定');
            }
            break;
            
        case 'inventory':
            // 绑定库存管理页面的事件
            const adjustInventoryBtn = document.getElementById('adjustInventoryBtn');
            if (adjustInventoryBtn && !adjustInventoryBtn.hasAttribute('data-bound')) {
                adjustInventoryBtn.addEventListener('click', function() {
                    console.log('点击了调整库存按钮');
                    openInventoryModal();
                });
                adjustInventoryBtn.setAttribute('data-bound', 'true');
                console.log('库存页面：调整库存按钮事件已绑定');
            }
            
            // 绑定库存搜索功能
            const inventorySearch = document.getElementById('inventorySearch');
            if (inventorySearch && !inventorySearch.hasAttribute('data-bound')) {
                inventorySearch.addEventListener('input', function() {
                    const searchTerm = this.value.toLowerCase();
                    const rows = document.querySelectorAll('#inventoryList tr');
                    
                    rows.forEach(row => {
                        const productName = row.querySelector('td:first-child').textContent.toLowerCase();
                        const category = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
                        
                        if (productName && category) {
                            const nameText = productName.textContent.toLowerCase();
                            const categoryText = category.textContent.toLowerCase();
                            
                            if (nameText.includes(searchTerm) || categoryText.includes(searchTerm)) {
                                row.style.display = '';
                            } else {
                                row.style.display = 'none';
                            }
                        }
                    });
                });
                inventorySearch.setAttribute('data-bound', 'true');
                console.log('库存页面：搜索功能已绑定');
            }
            break;
    }
}

// 全局模态框控制函数
function closeProductModal() {
    const modal = document.getElementById('productModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function closeInventoryModal() {
    const modal = document.getElementById('inventoryModal');
    if (modal) {
        modal.style.display = 'none';
    }
}
    