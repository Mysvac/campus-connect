import api from './index';
import { DEBUG_MODE } from './index';
import { MOCK_DATA, getMockResponse } from './mockData';

// 商品交易相关 API
export default {
    // 获取所有商品
    getProducts: () => {
        if (DEBUG_MODE && !localStorage.getItem('jwt')) {
            console.log("DEBUG MODE: 返回模拟的商品列表数据");
            return getMockResponse(MOCK_DATA.products);
        }
        return api.get('/api/good/get-all-goods');
    },

    // 获取商品详情
    getProductDetail: (id) => {
        if (DEBUG_MODE && !localStorage.getItem('jwt')) {
            console.log("DEBUG MODE: 返回模拟的商品详情数据");
            const product = MOCK_DATA.products.find(p => p.gid === parseInt(id));
            return getMockResponse(product || MOCK_DATA.products[0]);
        }
        return api.get(`/api/good/get-good-by-gid/${id}`);
    },

    // 发布新商品
    createProduct: (data) => {
        if (DEBUG_MODE && !localStorage.getItem('jwt')) {
            console.log("DEBUG MODE: 模拟创建新商品");
            const newProduct = {
                gid: MOCK_DATA.products.length + 1,
                uid: 101, // 模拟用户ID
                name: data.name,
                price: data.price,
                tag: data.tag,
                intro: data.intro,
                image: data.image || null,
                quantity: data.quantity,
                sales: 0,
                time: Date.now()
            };
            MOCK_DATA.products.unshift(newProduct);
            return getMockResponse(newProduct);
        }
        return api.get('/api/good/add-goods', data);
    },

    // 购买商品
    purchaseProduct: (id, data) => {
        if (DEBUG_MODE && !localStorage.getItem('jwt')) {
            console.log("DEBUG MODE: 模拟购买商品");
            const product = MOCK_DATA.products.find(p => p.gid === parseInt(id));
            if (product) {
                if (product.quantity >= data.quantity) {
                    product.quantity -= data.quantity;
                    product.sales += data.quantity;
                    const order = {
                        oid: Date.now(),
                        gid: product.gid,
                        uid: 101, // 模拟用户ID
                        quantity: data.quantity,
                        total: product.price * data.quantity,
                        status: 0, // 进行中
                        time: Date.now()
                    };
                    return getMockResponse(order);
                } else {
                    return getMockResponse({ success: false, message: '商品库存不足' });
                }
            }
            return getMockResponse({ success: false, message: '商品不存在' });
        }
        return api.post(`/api/good/purchase/${id}`, data);
    },

    // 获取商品标签
    getProductTags: () => {
        if (DEBUG_MODE && !localStorage.getItem('jwt')) {
            console.log("DEBUG MODE: 返回模拟的商品标签数据");
            return getMockResponse(MOCK_DATA.productTags);
        }
        return api.get('/api/good/get-tags');
    },
    
    // 根据标签获取商品
    getProductsByTag: (tag) => {
        if (DEBUG_MODE && !localStorage.getItem('jwt')) {
            console.log("DEBUG MODE: 返回按标签过滤的模拟商品数据");
            const filteredProducts = MOCK_DATA.products.filter(p => p.tag === parseInt(tag));
            return getMockResponse(filteredProducts);
        }
        return api.get(`/api/good/get-good-by-tag/${tag}`);
    }
};