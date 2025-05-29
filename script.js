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
    // 强制重新初始化数据（用于测试）
    const forceReset = false; // 设置为true可以强制重新生成数据
    
    let products = Store.get('products', []);
    
    // 如果没有产品数据或强制重置，添加示例产品
    if (products.length === 0 || forceReset) {
        products = [
            { id: 1, name: '传统月饼', category: '月饼', unit: '盒', costPrice: 40, sellPrice: 68 },
            { id: 2, name: '豆沙糕点', category: '糕点', unit: '袋', costPrice: 15, sellPrice: 25 },
            { id: 3, name: '桃酥饼干', category: '饼干', unit: '盒', costPrice: 12, sellPrice: 20 },
            { id: 4, name: '椰丝糕', category: '糕点', unit: '个', costPrice: 5, sellPrice: 8 },
            { id: 5, name: '花生酥', category: '糕点', unit: '盒', costPrice: 18, sellPrice: 30 },
            { id: 6, name: '绿豆糕', category: '糕点', unit: '盒', costPrice: 16, sellPrice: 28 },
            { id: 7, name: '蛋黄酥', category: '糕点', unit: '个', costPrice: 6, sellPrice: 10 },
            { id: 8, name: '水果糖', category: '糖果', unit: '袋', costPrice: 8, sellPrice: 15 },
            { id: 9, name: '五仁月饼', category: '月饼', unit: '个', costPrice: 8, sellPrice: 12 },
            { id: 10, name: '奶黄月饼', category: '月饼', unit: '个', costPrice: 10, sellPrice: 15 },
            { id: 11, name: '凤梨酥', category: '糕点', unit: '盒', costPrice: 35, sellPrice: 58 },
            { id: 12, name: '红豆酥', category: '糕点', unit: '个', costPrice: 4, sellPrice: 7 },
            { id: 13, name: '龙舟糕', category: '糕点', unit: '盒', costPrice: 22, sellPrice: 36 },
            { id: 14, name: '粽子礼盒', category: '节日食品', unit: '盒', costPrice: 45, sellPrice: 68 },
            { id: 15, name: '绿茶酥', category: '糕点', unit: '盒', costPrice: 28, sellPrice: 45 },
            { id: 16, name: '芝麻酥', category: '糕点', unit: '盒', costPrice: 20, sellPrice: 32 },
            { id: 17, name: '核桃酥', category: '糕点', unit: '盒', costPrice: 25, sellPrice: 40 },
            { id: 18, name: '莲蓉月饼', category: '月饼', unit: '个', costPrice: 12, sellPrice: 18 },
            { id: 19, name: '红枣糕', category: '糕点', unit: '盒', costPrice: 18, sellPrice: 30 },
            { id: 20, name: '山楂糕', category: '糕点', unit: '盒', costPrice: 15, sellPrice: 25 }
        ];
        Store.set('products', products);
        
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
        
        // 生成5月份的交易记录
        const transactions = generateMayTransactions(products);
        Store.set('transactions', transactions);
        
        console.log('已初始化20个产品和5月份完整交易数据');
        console.log('产品数量:', products.length);
        console.log('交易记录数量:', transactions.length);
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
    
    // 5月1日到今天
    const today = new Date();
    const startDate = new Date(today.getFullYear(), 4, 1); // 5月1日
    const endDate = new Date(today.getFullYear(), 4, 31); // 5月31日
    if (endDate > today) {
        endDate.setTime(today.getTime());
    }
    
    // 每天生成销售记录
    for (let currentDate = new Date(startDate); currentDate <= endDate; currentDate.setDate(currentDate.getDate() + 1)) {
        // 每天销售5-12个商品
        const dailySalesCount = Math.floor(Math.random() * 8) + 5;
        
        for (let i = 0; i < dailySalesCount; i++) {
            // 随机选择产品
            const randomProduct = products[Math.floor(Math.random() * products.length)];
            
            // 节假日和周末销量增加
            const isWeekend = (currentDate.getDay() === 0 || currentDate.getDay() === 6);
            const isHoliday = (currentDate.getDate() === 1 || currentDate.getDate() === 5 || 
                              (currentDate.getDate() >= 22 && currentDate.getDate() <= 24)); // 端午节期间
            const multiplier = (isWeekend || isHoliday) ? 1.5 : 1;
            
            // 随机销售数量，节假日销量更高
            const randomQuantity = Math.ceil((Math.floor(Math.random() * 6) + 1) * multiplier);
            
            // 生成随机时间
            const hour = Math.floor(Math.random() * 12) + 8; // 8点到20点
            const minute = Math.floor(Math.random() * 60);
            const second = Math.floor(Math.random() * 60);
            const saleDate = new Date(currentDate);
            saleDate.setHours(hour, minute, second);
            
            // 添加销售记录
            transactions.push({
                id: transactionId++,
                date: saleDate.toISOString(),
                type: 'sale',
                productId: randomProduct.id,
                quantity: randomQuantity,
                price: randomProduct.sellPrice,
                remark: isHoliday ? '端午节促销' : (isWeekend ? '周末销售' : '日常销售')
            });
        }
        
        // 随机加入损耗记录 (15%的概率)
        if (Math.random() < 0.15) {
            const randomProduct = products[Math.floor(Math.random() * products.length)];
            const lossDate = new Date(currentDate);
            lossDate.setHours(20, 30, 0); // 晚上8:30盘点
            
            transactions.push({
                id: transactionId++,
                date: lossDate.toISOString(),
                type: 'damage',
                productId: randomProduct.id,
                quantity: Math.floor(Math.random() * 3) + 1,
                price: randomProduct.costPrice,
                remark: '过期损耗'
            });
        }
    }
    
    // 每周补货一次 (周一)
    for (let weekStart = new Date(startDate); weekStart <= endDate; weekStart.setDate(weekStart.getDate() + 7)) {
        // 调整到周一
        while (weekStart.getDay() !== 1) {
            weekStart.setDate(weekStart.getDate() + 1);
        }
        
        if (weekStart > endDate) break;
        
        // 每次补货8-12种商品
        const restockCount = Math.floor(Math.random() * 5) + 8;
        const restockProducts = new Set();
        
        while (restockProducts.size < restockCount) {
            const randomIndex = Math.floor(Math.random() * products.length);
            restockProducts.add(randomIndex);
        }
        
        // 转为数组并生成补货记录
        [...restockProducts].forEach(productIndex => {
            const product = products[productIndex];
            const restockDate = new Date(weekStart);
            restockDate.setHours(7, 30, 0); // 早上7:30补货
            
            transactions.push({
                id: transactionId++,
                date: restockDate.toISOString(),
                type: 'purchase',
                productId: product.id,
                quantity: Math.floor(Math.random() * 25) + 15, // 15-40个单位
                price: product.costPrice,
                remark: '每周例行补货'
            });
        });
    }
    
    // 端午节特别补货 (5月20日)
    const dragonBoatDate = new Date(today.getFullYear(), 4, 20);
    if (dragonBoatDate <= endDate) {
        const dragonBoatProducts = products.filter(p => 
            p.name.includes('粽子') || p.name.includes('龙舟') || p.category === '节日食品'
        );
        
        dragonBoatProducts.forEach(product => {
            const festivalRestockDate = new Date(dragonBoatDate);
            festivalRestockDate.setHours(6, 0, 0);
            
            transactions.push({
                id: transactionId++,
                date: festivalRestockDate.toISOString(),
                type: 'purchase',
                productId: product.id,
                quantity: Math.floor(Math.random() * 40) + 40, // 大量补货40-80个单位
                price: product.costPrice,
                remark: '端午节特别补货'
            });
        });
    }
    
    // 按日期排序
    transactions.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    console.log(`已生成${transactions.length}条5月份交易记录`);
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
    
    const navLinks = document.querySelectorAll('nav ul li a');
    const pages = document.querySelectorAll('.page');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 移除所有导航链接的激活状态
            navLinks.forEach(l => l.classList.remove('active'));
            
            // 为当前点击的链接添加激活状态
            this.classList.add('active');
            
            // 获取目标页面ID
            const targetPageId = this.getAttribute('href').substring(1);
            console.log(`导航点击: ${targetPageId}`);
            
            // 隐藏所有页面
            pages.forEach(page => page.classList.remove('active'));
            
            // 显示目标页面
            const targetPage = document.getElementById(targetPageId);
            if (targetPage) {
                targetPage.classList.add('active');
            }
            
            // 根据页面执行特定操作
            if (targetPageId === 'dashboard') {
                updateDashboard();
            } else if (targetPageId === 'products') {
                renderProductsTable();
            } else if (targetPageId === 'inventory') {
                renderInventoryTable();
            } else if (targetPageId === 'daily-entry') {
                setupDailyEntryForm();
                renderDailyRecordsTable();
            } else if (targetPageId === 'sales') {
                setupSalesFilters();
                renderSalesTable();
            } else if (targetPageId === 'finance') {
                setupFinanceFilters();
                renderFinanceData();
            } else if (targetPageId === 'reports') {
                setupReportFilters();
            }
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
function updateDashboard() {
    updateDashboardCards();
    renderSalesTrendChart();
    renderTopProductsChart();
    renderLowStockTable();
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
    const transactions = Store.get('transactions', []);
    
    // 获取过去7天的日期
    const dates = [];
    const salesByDay = {};
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = Utils.formatDate(date);
        dates.push(dateStr);
        salesByDay[dateStr] = 0;
    }
    
    // 计算每天的销售额
    transactions
        .filter(t => t.type === 'sale' && dates.includes(Utils.formatDate(t.date)))
        .forEach(t => {
            const dateStr = Utils.formatDate(t.date);
            salesByDay[dateStr] += t.price * t.quantity;
        });
    
    // 准备图表数据
    const salesData = dates.map(date => salesByDay[date]);
    const formattedDates = dates.map(date => {
        const d = new Date(date);
        return `${d.getMonth() + 1}月${d.getDate()}日`;
    });
    
    // 绘制图表
    const ctx = document.getElementById('salesTrendChart');
    if (!ctx) {
        console.error('找不到销售趋势图表画布元素');
        return;
    }
    
    // 销毁现有图表（如果存在）
    if (window.salesTrendChart) {
        window.salesTrendChart.destroy();
    }
    
    // 图表配置
    const config = {
        type: 'line',
        data: {
            labels: formattedDates,
            datasets: [{
                label: '销售额 (¥)',
                data: salesData,
                backgroundColor: 'rgba(194, 51, 47, 0.2)',
                borderColor: 'rgba(194, 51, 47, 1)',
                borderWidth: 2,
                tension: 0.3,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return Utils.formatCurrency(context.parsed.y);
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '¥' + value;
                        }
                    }
                }
            }
        }
    };
    
    // 创建图表
    window.salesTrendChart = safeCreateChart('salesTrendChart', config, '销售趋势图表');
}

// 渲染畅销产品图表
function renderTopProductsChart() {
    const transactions = Store.get('transactions', []);
    const products = Store.get('products', []);
    
    // 获取当前月份
    const currentMonth = Utils.getCurrentMonth();
    
    // 按产品ID计算销售总额
    const salesByProduct = {};
    
    transactions
        .filter(t => t.type === 'sale' && Utils.formatDate(t.date).startsWith(currentMonth))
        .forEach(t => {
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
    
    // 准备图表数据
    const labels = productSales.map(p => p.name);
    const data = productSales.map(p => p.sales);
    
    // 绘制图表
    const ctx = document.getElementById('topProductsChart');
    if (!ctx) {
        console.error('找不到热销商品图表画布元素');
        return;
    }
    
    // 销毁现有图表（如果存在）
    if (window.topProductsChart) {
        window.topProductsChart.destroy();
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
                ]
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
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
                    ticks: {
                        callback: function(value) {
                            return '¥' + value;
                        }
                    }
                }
            }
        }
    };
    
    // 创建图表
    window.topProductsChart = safeCreateChart('topProductsChart', config, '热销商品图表');
}

// 渲染库存预警表格
function renderLowStockTable() {
    const products = Store.get('products', []);
    const inventory = Store.get('inventory', []);
    const tableBody = document.querySelector('#lowStockTable tbody');
    
    if (!tableBody) return;
    
    // 清空表格
    tableBody.innerHTML = '';
    
    // 找出库存低于20的商品
    const lowStockItems = inventory.filter(item => item.quantity < 20);
    
    if (lowStockItems.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="4" style="text-align: center;">暂无库存预警</td></tr>';
        return;
    }
    
    lowStockItems.forEach(item => {
        const product = products.find(p => p.id === item.productId);
        if (!product) return;
        
        const row = document.createElement('tr');
        
        let statusClass = '';
        let statusText = '';
        if (item.quantity <= 5) {
            statusClass = 'status-critical';
            statusText = '严重不足';
        } else if (item.quantity <= 10) {
            statusClass = 'status-warning';
            statusText = '库存不足';
        } else {
            statusClass = 'status-low';
            statusText = '库存偏低';
        }
        
        row.innerHTML = `
            <td data-label="商品名称">${product.name}</td>
            <td data-label="分类">${product.category}</td>
            <td data-label="当前库存">${item.quantity} ${product.unit}</td>
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
    const closeBtn = modal.querySelector('.close');
    const cancelBtn = document.getElementById('cancelProductBtn');
    
    // 关闭模态框
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    cancelBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    // 点击模态框外部关闭
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // 产品表单提交
    document.getElementById('productForm').addEventListener('submit', function(e) {
        e.preventDefault();
        saveProduct();
    });
}

// 打开产品编辑模态框
function openProductModal(productId = null) {
    const modal = document.getElementById('productModal');
    const form = document.getElementById('productForm');
    const title = document.getElementById('productModalTitle');
    
    // 重置表单
    form.reset();
    
    if (productId) {
        // 编辑现有产品
        const products = Store.get('products', []);
        const product = products.find(p => p.id === productId);
        
        if (product) {
            document.getElementById('productFormId').value = product.id;
            document.getElementById('productName').value = product.name;
            document.getElementById('category').value = product.category;
            document.getElementById('unit').value = product.unit;
            document.getElementById('costPrice').value = product.costPrice;
            document.getElementById('sellPrice').value = product.sellPrice;
            
            title.textContent = '编辑产品';
        }
    } else {
        // 添加新产品
        document.getElementById('productFormId').value = '';
        title.textContent = '添加新产品';
    }
    
    // 显示模态框
    modal.style.display = 'block';
}

// 保存产品数据
function saveProduct() {
    const formId = document.getElementById('productFormId').value;
    const name = document.getElementById('productName').value.trim();
    const category = document.getElementById('category').value;
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
    
    if (formId) {
        // 更新现有产品
        const id = parseInt(formId);
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
        
        row.innerHTML = `
            <td data-label="产品名称">${product.name}</td>
            <td data-label="分类">${product.category}</td>
            <td data-label="库存数量">${item.quantity}</td>
            <td data-label="单位">${product.unit}</td>
            <td data-label="平均成本">${Utils.formatCurrency(item.avgCost)}</td>
            <td data-label="总价值">${Utils.formatCurrency(totalValue)}</td>
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
    const closeBtn = modal.querySelector('.close');
    const cancelBtn = document.getElementById('cancelInventoryBtn');
    const form = document.getElementById('inventoryForm');
    
    // 填充产品下拉菜单
    populateProductSelect('inventoryProductName');
    
    // 当选择不同产品时，更新当前库存显示
    document.getElementById('inventoryProductName').addEventListener('change', function() {
        const productId = parseInt(this.value);
        updateCurrentStockDisplay(productId);
    });
    
    // 关闭模态框
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    cancelBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    // 点击模态框外部关闭
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // 库存调整表单提交
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        adjustInventory();
    });
}

// 打开库存调整模态框
function openInventoryModal(productId = null) {
    const modal = document.getElementById('inventoryModal');
    const form = document.getElementById('inventoryForm');
    const productSelect = document.getElementById('inventoryProductName');
    
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
    
    if (item) {
        document.getElementById('currentStock').value = item.quantity;
        document.getElementById('inventoryProductId').value = productId;
    } else {
        document.getElementById('currentStock').value = 0;
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
    const productId = parseInt(document.getElementById('inventoryProductId').value);
    const adjustmentType = document.getElementById('adjustmentType').value;
    const adjustmentQuantity = parseInt(document.getElementById('adjustmentQuantity').value);
    const reason = document.getElementById('adjustmentReason').value.trim();
    
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
    
    // 更新仪表盘
    updateDashboard();
}

// 每日数据提交功能
function setupDailyEntryForm() {
    const form = document.getElementById('entryForm');
    const dateInput = document.getElementById('entryDate');
    const productSelect = document.getElementById('productId');
    const priceInput = document.getElementById('price');
    const typeSelect = document.getElementById('entryType');
    
    // 设置日期为今天
    dateInput.value = Utils.getCurrentDate();
    
    // 填充产品下拉菜单
    populateProductSelect('productId');
    
    // 当产品或类型改变时，自动填充价格
    productSelect.addEventListener('change', function() {
        updatePriceBasedOnProductAndType();
    });
    
    typeSelect.addEventListener('change', function() {
        updatePriceBasedOnProductAndType();
    });
    
    // 表单提交
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        submitDailyEntry();
    });
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
    const date = document.getElementById('entryDate').value;
    const type = document.getElementById('entryType').value;
    const productId = parseInt(document.getElementById('productId').value);
    const quantity = parseInt(document.getElementById('quantity').value);
    const price = parseFloat(document.getElementById('price').value);
    const remark = document.getElementById('remark').value.trim();
    
    // 验证输入
    if (!date || !type || !productId || isNaN(quantity) || quantity <= 0 || isNaN(price) || price < 0) {
        alert('请填写所有必填字段！');
        return;
    }
    
    // 添加新的交易记录
    const transactions = Store.get('transactions', []);
    const newId = Utils.generateId(transactions);
    
    const newTransaction = {
        id: newId,
        date: new Date(date).toISOString(),
        type,
        productId,
        quantity,
        price,
        remark
    };
    
    transactions.push(newTransaction);
    Store.set('transactions', transactions);
    
    // 更新库存
    updateInventoryAfterTransaction(newTransaction);
    
    // 重置表单
    document.getElementById('entryForm').reset();
    document.getElementById('entryDate').value = Utils.getCurrentDate();
    populateProductSelect('productId');
    
    // 刷新今日记录表格
    renderDailyRecordsTable();
    
    // 更新仪表盘
    updateDashboard();
}

// 更新库存
function updateInventoryAfterTransaction(transaction) {
    const inventory = Store.get('inventory', []);
    const itemIndex = inventory.findIndex(i => i.productId === transaction.productId);
    
    if (itemIndex === -1) return; // 如果找不到库存项，不做任何操作
    
    const item = inventory[itemIndex];
    
    if (transaction.type === 'sale' || transaction.type === 'damage') {
        // 销售或损耗，减少库存
        const newQuantity = Math.max(0, item.quantity - transaction.quantity);
        inventory[itemIndex] = {
            ...item,
            quantity: newQuantity,
            lastUpdate: transaction.date
        };
    } else if (transaction.type === 'purchase') {
        // 采购，增加库存并重新计算平均成本
        const oldValue = item.quantity * item.avgCost;
        const newValue = transaction.quantity * transaction.price;
        const newQuantity = item.quantity + transaction.quantity;
        const newAvgCost = (oldValue + newValue) / newQuantity;
        
        inventory[itemIndex] = {
            ...item,
            quantity: newQuantity,
            avgCost: newAvgCost,
            lastUpdate: transaction.date
        };
    }
    
    Store.set('inventory', inventory);
}

// 渲染今日记录表格
function renderDailyRecordsTable() {
    const transactions = Store.get('transactions', []);
    const products = Store.get('products', []);
    const tableBody = document.getElementById('dailyRecordsList');
    const today = Utils.getCurrentDate();
    
    // 清空表格
    tableBody.innerHTML = '';
    
    // 过滤今日记录
    const todayRecords = transactions.filter(t => Utils.formatDate(t.date) === today);
    
    // 添加记录行
    todayRecords.forEach(record => {
        const product = products.find(p => p.id === record.productId);
        if (!product) return; // 跳过找不到产品的记录
        
        const row = document.createElement('tr');
        const totalAmount = record.price * record.quantity;
        
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
            default:
                typeText = record.type;
                typeClass = '';
        }
        
        row.innerHTML = `
            <td data-label="时间">${new Date(record.date).toLocaleTimeString()}</td>
            <td data-label="类型" class="${typeClass}">${typeText}</td>
            <td data-label="产品">${product.name}</td>
            <td data-label="数量">${record.quantity} ${product.unit}</td>
            <td data-label="单价">${Utils.formatCurrency(record.price)}</td>
            <td data-label="金额">${Utils.formatCurrency(totalAmount)}</td>
            <td data-label="备注">${record.remark || '-'}</td>
            <td data-label="操作">
                <button class="btn-danger delete-record" data-id="${record.id}">删除</button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // 添加删除记录事件
    document.querySelectorAll('.delete-record').forEach(button => {
        button.addEventListener('click', function() {
            const recordId = parseInt(this.getAttribute('data-id'));
            if (confirm('确定要删除这条记录吗？这将同时更新相关库存。')) {
                deleteTransaction(recordId);
            }
        });
    });
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
    
    // 更新仪表盘
    updateDashboard();
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
    
    document.getElementById('totalSalesAmount').textContent = Utils.formatCurrency(totalAmount);
    document.getElementById('totalSalesCount').textContent = totalCount;
    document.getElementById('averageSalePrice').textContent = Utils.formatCurrency(averagePrice);
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
    
    // 计算总支出（采购）
    const expenseRecords = monthRecords.filter(t => t.type === 'purchase');
    const totalExpense = expenseRecords.reduce((sum, record) => sum + (record.price * record.quantity), 0);
    
    // 计算净利润
    const netProfit = totalIncome - totalExpense;
    
    // 更新财务汇总卡片
    document.getElementById('totalIncome').textContent = Utils.formatCurrency(totalIncome);
    document.getElementById('totalExpense').textContent = Utils.formatCurrency(totalExpense);
    document.getElementById('netProfit').textContent = Utils.formatCurrency(netProfit);
    
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
        const product = products.find(p => p.id === record.productId);
        if (!product) return; // 跳过找不到产品的记录
        
        const row = document.createElement('tr');
        const totalAmount = record.price * record.quantity;
        
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
            default:
                typeText = record.type;
                typeClass = '';
        }
        
        row.innerHTML = `
            <td data-label="日期">${Utils.formatDate(record.date)}</td>
            <td data-label="类型" class="${typeClass}">${typeText}</td>
            <td data-label="产品">${product.name}</td>
            <td data-label="数量">${record.quantity} ${product.unit}</td>
            <td data-label="金额">${Utils.formatCurrency(totalAmount)}</td>
            <td data-label="备注">${record.remark || '-'}</td>
        `;
        
        tableBody.appendChild(row);
    });
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
    
    // 初始化每天的数据
    for (let i = 1; i <= daysInMonth; i++) {
        const dateStr = `${month}-${String(i).padStart(2, '0')}`;
        labels.push(i); // 只显示日期数字
        dailyData[dateStr] = { income: 0, expense: 0 };
    }
    
    // 统计每天的收入和支出
    allTransactions.forEach(transaction => {
        const dateStr = Utils.formatDate(transaction.date);
        if (dateStr.startsWith(month)) {
            const amount = transaction.price * transaction.quantity;
            
            if (transaction.type === 'sale') {
                dailyData[dateStr].income += amount;
            } else if (transaction.type === 'purchase') {
                dailyData[dateStr].expense += amount;
            }
        }
    });
    
    // 准备图表数据
    const incomeData = labels.map(day => {
        const dateStr = `${month}-${String(day).padStart(2, '0')}`;
        return dailyData[dateStr].income;
    });
    
    const expenseData = labels.map(day => {
        const dateStr = `${month}-${String(day).padStart(2, '0')}`;
        return dailyData[dateStr].expense;
    });
    
    // 绘制图表
    const ctx = document.getElementById('financeChart');
    if (!ctx) {
        console.error('找不到财务图表画布元素');
        return;
    }
    
    // 销毁现有图表（如果存在）
    if (window.financeChart) {
        window.financeChart.destroy();
    }
    
    // 配置图表
    const chartConfig = {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: '收入',
                    data: incomeData,
                    backgroundColor: 'rgba(194, 51, 47, 0.7)',
                    borderColor: 'rgba(194, 51, 47, 1)',
                    borderWidth: 1
                },
                {
                    label: '支出',
                    data: expenseData,
                    backgroundColor: 'rgba(58, 96, 110, 0.7)',
                    borderColor: 'rgba(58, 96, 110, 1)',
                    borderWidth: 1
                }
            ]
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
                    text: '财务报表'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.dataset.label || '';
                            const value = Utils.formatCurrency(context.parsed.y);
                            return `${label}: ${value}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: '日期'
                    }
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '¥' + value;
                        }
                    },
                    title: {
                        display: true,
                        text: '金额 (¥)'
                    }
                }
            }
        }
    };
    
    // 使用安全的图表创建函数
    window.financeChart = safeCreateChart('financeChart', chartConfig, '财务图表');
}

// 报表分析功能
function setupReportFilters() {
    const reportTypeSelect = document.getElementById('reportType');
    const dateRangeInput = document.getElementById('reportDateRange');
    const generateBtn = document.getElementById('generateReportBtn');
    
    // 设置默认月份（当前月）
    dateRangeInput.value = Utils.getCurrentMonth();
    
    // 生成报表按钮点击事件
    generateBtn.addEventListener('click', function() {
        generateReport();
    });
    
    // 报表类型变更时更新日期输入控件
    reportTypeSelect.addEventListener('change', function() {
        updateReportDateInput(this.value);
    });
    
    // 初始设置日期输入控件
    updateReportDateInput(reportTypeSelect.value);
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
    const reportType = document.getElementById('reportType').value;
    const dateRange = document.getElementById('reportDateRange').value;
    
    switch (reportType) {
        case 'daily':
            generateDailyReport(dateRange);
            break;
        case 'monthly':
            generateMonthlyReport(dateRange);
            break;
        case 'product':
            generateProductReport(dateRange);
            break;
        case 'category':
            generateCategoryReport(dateRange);
            break;
    }
}

// 生成日报表
function generateDailyReport(date) {
    const transactions = Store.get('transactions', []);
    const products = Store.get('products', []);
    
    // 筛选当天交易记录
    const dayRecords = transactions.filter(t => Utils.formatDate(t.date) === date);
    
    // 设置标题
    document.getElementById('reportChartTitle').textContent = `日报表 - ${date}`;
    document.getElementById('reportTableTitle').textContent = `${date} 交易记录`;
    
    // 准备表格头部
    const tableHead = document.getElementById('reportTableHead');
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
    
    // 准备表格数据
    const tableBody = document.getElementById('reportTableBody');
    tableBody.innerHTML = '';
    
    // 总销售额和总成本
    let totalSales = 0;
    let totalCost = 0;
    
    // 按时间排序
    dayRecords.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // 添加记录行
    dayRecords.forEach(record => {
        const product = products.find(p => p.id === record.productId);
        if (!product) return; // 跳过找不到产品的记录
        
        const row = document.createElement('tr');
        const totalAmount = record.price * record.quantity;
        
        // 计算总额
        if (record.type === 'sale') {
            totalSales += totalAmount;
        } else if (record.type === 'purchase') {
            totalCost += totalAmount;
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
            default:
                typeText = record.type;
                typeClass = '';
        }
        
        row.innerHTML = `
            <td>${new Date(record.date).toLocaleTimeString()}</td>
            <td class="${typeClass}">${typeText}</td>
            <td>${product.name}</td>
            <td>${record.quantity} ${product.unit}</td>
            <td>${Utils.formatCurrency(record.price)}</td>
            <td>${Utils.formatCurrency(totalAmount)}</td>
            <td>${record.remark || '-'}</td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // 添加汇总行
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
    
    // 准备图表数据
    const salesByProduct = {};
    
    dayRecords.filter(t => t.type === 'sale').forEach(record => {
        const product = products.find(p => p.id === record.productId);
        if (!product) return;
        
        if (!salesByProduct[product.name]) {
            salesByProduct[product.name] = 0;
        }
        
        salesByProduct[product.name] += record.price * record.quantity;
    });
    
    const productNames = Object.keys(salesByProduct);
    const salesValues = productNames.map(name => salesByProduct[name]);
    
    // 绘制图表
    const ctx = document.getElementById('reportChart');
    if (!ctx) {
        console.error('找不到日报表图表画布元素');
        return;
    }
    
    // 销毁现有图表（如果存在）
    if (window.reportChart) {
        window.reportChart.destroy();
    }
    
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
                            text: '日销售产品分布'
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
            console.log('日报表图表创建成功');
        } catch (error) {
            console.error('创建日报表图表失败:', error);
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
}

// 设置所有事件监听器
function setupEventListeners() {
    // 设置产品模态框
    setupProductModal();
    
    // 设置库存模态框
    setupInventoryModal();
    
    // 添加产品按钮事件
    document.getElementById('addProductBtn').addEventListener('click', function() {
        openProductModal();
    });
    
    // 调整库存按钮事件
    document.getElementById('adjustInventoryBtn').addEventListener('click', function() {
        openInventoryModal();
    });
}

// 页面加载完成后初始化应用
document.addEventListener('DOMContentLoaded', function() {
    console.log('页面加载完成，开始初始化应用...');
    
    // 初始化应用
    initializeApp();
    
    console.log('应用初始化完成');
});

// 初始化应用
function initializeApp() {
    // 初始化示例数据
    initializeProducts();
    
    // 设置日期显示
    setupDateDisplay();
    
    // 设置导航
    setupNavigation();
    
    // 渲染各个页面内容
    updateDashboard();
    renderInventoryTable();
    renderProductsTable();
    setupDailyEntryForm();
    renderDailyRecordsTable();
    setupSalesFilters();
    renderSalesTable();
    setupFinanceFilters();
    renderFinanceData();
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
    
    const navLinks = document.querySelectorAll('nav ul li a');
    const pages = document.querySelectorAll('.page');
    
    // 移除所有页面的active类
    pages.forEach(page => page.classList.remove('active'));
    
    // 移除所有导航链接的active类
    navLinks.forEach(navLink => navLink.classList.remove('active'));
    
    // 查找并激活对应的导航链接
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.substring(1) === pageId) {
            link.classList.add('active');
        }
    });
    
    // 显示目标页面
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
    }
    
    // 根据目标页面执行特定操作
    if (pageId === 'dashboard') {
        updateDashboard();
    } else if (pageId === 'products') {
        renderProductsTable();
    } else if (pageId === 'inventory') {
        renderInventoryTable();
    } else if (pageId === 'daily-entry') {
        setupDailyEntryForm();
        renderDailyRecordsTable();
    } else if (pageId === 'sales') {
        setupSalesFilters();
        renderSalesTable();
    } else if (pageId === 'finance') {
        setupFinanceFilters();
        renderFinanceData();
    } else if (pageId === 'reports') {
        setupReportFilters();
    }
} 