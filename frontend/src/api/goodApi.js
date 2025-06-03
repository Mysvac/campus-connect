import api from './index';
import { DEBUG_MODE } from './index';
import { MOCK_DATA, getMockResponse } from './mockData';

// 商品交易相关 API
export default {
    // 获取所有商品
    getProducts: () => {
        if (DEBUG_MODE && localStorage.getItem('isAuthenticated') !== 'true') {
            console.log("DEBUG MODE: 返回模拟的商品列表数据");
            return getMockResponse(MOCK_DATA.products);
        }
        return api.get('/api/good/get-all-goods');
    },

    // 获取商品详情
    getProductDetail: (id) => {
        if (DEBUG_MODE && localStorage.getItem('isAuthenticated') !== 'true') {
            console.log("DEBUG MODE: 返回模拟的商品详情数据");
            const product = MOCK_DATA.products.find(p => p.gid === parseInt(id));
            return getMockResponse(product || MOCK_DATA.products[0]);
        }
        return api.get(`/api/good/get-good-by-gid/${id}`);
    },

    // 上传图片
    uploadImage: (formData) => {
        if (DEBUG_MODE && localStorage.getItem('isAuthenticated') !== 'true') {
            console.log("DEBUG MODE: 模拟上传图片");
            // 模拟返回一个图片URL
            const mockImageUrl = `/image/mock-${Date.now()}.jpg`;
            return getMockResponse({ url: mockImageUrl });
        }
        return api.post('/api/image/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    },

    // 发布新商品
    createProduct: (data) => {
        if (DEBUG_MODE && localStorage.getItem('isAuthenticated') !== 'true') {
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
        return api.post('/api/good/add-goods', data);
    },

    // 购买商品
    purchaseProduct: (id, data) => {
        if (DEBUG_MODE && localStorage.getItem('isAuthenticated') !== 'true') {
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
        if (DEBUG_MODE && localStorage.getItem('isAuthenticated') !== 'true') {
            console.log("DEBUG MODE: 返回模拟的商品标签数据");
            return getMockResponse(MOCK_DATA.productTags);
        }
        return api.get('/api/good/get-tags');
    },
    
    // 根据标签获取商品
    getProductsByTag: (tagId) => {
        if (DEBUG_MODE && localStorage.getItem('isAuthenticated') !== 'true') {
            console.log("DEBUG MODE: 返回模拟的标签筛选商品数据");
            const products = tagId === 0 ? 
                MOCK_DATA.products : 
                MOCK_DATA.products.filter(p => p.tag === tagId);
            return getMockResponse(products);
        }
        return api.get(`/api/good/get-goods-by-tag/${tagId}`);
    },
      // 获取用户发布的商品
    getUserProducts: (userId) => {
        if (DEBUG_MODE && localStorage.getItem('isAuthenticated') !== 'true') {
            console.log("DEBUG MODE: 返回模拟的用户发布商品数据");
            const products = MOCK_DATA.products.filter(p => p.uid === parseInt(userId));
            return getMockResponse(products);
        }
        return api.get(`/api/good/get-all-goods-by-uid/${userId}`);
    },
    
    // 更新商品信息
    updateProduct: (data) => {
        if (DEBUG_MODE && localStorage.getItem('isAuthenticated') !== 'true') {
            console.log("DEBUG MODE: 模拟更新商品");
            const product = MOCK_DATA.products.find(p => p.gid === data.gid);
            if (product) {
                Object.assign(product, data);
                return getMockResponse({success: true});
            }
            return getMockResponse({success: false});
        }
        return api.post('/api/good/update-good', data);
    },
      // 删除商品
    deleteProduct: (id) => {
        if (DEBUG_MODE && localStorage.getItem('isAuthenticated') !== 'true') {
            console.log("DEBUG MODE: 模拟删除商品");
            const index = MOCK_DATA.products.findIndex(p => p.gid === parseInt(id));
            if (index !== -1) {
                MOCK_DATA.products.splice(index, 1);
                return getMockResponse({success: true});
            }
            return getMockResponse({success: false});
        }
        return api.delete(`/api/good/delete-goods-by-gid/${id}`);
    },

    // 获取当前用户购买的商品订单
    getUserOrders: () => {
        if (DEBUG_MODE && localStorage.getItem('isAuthenticated') !== 'true') {
            console.log("DEBUG MODE: 返回模拟的用户购买订单数据");
            // 模拟返回当前用户的购买订单
            const mockOrders = [
                { 
                    gid: 2001, 
                    uid: 101, 
                    number: 1, 
                    time: Date.now() - 3600000, 
                    status: 0, 
                    sum: 2990 
                },
                { 
                    gid: 2002, 
                    uid: 101, 
                    number: 2, 
                    time: Date.now() - 7200000, 
                    status: 3, 
                    sum: 5980 
                }
            ];
            return getMockResponse(mockOrders);
        }
        return api.get('/api/good/get-goodsbuy');
    }
};