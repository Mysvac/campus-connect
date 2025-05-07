<template>
  <main class="transactions-main">
    <!-- 商品列表 -->
    <div v-if="!showNewPostForm && !selectedProduct" class="products-container">
      <div v-if="isLoading" class="loading-indicator">
        <p>加载中...</p>
      </div>

      <div v-else-if="filteredProducts.length === 0" class="empty-state">
        <p>暂无商品</p>
      </div>

      <div v-else class="products-grid">
        <div
            v-for="product in filteredProducts"
            :key="product.gid"
            class="product-card"
            @click="openProductDetail(product)"
        >
          <div class="product-image">
            <img v-if="product.image" :src="product.image" :alt="product.name">
            <div v-else class="image-placeholder">暂无图片</div>
          </div>

          <div class="product-info">
            <h3 class="product-name">{{ product.name }}</h3>
            <p class="product-price">￥{{ (product.price / 100).toFixed(2) }}</p>
            <p class="product-tag">{{ getTagName(product.tag) }}</p>
            <div class="product-stats">
              <span class="product-quantity">余量: {{ product.quantity }}</span>
              <span class="product-sales">已售: {{ product.sales }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="bottom-stripe"></div>
    </div>

    <!-- 新建商品表单 -->
    <div v-if="showNewPostForm" class="full-page-view new-product-form-container">
      <div class="form-header">
        <h2>新建商品</h2>
        <button class="close-btn" @click="$emit('hide-new-post-form')">×</button>
      </div>
      <form @submit.prevent="submitNewProduct" class="new-product-form">
        <div class="form-group">
          <label for="productName">商品名称</label>
          <input
              type="text"
              id="productName"
              v-model="newProduct.name"
              required
              maxlength="32"
              placeholder="请输入商品名称"
          >
        </div>

        <div class="form-group">
          <label for="productPrice">价格 (元)</label>
          <input
              type="number"
              id="productPrice"
              v-model="newProduct.price"
              required
              min="0.01"
              step="0.01"
              placeholder="请输入商品价格"
          >
        </div>

        <div class="form-group">
          <label for="productTag">商品标签</label>
          <select id="productTag" v-model="newProduct.tag" required>
            <option value="" disabled>请选择标签</option>
            <option v-for="tag in tagOptions" :key="tag.id" :value="tag.id">{{ tag.name }}</option>
          </select>
        </div>

        <div class="form-group">
          <label for="productQuantity">商品数量</label>
          <input
              type="number"
              id="productQuantity"
              v-model="newProduct.quantity"
              required
              min="1"
              step="1"
              placeholder="请输入商品数量"
          >
        </div>

        <div class="form-group">
          <label for="productImage">商品图片</label>
          <input
              type="file"
              id="productImage"
              @change="handleImageUpload"
              accept="image/jpeg,image/png"
          >
          <p class="help-text">*支持jpg, png格式，建议尺寸600×400px</p>
        </div>

        <div class="form-group">
          <label for="productIntro">商品简介</label>
          <textarea
              id="productIntro"
              v-model="newProduct.intro"
              maxlength="100"
              placeholder="请输入商品简介"
              rows="3"
          ></textarea>
        </div>

        <div class="form-actions">
          <button type="submit" class="submit-btn">发布商品</button>
          <button type="button" class="cancel-btn" @click="$emit('hide-new-post-form')">取消</button>
        </div>
      </form>

      <div class="bottom-stripe"></div>
    </div>

    <!-- 商品详情页面 -->
    <div v-if="selectedProduct" class="full-page-view product-detail-view">
      <div class="modal-header">
        <h2>{{ selectedProduct.name }}</h2>
        <button class="close-btn" @click="closeProductDetail">×</button>
      </div>

      <div class="product-detail-content">
        <div class="product-image">
          <img v-if="selectedProduct.image" :src="selectedProduct.image" :alt="selectedProduct.name">
          <div v-else class="image-placeholder">暂无图片</div>
        </div>

        <div class="product-info">
          <p class="product-price">￥{{ (selectedProduct.price / 100).toFixed(2) }}</p>
          <p class="product-tag">标签: {{ getTagName(selectedProduct.tag) }}</p>
          <p class="product-quantity">剩余数量: {{ selectedProduct.quantity }}</p>
          <p class="product-sales">已售: {{ selectedProduct.sales }}</p>
          <p class="product-intro">{{ selectedProduct.intro || '暂无简介' }}</p>
          <p class="product-time">发布时间: {{ formatTime(selectedProduct.time) }}</p>
        </div>
      </div>

      <div class="purchase-section">
        <div class="quantity-selector">
          <button @click="decreasePurchaseQuantity" :disabled="purchaseQuantity <= 1">-</button>
          <input type="number" v-model.number="purchaseQuantity" min="1" :max="selectedProduct.quantity">
          <button @click="increasePurchaseQuantity" :disabled="purchaseQuantity >= selectedProduct.quantity">+</button>
        </div>

        <div class="purchase-actions">
          <button class="purchase-btn" @click="purchaseProduct" :disabled="selectedProduct.quantity < 1">
            立即购买
          </button>
        </div>
      </div>

      <div class="bottom-stripe"></div>
    </div>
  </main>
</template>

<script>
import { transactionsApi } from '@/api';

export default {
  name: 'TransactionsMain',
  props: {
    currentTag: {
      type: [String, Number],
      default: null
    },
    showNewPostForm: {
      type: Boolean,
      default: false
    },
    searchQuery: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      isLoading: true,
      products: [],
      tagOptions: [],
      newProduct: {
        name: '',
        price: '',
        tag: '',
        image: '',
        intro: '',
        quantity: 1
      },
      selectedProduct: null,
      purchaseQuantity: 1,
      isMobile: window.innerWidth < 768,
      error: null
    };
  },
  computed: {
    filteredProducts() {
      let result = this.products;

      // 按标签筛选
      if (this.currentTag) {
        result = result.filter(product => product.tag == this.currentTag);
      }

      // 按搜索关键词筛选
      if (this.searchQuery && this.searchQuery.trim() !== '') {
        const query = this.searchQuery.toLowerCase().trim();
        result = result.filter(product =>
            product.name.toLowerCase().includes(query) ||
            (product.intro && product.intro.toLowerCase().includes(query))
        );
      }

      // 按发布时间排序（新的在前）
      return result.sort((a, b) => b.time - a.time);
    }
  },
  mounted() {
    window.addEventListener('resize', this.updateWindowSize);
    this.fetchProductTags();
    this.fetchProducts();
    this.updateWindowSize();
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.updateWindowSize);
  },
  methods: {
    // 发出更新事件，通知父组件
    emitProductsData() {
      this.$emit('products-updated', this.products);
    },

    // 按ID显示产品
    showProductById(productId) {
      this.isLoading = true;
      transactionsApi.getProductDetail(productId)
        .then(response => {
          if (response.data && response.data.code === 1) {
            this.openProductDetail(response.data.data);
          } else {
            console.error('获取商品详情失败:', response.data.msg);
            alert('获取商品详情失败: ' + (response.data.msg || '未知错误'));
          }
        })
        .catch(error => {
          console.error('获取商品详情出错:', error);
          alert('网络错误，请稍后再试');
        })
        .finally(() => {
          this.isLoading = false;
        });
    },

    // 获取商品列表
    fetchProducts() {
      this.isLoading = true;
      transactionsApi.getProducts()
        .then(response => {
          if (response.data && response.data.code === 1) {
            this.products = response.data.data || [];
            this.emitProductsData();
          } else {
            console.error('获取商品列表失败:', response.data.msg);
            this.error = response.data.msg || '获取商品列表失败';
          }
        })
        .catch(error => {
          console.error('获取商品列表出错:', error);
          this.error = '网络错误，请稍后再试';
        })
        .finally(() => {
          this.isLoading = false;
        });
    },

    // 获取商品标签
    fetchProductTags() {
      transactionsApi.getProductTags()
        .then(response => {
          if (response.data && response.data.code === 1) {
            this.tagOptions = response.data.data || [];
          } else {
            console.error('获取商品标签失败:', response.data.msg);
          }
        })
        .catch(error => {
          console.error('获取商品标签出错:', error);
        });
    },

    handleImageUpload(event) {
      const file = event.target.files[0];
      if (file) {
        // 实际中，这里应该有上传图片到服务器的逻辑
        // 为了演示，我们只是创建一个本地URL
        this.newProduct.image = URL.createObjectURL(file);
      }
    },

    submitNewProduct() {
      // 将价格转换为分
      const priceInCents = Math.round(parseFloat(this.newProduct.price) * 100);

      const productData = {
        name: this.newProduct.name,
        price: priceInCents,
        tag: parseInt(this.newProduct.tag),
        image: this.newProduct.image || null,
        intro: this.newProduct.intro,
        quantity: parseInt(this.newProduct.quantity)
      };

      this.isSubmitting = true;
      
      transactionsApi.createProduct(productData)
        .then(response => {
          if (response.data && response.data.code === 1) {
            // 重置表单
            this.newProduct = {
              name: '',
              price: '',
              tag: '',
              image: '',
              intro: '',
              quantity: 1
            };
            
            // 重新获取商品列表
            this.fetchProducts();
            
            // 隐藏表单
            this.$emit('hide-new-post-form');
            
            // 显示成功提示
            alert('商品发布成功！');
          } else {
            console.error('发布商品失败:', response.data.msg);
            alert('发布商品失败: ' + (response.data.msg || '未知错误'));
          }
        })
        .catch(error => {
          console.error('发布商品出错:', error);
          alert('网络错误，请稍后再试');
        })
        .finally(() => {
          this.isSubmitting = false;
        });
    },

    openProductDetail(product) {
      this.selectedProduct = { ...product };
      this.purchaseQuantity = 1;
      window.scrollTo(0, 0); // 滚动到页面顶部
    },

    closeProductDetail() {
      this.selectedProduct = null;
      this.purchaseQuantity = 1;
      window.scrollTo(0, 0); // 滚动到页面顶部
    },

    decreasePurchaseQuantity() {
      if (this.purchaseQuantity > 1) {
        this.purchaseQuantity--;
      }
    },

    increasePurchaseQuantity() {
      if (this.purchaseQuantity < this.selectedProduct.quantity) {
        this.purchaseQuantity++;
      }
    },

    purchaseProduct() {
      if (!this.selectedProduct) return;

      const purchaseData = {
        gid: this.selectedProduct.gid,
        quantity: this.purchaseQuantity
      };

      this.isPurchasing = true;
      
      transactionsApi.purchaseProduct(this.selectedProduct.gid, purchaseData)
        .then(response => {
          if (response.data && response.data.code === 1) {
            // 更新商品库存和销量
            this.fetchProducts();
            
            // 关闭商品详情
            this.closeProductDetail();
            
            // 显示成功提示
            alert(`购买成功！订单号: ${response.data.data.oid || '未知'}`);
          } else {
            console.error('购买商品失败:', response.data.msg);
            alert('购买商品失败: ' + (response.data.msg || '未知错误'));
          }
        })
        .catch(error => {
          console.error('购买商品出错:', error);
          alert('网络错误，请稍后再试');
        })
        .finally(() => {
          this.isPurchasing = false;
        });
    },

    getTagName(tagId) {
      const tag = this.tagOptions.find(t => t.id == tagId);
      return tag ? tag.name : '未分类';
    },

    formatTime(timestamp) {
      const date = new Date(timestamp);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    },

    updateWindowSize() {
      this.isMobile = window.innerWidth < 768;
    }
  },
  watch: {
    products: {
      handler() {
        this.emitProductsData();
      },
      deep: true
    },
    currentTag() {
      // 当标签变化时，可能需要重新筛选数据
      this.fetchProducts();
    },
    searchQuery() {
      // 当搜索关键词变化时，可能需要重新筛选数据
      // 这里暂不重新请求API，而是在前端进行筛选
    }
  }
}
</script>

<style scoped>
/* Main container styles */
.transactions-main {
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: 100%;
  background-color: #f5f5f5;
}

/* Section title styling */
.section-title {
  font-size: 1.5rem;
  margin-bottom: 20px;
  color: #8B0000; /* Dark red matching header */
  position: relative;
  padding-bottom: 10px;
  text-align: center;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background: linear-gradient(135deg, #8B0000 0%, #B22222 100%);
  border-radius: 3px;
}

.product-count {
  font-size: 0.9rem;
  color: #666;
  font-weight: normal;
}

/* Loading and empty states */
.loading-indicator, .empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 1.1rem;
  color: #777;
  font-style: italic;
}

/* Products grid layout */
.products-container {
  background-color: #fff9f7;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  flex-grow: 1;
  overflow-y: auto;
  border: 1px solid #e0e0e0;
  background-image: url("https://www.transparenttextures.com/patterns/transparent-square-tiles.png");
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr); /* 每行固定 5 个 */
  gap: 15px;
  margin-top: 20px;
}

@media (max-width: 1024px) {
  .products-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 600px) {
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Product card styling - modern card style instead of post-it note */
.product-card {
  background-color: #ffffff;
  border-radius: 6px;
  padding: 10px; /* 缩小内边距 */
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  position: relative;
  border: 1px solid #e0e0e0;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  height: 100%;
  display: flex;
  flex-direction: column;
  max-width: 180px; /* 控制商品卡片宽度 */
  background-image: url("https://www.transparenttextures.com/patterns/transparent-square-tiles.png");
}

/* Remove post-it note effect */
.product-card::before {
  content: none; /* Remove the folded corner effect */
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
}

/* 图片高度小一点 */
.product-image {
  width: 100%;
  height: 110px; /* 原来是140 */
  margin-bottom: 8px;
  overflow: hidden;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.product-card:hover .product-image img {
  transform: scale(1.05); /* Subtle zoom effect on hover */
}

/* Product information styling - modernized */
.product-info {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.product-name {
  font-size: 0.95rem;
  margin: 0 0 4px 0; /* 减小与价格之间的间距 */
  color: #333;
  font-weight: 600;
  height: 2.2em;
  line-height: 1.1;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.product-price {
  font-size: 1rem;
  color: #B22222;
  font-weight: bold;
  margin: 0 0 6px 0; /* 减小底部间距 */
}

.product-tag {
  background-color: rgba(139, 0, 0, 0.1);
  color: #8B0000;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.7rem;
  align-self: flex-start;
  margin-bottom: 6px;
  border: none; /* Remove border for cleaner look */
}

.product-stats {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: #777;
  margin-top: auto;
  border-top: 1px solid #eee; /* Lighter border */
  padding-top: 10px;
}

/* Product detail view styling */
.full-page-view {
  background-color: #f9f9f9;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  flex-grow: 1;
  border: 1px solid #e0e0e0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header, .form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  color: white;
}

.modal-header h2, .form-header h2 {
  color: #777;
  margin: 0;
  font-size: 1.3rem;
  font-family: 'Georgia', serif;
}

.close-btn {
  background: none;
  border: none;
  color: #777;
  font-size: 1.8rem;
  cursor: pointer;
  line-height: 1;
  padding: 0 5px;
}

.close-btn:hover {
  transform: scale(1.2);
}

.product-detail-content {
  padding: 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.product-detail-content .product-image {
  width: 300px;
  height: 300px;
  flex-shrink: 0;
}

.product-detail-content .product-info {
  flex: 1;
  min-width: 250px;
}

.product-detail-content .product-name {
  font-size: 1.4rem;
  height: auto;
  margin-top: 0;
}

.product-detail-content .product-price {
  font-size: 1.6rem;
  margin: 10px 0;
}

.product-detail-content .product-intro {
  line-height: 1.6;
  margin: 15px 0;
  color: #333;
}

.product-detail-content .product-time {
  color: #777;
  font-size: 0.9rem;
  margin-top: 15px;
}

/* Purchase section */
.purchase-section {
  margin-top: auto;
  padding: 15px 20px;
  background-color: #f0f0f0;
  border-top: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.quantity-selector {
  display: flex;
  align-items: center;
  border: 1px solid #8B0000;
  border-radius: 4px;
  overflow: hidden;
}

.quantity-selector button {
  width: 30px;
  height: 30px;
  background-color: #f0f0f0;
  border: none;
  color: #8B0000;
  font-size: 1.2rem;
  cursor: pointer;
}

.quantity-selector button:hover {
  background-color: #e0e0e0;
}

.quantity-selector input {
  width: 50px;
  height: 30px;
  text-align: center;
  border: none;
  border-left: 1px solid #8B0000;
  border-right: 1px solid #8B0000;
}

.purchase-btn {
  padding: 10px 25px;
  background: linear-gradient(135deg, #8B0000 0%, #B22222 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  font-family: 'Georgia', serif;
  font-weight: 500;
}

.purchase-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(139, 0, 0, 0.3);
}

.purchase-btn:disabled {
  background: #cccccc;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* New product form styling */
.new-product-form-container {
  padding: 0;
}

.new-product-form {
  padding: 20px;
  overflow-y: auto;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #8B0000;
  font-family: 'Georgia', serif;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 10px;
  border: 1px solid #8B0000;
  border-radius: 8px;
  font-size: 0.95rem;
  color: #333;
  background-color: #fffdf0;
  font-family: 'Georgia', serif;
}

.form-group select {
  appearance: none;
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%238B0000' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  padding-right: 30px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 30px;
}

.cancel-btn,
.submit-btn {
  padding: 10px 25px;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  font-family: 'Georgia', serif;
}

.cancel-btn {
  background-color: transparent;
  border: 1px solid #8B0000;
  color: #8B0000;
}

.cancel-btn:hover {
  background-color: rgba(139, 0, 0, 0.1);
}

.submit-btn {
  background: linear-gradient(135deg, #8B0000 0%, #B22222 100%);
  border: none;
  color: white;
  box-shadow: 0 4px 6px rgba(139, 0, 0, 0.3);
}

.submit-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(139, 0, 0, 0.4);
}


/* Scrollbar styling */
.products-container::-webkit-scrollbar,
.new-product-form::-webkit-scrollbar {
  width: 8px;
}

.products-container::-webkit-scrollbar-track,
.new-product-form::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.products-container::-webkit-scrollbar-thumb,
.new-product-form::-webkit-scrollbar-thumb {
  background: rgba(139, 0, 0, 0.5);
  border-radius: 4px;
}

.products-container::-webkit-scrollbar-thumb:hover,
.new-product-form::-webkit-scrollbar-thumb:hover {
  background: rgba(139, 0, 0, 0.7);
}
</style>