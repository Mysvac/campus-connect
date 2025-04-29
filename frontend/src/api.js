import axios from 'axios';
import router from '@/router'; // 假设您使用Vue Router

// 调试模式开关，在开发环境下可以绕过登录检查
const DEBUG_MODE = true;

// 模拟数据，在调试模式下使用
const MOCK_DATA = {
  // 留言列表
  messages: [
    {
      mid: 1,
      uid: 1001,
      title: "校园活动建议",
      content: "希望学校能够组织更多的户外活动，增加同学们的交流机会。",
      tag: "活动",
      time: Date.now() - 3 * 86400000, // 3天前
      praise: 15,
      isLiked: false,
      comments: [
        {
          cid: 101,
          uid: 1002,
          content: "支持这个提议，户外活动很有必要！",
          time: Date.now() - 2 * 86400000,
          praise: 5,
          isLiked: false
        },
        {
          cid: 102,
          uid: 1003,
          content: "希望能有更多团队合作类的活动。",
          time: Date.now() - 1 * 86400000,
          praise: 3,
          isLiked: false
        }
      ]
    },
    {
      mid: 2,
      uid: 1002,
      title: "食堂菜品建议",
      content: "希望食堂能够增加一些健康饮食选项，提供更多的蔬菜水果。",
      tag: "生活",
      time: Date.now() - 2 * 86400000, // 2天前
      praise: 23,
      isLiked: false,
      comments: [
        {
          cid: 201,
          uid: 1001,
          content: "赞同，健康饮食很重要！",
          time: Date.now() - 1 * 86400000,
          praise: 7,
          isLiked: false
        }
      ]
    },
    {
      mid: 3,
      uid: 1003,
      title: "自习室开放时间",
      content: "建议延长自习室的开放时间，特别是在考试季节。",
      tag: "学习",
      time: Date.now() - 1 * 86400000, // 1天前
      praise: 45,
      isLiked: false,
      comments: []
    },
    {
      mid: 4,
      uid: 1004,
      title: "失物招领平台建议",
      content: "希望学校能建立一个线上失物招领平台，方便大家查找丢失物品。",
      tag: "失物",
      time: Date.now() - 12 * 3600000, // 12小时前
      praise: 36,
      isLiked: false,
      comments: [
        {
          cid: 401,
          uid: 1005,
          content: "非常需要这样的平台！",
          time: Date.now() - 10 * 3600000,
          praise: 8,
          isLiked: false
        },
        {
          cid: 402,
          uid: 1001,
          content: "可以考虑与学校的微信公众号结合起来。",
          time: Date.now() - 8 * 3600000,
          praise: 12,
          isLiked: false
        },
        {
          cid: 403,
          uid: 1002,
          content: "我之前也丢过东西，很麻烦。",
          time: Date.now() - 6 * 3600000,
          praise: 3,
          isLiked: false
        }
      ]
    },
    {
      mid: 5,
      uid: 1005,
      title: "校园网络问题",
      content: "宿舍区的网络经常断线，希望能够改善网络基础设施。",
      tag: "吐槽",
      time: Date.now() - 6 * 3600000, // 6小时前
      praise: 78,
      isLiked: false,
      comments: [
        {
          cid: 501,
          uid: 1001,
          content: "强烈支持！网络太慢了。",
          time: Date.now() - 5 * 3600000,
          praise: 25,
          isLiked: false
        },
        {
          cid: 502,
          uid: 1004,
          content: "特别是晚上高峰期，几乎无法使用。",
          time: Date.now() - 4 * 3600000,
          praise: 18,
          isLiked: false
        }
      ]
    }
  ],

  // 商品交易数据
  products: [
    {
      gid: 1,
      uid: 101,
      price: 2990, // 单位：分
      name: '二手课本 《数据结构》',
      image: '/api/placeholder/200/200',
      tag: 1, // 对应标签ID
      intro: '全新教材，只翻过几次，无笔记',
      quantity: 1,
      sales: 0,
      time: Date.now() - 86400000 * 2 // 2天前
    },
    {
      gid: 2,
      uid: 102,
      price: 14900,
      name: '罗技无线鼠标',
      image: '/api/placeholder/200/200',
      tag: 3,
      intro: '使用3个月，外观9成新，功能完好',
      quantity: 1,
      sales: 0,
      time: Date.now() - 86400000 * 3
    },
    {
      gid: 3,
      uid: 103,
      price: 3500,
      name: '自习室月卡',
      image: '/api/placeholder/200/200',
      tag: 2,
      intro: '购买后可使用图书馆旁自习室，环境安静，有空调',
      quantity: 10,
      sales: 5,
      time: Date.now() - 86400000 * 1
    },
    {
      gid: 4,
      uid: 104,
      price: 5990,
      name: '全新篮球',
      image: '/api/placeholder/200/200',
      tag: 4,
      intro: '斯伯丁篮球，手感好',
      quantity: 2,
      sales: 3,
      time: Date.now() - 86400000 * 5
    },
    {
      gid: 5,
      uid: 101,
      price: 1990,
      name: '英语四级词汇书',
      image: '/api/placeholder/200/200',
      tag: 1,
      intro: '含有大量例句和记忆方法，备考必备',
      quantity: 1,
      sales: 10,
      time: Date.now() - 86400000 * 7
    },
  ],

  // 商品标签
  productTags: [
    { id: 1, name: '图书教材' },
    { id: 2, name: '生活服务' },
    { id: 3, name: '电子产品' },
    { id: 4, name: '运动器材' },
    { id: 5, name: '服装鞋帽' },
    { id: 6, name: '日用百货' },
    { id: 7, name: '票券礼品' },
    { id: 8, name: '其他' },
  ],

  // 评分数据
  ratings: [
    {
      rid: 1,
      sid: 1,
      uid: 101,
      targetType: 'course',
      targetId: 'CS101',
      targetName: '计算机导论',
      goal: '计算机导论',
      rating: 4.5,
      score: 4.5,
      review: '内容丰富，讲解清晰，但作业有点多',
      tag: '课程教学',
      intro: '计算机科学入门课程，涵盖计算机基础、编程思想和算法导论等内容，由王教授主讲。',
      image: 'https://via.placeholder.com/600x400?text=Computer+Science',
      num: 32,
      time: Date.now() - 86400000 * 5,
      likes: 12,
      isLiked: false,
      comments: [
        {
          cid: 101,
          uid: 102,
          userName: '学生李明',
          userAvatar: 'https://via.placeholder.com/48',
          content: '同意，作业确实有点多',
          comment: '同意，作业确实有点多',
          score: 4.0,
          time: Date.now() - 86400000 * 4,
          likes: 3,
          isLiked: false
        }
      ]
    },
    {
      rid: 2,
      sid: 2,
      uid: 102,
      targetType: 'course',
      targetId: 'MATH201',
      targetName: '高等数学',
      goal: '高等数学',
      rating: 3.5,
      score: 3.5,
      review: '内容较难，需要花时间理解，但老师讲解认真',
      tag: '课程教学',
      intro: '数学系核心课程，主要讲授微积分、线性代数基础知识，适合一年级学生学习。',
      image: 'https://via.placeholder.com/600x400?text=Advanced+Mathematics',
      num: 45,
      time: Date.now() - 86400000 * 7,
      likes: 8,
      isLiked: false,
      comments: []
    },
    {
      rid: 3,
      sid: 3,
      uid: 103,
      targetType: 'professor',
      targetId: 'P001',
      targetName: '张教授',
      goal: '张教授',
      rating: 5.0,
      score: 5.0,
      review: '非常负责任的老师，讲课生动有趣',
      tag: '课程教学',
      intro: '计算机科学学院教授，主要研究方向为人工智能和机器学习，曾获国家级教学成果奖。',
      image: 'https://via.placeholder.com/600x400?text=Professor+Zhang',
      num: 56,
      time: Date.now() - 86400000 * 3,
      likes: 20,
      isLiked: false,
      comments: [
        {
          cid: 301,
          uid: 104,
          userName: '学生王华',
          userAvatar: 'https://via.placeholder.com/48',
          content: '我上过他的课，确实很好',
          comment: '我上过他的课，确实很好，能把复杂的概念解释得浅显易懂，课堂气氛也很活跃。',
          score: 5.0,
          time: Date.now() - 86400000 * 2,
          likes: 5,
          isLiked: false
        }
      ]
    },
    {
      rid: 4,
      sid: 4,
      uid: 104,
      targetType: 'facility',
      targetId: 'F001',
      targetName: '中心图书馆',
      goal: '中心图书馆',
      rating: 4.0,
      score: 4.0,
      review: '环境安静，藏书丰富，但座位有时不太够',
      tag: '学习场所',
      intro: '学校主图书馆，拥有200万册藏书和1000个阅览座位，24小时自习区，环境安静舒适。',
      image: 'https://via.placeholder.com/600x400?text=Central+Library',
      num: 128,
      time: Date.now() - 86400000 * 6,
      likes: 15,
      isLiked: false,
      comments: [
        {
          cid: 401,
          uid: 105,
          userName: '学生赵芳',
          userAvatar: 'https://via.placeholder.com/48',
          content: '周末常常位置不够，建议增加座位',
          comment: '周末常常位置不够，建议增加座位，特别是考试季节更加拥挤。',
          score: 3.5,
          time: Date.now() - 86400000 * 5,
          likes: 12,
          isLiked: false
        },
        {
          cid: 402,
          uid: 106,
          userName: '学生林杰',
          userAvatar: 'https://via.placeholder.com/48',
          content: '空调温度有点低，记得多穿点',
          comment: '空调温度有点低，记得多穿点，但整体环境很好，很适合长时间学习。',
          score: 4.0,
          time: Date.now() - 86400000 * 3,
          likes: 8,
          isLiked: false
        }
      ]
    },
    {
      rid: 5,
      sid: 5,
      uid: 105,
      targetType: 'canteen',
      targetId: 'C001',
      targetName: '一号食堂',
      goal: '一号食堂',
      rating: 3.0,
      score: 3.0,
      review: '饭菜种类多，但味道一般，价格适中',
      tag: '餐饮美食',
      intro: '学校最大的食堂，提供各种中式菜肴和部分西式快餐，可容纳800人同时就餐。',
      image: 'https://via.placeholder.com/600x400?text=Canteen+No.1',
      num: 210,
      time: Date.now() - 86400000 * 2,
      likes: 10,
      isLiked: false,
      comments: [
        {
          cid: 501,
          uid: 106,
          userName: '学生陈明',
          userAvatar: 'https://via.placeholder.com/48',
          content: '价格确实实惠，但希望能提高菜品质量',
          comment: '价格确实实惠，但希望能提高菜品质量，特别是蔬菜种类可以更丰富一些。',
          score: 3.0,
          time: Date.now() - 86400000 * 1,
          likes: 15,
          isLiked: false
        }
      ]
    },
    {
      rid: 6,
      sid: 6,
      uid: 106,
      targetType: 'dormitory',
      targetId: 'D001',
      targetName: '1号学生公寓',
      goal: '1号学生公寓',
      rating: 4.2,
      score: 4.2,
      review: '宿舍条件不错，独立卫浴，但夏天有点热',
      tag: '住宿条件',
      intro: '位于校园东区的本科生宿舍楼，四人间配备空调和独立卫浴，有洗衣房和公共厨房。',
      image: 'https://via.placeholder.com/600x400?text=Dormitory+No.1',
      num: 87,
      time: Date.now() - 86400000 * 4,
      likes: 22,
      isLiked: false,
      comments: [
        {
          cid: 601,
          uid: 107,
          userName: '学生周琳',
          userAvatar: 'https://via.placeholder.com/48',
          content: '楼下洗衣房设施挺好用的',
          comment: '楼下洗衣房设施挺好用的，也很干净，不过周末会比较拥挤，建议错峰使用。',
          score: 4.5,
          time: Date.now() - 86400000 * 3,
          likes: 6,
          isLiked: false
        }
      ]
    },
    {
      rid: 7,
      sid: 7,
      uid: 107,
      targetType: 'gym',
      targetId: 'G001',
      targetName: '校园体育中心',
      goal: '校园体育中心',
      rating: 4.7,
      score: 4.7,
      review: '设施齐全，环境优美，是锻炼身体的好地方',
      tag: '运动健身',
      intro: '校园体育中心包含室内游泳池、健身房、篮球场和羽毛球场等多种运动设施，环境整洁，设备先进。',
      image: 'https://via.placeholder.com/600x400?text=Campus+Gym',
      num: 95,
      time: Date.now() - 86400000 * 8,
      likes: 30,
      isLiked: false,
      comments: [
        {
          cid: 701,
          uid: 108,
          userName: '学生刘强',
          userAvatar: 'https://via.placeholder.com/48',
          content: '健身房设备很齐全，教练也很专业',
          comment: '健身房设备很齐全，教练也很专业，值得推荐给想要锻炼的同学。',
          score: 4.8,
          time: Date.now() - 86400000 * 7,
          likes: 10,
          isLiked: false
        }
      ]
    },
    {
      rid: 8,
      sid: 8,
      uid: 108,
      targetType: 'service',
      targetId: 'S001',
      targetName: '校园快递服务点',
      goal: '校园快递服务点',
      rating: 3.8,
      score: 3.8,
      review: '位置便捷，但高峰期排队较长',
      tag: '校园服务',
      intro: '位于学生活动中心一层的校园快递服务点，提供快递收发和代取服务，工作时间为每天上午8点至晚上8点。',
      image: 'https://via.placeholder.com/600x400?text=Campus+Delivery',
      num: 142,
      time: Date.now() - 86400000 * 10,
      likes: 18,
      isLiked: false,
      comments: [
        {
          cid: 801,
          uid: 109,
          userName: '学生杨丽',
          userAvatar: 'https://via.placeholder.com/48',
          content: '希望能延长晚上的服务时间',
          comment: '服务态度不错，但希望能延长晚上的服务时间，对于晚上有课的同学更方便。',
          score: 3.5,
          time: Date.now() - 86400000 * 9,
          likes: 20,
          isLiked: false
        }
      ]
    },
    {
      rid: 9,
      sid: 9,
      uid: 109,
      targetType: 'activity',
      targetId: 'A001',
      targetName: '校园文化节',
      goal: '校园文化节',
      rating: 4.9,
      score: 4.9,
      review: '活动丰富多彩，氛围非常好',
      tag: '校园活动',
      intro: '一年一度的校园文化节，包含音乐会、戏剧表演、美食节和手工艺展览等多种活动，为期一周。',
      image: 'https://via.placeholder.com/600x400?text=Campus+Festival',
      num: 230,
      time: Date.now() - 86400000 * 15,
      likes: 45,
      isLiked: false,
      comments: [
        {
          cid: 901,
          uid: 110,
          userName: '学生张明',
          userAvatar: 'https://via.placeholder.com/48',
          content: '今年的文化节比去年更加精彩',
          comment: '今年的文化节比去年更加精彩，特别是音乐会的表演让人印象深刻，期待下一届。',
          score: 5.0,
          time: Date.now() - 86400000 * 14,
          likes: 25,
          isLiked: false
        }
      ]
    },
    {
      rid: 10,
      sid: 10,
      uid: 110,
      targetType: 'club',
      targetId: 'CL001',
      targetName: '摄影协会',
      goal: '摄影协会',
      rating: 4.6,
      score: 4.6,
      review: '活动频繁，氛围友好，对摄影技术提升很有帮助',
      tag: '社团组织',
      intro: '校内最大的摄影爱好者社团，定期组织摄影技术讲座、外出拍摄活动和作品展览，欢迎所有对摄影感兴趣的同学加入。',
      image: 'https://via.placeholder.com/600x400?text=Photography+Club',
      num: 78,
      time: Date.now() - 86400000 * 20,
      likes: 32,
      isLiked: false,
      comments: [
        {
          cid: 1001,
          uid: 111,
          userName: '学生王丽',
          userAvatar: 'https://via.placeholder.com/48',
          content: '加入社团后学到了很多摄影知识',
          comment: '加入社团后学到了很多摄影知识，社团活动也很丰富，认识了很多志同道合的朋友。',
          score: 4.8,
          time: Date.now() - 86400000 * 19,
          likes: 16,
          isLiked: false
        }
      ]
    }
  ],

  // 评分标签
  ratingTags: [
    { id: 1, name: '全部' },
    { id: 2, name: '餐饮美食' },
    { id: 3, name: '学习场所' },
    { id: 4, name: '运动健身' },
    { id: 5, name: '校园服务' },
    { id: 6, name: '住宿条件' },
    { id: 7, name: '课程教学' },
    { id: 8, name: '校园活动' },
    { id: 9, name: '社团组织' }
  ],

  // 任务数据
  tasks: [
    {
      tid: 1,
      uid: 101,
      name: '快速送文件到教学楼',
      details: '需要有人帮忙把一份重要文件从学生宿舍送到主教学楼，急需！',
      tag: '快递代取',
      money: 15, // 15元
      reward: 1500, // 15元
      status: 0, // 0: 未接单, 1: 已接单, 2: 已完成
      location: '从1号宿舍到主教学楼',
      contact: '13800138000',
      deadline: Date.now() + 86400000 * 1, // 1天后截止
      time: Date.now() - 3600000 * 2, // 2小时前发布
      applicants: [] // 申请人列表
    },
    {
      tid: 2,
      uid: 102,
      name: '帮忙带早餐',
      details: '明早8点，请帮忙从2号食堂带一份早餐到4号宿舍楼，报酬从优',
      tag: '食品代购',
      money: 8, // 8元
      reward: 800, // 8元
      status: 0,
      location: '从2号食堂到4号宿舍',
      contact: '13900139000',
      deadline: Date.now() + 86400000 * 0.5, // 12小时后截止
      time: Date.now() - 3600000 * 5, // 5小时前发布
      applicants: []
    },
    {
      tid: 3,
      uid: 103,
      name: '寻找数学笔记',
      details: '上周在图书馆丢失了一本数学笔记，急需找回',
      tag: '失物招领',
      money: 50, // 50元
      reward: 5000, // 50元
      status: 0,
      location: '图书馆附近',
      contact: '15800158000',
      deadline: Date.now() + 86400000 * 3, // 3天后截止
      time: Date.now() - 86400000 * 1, // 1天前发布
      applicants: []
    },
    {
      tid: 4,
      uid: 104,
      name: '求一起约球',
      details: '周五下午3点，找三个人一起在东区篮球场打球',
      tag: '运动伙伴',
      money: 0, // 无报酬
      reward: 0, // 无报酬
      status: 0,
      location: '东区篮球场',
      contact: '13700137000',
      deadline: Date.now() + 86400000 * 2, // 2天后截止
      time: Date.now() - 3600000 * 12, // 12小时前发布
      applicants: []
    },
    {
      tid: 5,
      uid: 105,
      name: '复印资料代取',
      details: '需要有人帮忙去图书馆复印5份资料，大约50页',
      tag: '学习互助',
      money: 20, // 20元
      reward: 2000, // 20元
      status: 1, // 已接单
      location: '图书馆复印室',
      contact: '18900189000',
      deadline: Date.now() + 3600000 * 5, // 5小时后截止
      time: Date.now() - 3600000 * 8, // 8小时前发布
      applicants: [
        {
          uid: 106,
          time: Date.now() - 3600000 * 6,
          status: 1, // 已接受
          message: '我可以帮你复印，我正好在图书馆学习'
        }
      ]
    }
  ],

  // 任务标签
  taskTags: [
    { id: 1, name: '快递代取' },
    { id: 2, name: '食品代购' },
    { id: 3, name: '失物招领' },
    { id: 4, name: '运动伙伴' },
    { id: 5, name: '学习互助' },
    { id: 6, name: '校园兼职' },
    { id: 7, name: '活动组织' },
    { id: 8, name: '其他' }
  ]
};

const api = axios.create({
    baseURL: 'http://10.100.164.44:8080',
});

// 请求拦截器
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('jwt');
        if (token) {
            config.headers['token'] = `${token}`;
        } else {
            console.warn('No JWT token found');
            // 在调试模式下，跳过登录检查
            if (!DEBUG_MODE) {
                // 不是调试模式，执行正常的登录检查
                if (!(config.url.includes('login') || config.url.includes('register'))) {
                    router.push('/user-login');
                }
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 响应拦截器
api.interceptors.response.use(
    (response) => {
        // 在调试模式下，跳过登录检查
        if (!DEBUG_MODE) {
            const {code, msg, data} = response.data;
            if (code === 0 && msg === "NOT_LOGIN") {
                localStorage.removeItem('jwt');
                router.push('/user-login');
            }
        }
        return response;
    },
    (error) => {
        // 在调试模式下，不做任何登录相关的重定向
        if (!DEBUG_MODE && error.response) {
            const {code, msg} = error.response.data;

            switch (error.response.status) {
                case 401:
                    console.error('Unauthorized: Token may be invalid or expired');
                    localStorage.removeItem('jwt');
                    router.push('/user-login');
                    break;
                case 403:
                    console.error('Forbidden: You do not have permission to access this resource');
                    break;
                default:
                    console.error(`Error ${error.response.status}: ${msg}`);
            }
        } else if (error.request) {
            console.error('No response received:', error.request);
        } else {
            console.error('Error setting up request:', error.message);
        }
        return Promise.reject(error);
    }
);

// 创建返回模拟数据的方法
const getMockResponse = (mockData) => {
  return Promise.resolve({
    data: {
      code: 200,
      msg: "success",
      data: mockData
    }
  });
};

// 留言板相关 API
export const messageboardApi = {
    // 获取所有留言
    getMessages: () => {
        // 调试模式下且没有JWT令牌，返回模拟数据
        if (DEBUG_MODE && !localStorage.getItem('jwt')) {
            console.log("DEBUG MODE: 返回模拟的留言列表数据");
            return getMockResponse(MOCK_DATA.messages);
        }
        return api.get('/api/messageboard/messages');
    },
    
    // 获取留言详情
    getMessageDetail: (id) => {
        // 调试模式下且没有JWT令牌，返回模拟数据
        if (DEBUG_MODE && !localStorage.getItem('jwt')) {
            console.log("DEBUG MODE: 返回模拟的留言详情数据");
            const message = MOCK_DATA.messages.find(m => m.mid === parseInt(id));
            return getMockResponse(message || MOCK_DATA.messages[0]);
        }
        return api.get(`/api/messageboard/message?id=${id}`);
    },
    
    // 发布新留言
    createMessage: (data) => {
        // 调试模式下且没有JWT令牌，模拟创建留言
        if (DEBUG_MODE && !localStorage.getItem('jwt')) {
            console.log("DEBUG MODE: 模拟创建新留言");
            const newMessage = {
                mid: MOCK_DATA.messages.length + 1,
                uid: 1001, // 模拟用户ID
                title: data.title,
                content: data.content,
                tag: data.tag,
                time: Date.now(),
                praise: 0,
                isLiked: false,
                comments: []
            };
            MOCK_DATA.messages.unshift(newMessage);
            return getMockResponse(newMessage);
        }
        return api.post('/api/messageboard/message', data);
    },
    
    // 点赞留言
    likeMessage: (id) => {
        // 调试模式下且没有JWT令牌，模拟点赞
        if (DEBUG_MODE && !localStorage.getItem('jwt')) {
            console.log("DEBUG MODE: 模拟点赞留言");
            const message = MOCK_DATA.messages.find(m => m.mid === parseInt(id));
            if (message) {
                message.isLiked = true;
                message.praise += 1;
            }
            return getMockResponse({success: true});
        }
        return api.post(`/api/messageboard/message/like?id=${id}`);
    },
    
    // 取消点赞留言
    unlikeMessage: (id) => {
        // 调试模式下且没有JWT令牌，模拟取消点赞
        if (DEBUG_MODE && !localStorage.getItem('jwt')) {
            console.log("DEBUG MODE: 模拟取消点赞留言");
            const message = MOCK_DATA.messages.find(m => m.mid === parseInt(id));
            if (message) {
                message.isLiked = false;
                message.praise = Math.max(0, message.praise - 1);
            }
            return getMockResponse({success: true});
        }
        return api.delete(`/api/messageboard/message/like?id=${id}`);
    },
    
    // 评论留言
    commentMessage: (id, data) => {
        // 调试模式下且没有JWT令牌，模拟评论
        if (DEBUG_MODE && !localStorage.getItem('jwt')) {
            console.log("DEBUG MODE: 模拟评论留言");
            const message = MOCK_DATA.messages.find(m => m.mid === parseInt(id));
            if (message) {
                const newComment = {
                    cid: Date.now(),
                    uid: 1001, // 模拟用户ID
                    content: data.content,
                    time: Date.now(),
                    praise: 0,
                    isLiked: false
                };
                message.comments.push(newComment);
                return getMockResponse(newComment);
            }
            return getMockResponse({success: false});
        }
        return api.post(`/api/messageboard/comment?id=${id}`, data);
    },
    
    // 点赞评论
    likeComment: (id) => {
        // 调试模式下且没有JWT令牌，模拟点赞评论
        if (DEBUG_MODE && !localStorage.getItem('jwt')) {
            console.log("DEBUG MODE: 模拟点赞评论");
            for (const message of MOCK_DATA.messages) {
                const comment = message.comments.find(c => c.cid === parseInt(id));
                if (comment) {
                    comment.isLiked = true;
                    comment.praise += 1;
                    return getMockResponse({success: true});
                }
            }
            return getMockResponse({success: false});
        }
        return api.post(`/api/messageboard/comment/like?id=${id}`);
    },
    
    // 取消点赞评论
    unlikeComment: (id) => {
        // 调试模式下且没有JWT令牌，模拟取消点赞评论
        if (DEBUG_MODE && !localStorage.getItem('jwt')) {
            console.log("DEBUG MODE: 模拟取消点赞评论");
            for (const message of MOCK_DATA.messages) {
                const comment = message.comments.find(c => c.cid === parseInt(id));
                if (comment) {
                    comment.isLiked = false;
                    comment.praise = Math.max(0, comment.praise - 1);
                    return getMockResponse({success: true});
                }
            }
            return getMockResponse({success: false});
        }
        return api.delete(`/api/messageboard/comment/like?id=${id}`);
    }
};

// 商品交易相关 API
export const transactionsApi = {
    // 获取所有商品
    getProducts: () => {
        if (DEBUG_MODE && !localStorage.getItem('jwt')) {
            console.log("DEBUG MODE: 返回模拟的商品列表数据");
            return getMockResponse(MOCK_DATA.products);
        }
        return api.get('/api/transactions/products');
    },

    // 获取商品详情
    getProductDetail: (id) => {
        if (DEBUG_MODE && !localStorage.getItem('jwt')) {
            console.log("DEBUG MODE: 返回模拟的商品详情数据");
            const product = MOCK_DATA.products.find(p => p.gid === parseInt(id));
            return getMockResponse(product || MOCK_DATA.products[0]);
        }
        return api.get(`/api/transactions/product?id=${id}`);
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
        return api.post('/api/transactions/product', data);
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
        return api.post(`/api/transactions/purchase?id=${id}`, data);
    },

    // 获取商品标签
    getProductTags: () => {
        if (DEBUG_MODE && !localStorage.getItem('jwt')) {
            console.log("DEBUG MODE: 返回模拟的商品标签数据");
            return getMockResponse(MOCK_DATA.productTags);
        }
        return api.get('/api/transactions/tags');
    }
};

// 评分相关 API
export const ratingsApi = {
    // 获取所有评分
    getRatings: () => {
        if (DEBUG_MODE && !localStorage.getItem('jwt')) {
            console.log("DEBUG MODE: 返回模拟的评分列表数据");
            return getMockResponse(MOCK_DATA.ratings);
        }
        return api.get('/api/ratings/list');
    },

    // 获取评分详情
    getRatingDetail: (id) => {
        if (DEBUG_MODE && !localStorage.getItem('jwt')) {
            console.log("DEBUG MODE: 返回模拟的评分详情数据");
            const rating = MOCK_DATA.ratings.find(r => r.rid === parseInt(id));
            return getMockResponse(rating || MOCK_DATA.ratings[0]);
        }
        return api.get(`/api/ratings/detail?id=${id}`);
    },

    // 添加新评分
    createRating: (data) => {
        if (DEBUG_MODE && !localStorage.getItem('jwt')) {
            console.log("DEBUG MODE: 模拟创建新评分");
            const newRating = {
                rid: MOCK_DATA.ratings.length + 1,
                uid: 101, // 模拟用户ID
                targetType: data.targetType,
                targetId: data.targetId,
                targetName: data.targetName,
                rating: data.rating,
                review: data.review,
                time: Date.now(),
                likes: 0,
                isLiked: false,
                comments: []
            };
            MOCK_DATA.ratings.unshift(newRating);
            return getMockResponse(newRating);
        }
        return api.post('/api/ratings/create', data);
    },

    // 点赞评分
    likeRating: (id) => {
        if (DEBUG_MODE && !localStorage.getItem('jwt')) {
            console.log("DEBUG MODE: 模拟点赞评分");
            const rating = MOCK_DATA.ratings.find(r => r.rid === parseInt(id));
            if (rating) {
                rating.isLiked = true;
                rating.likes += 1;
                return getMockResponse({ success: true });
            }
            return getMockResponse({ success: false });
        }
        return api.post(`/api/ratings/like?id=${id}`);
    },

    // 取消点赞评分
    unlikeRating: (id) => {
        if (DEBUG_MODE && !localStorage.getItem('jwt')) {
            console.log("DEBUG MODE: 模拟取消点赞评分");
            const rating = MOCK_DATA.ratings.find(r => r.rid === parseInt(id));
            if (rating) {
                rating.isLiked = false;
                rating.likes = Math.max(0, rating.likes - 1);
                return getMockResponse({ success: true });
            }
            return getMockResponse({ success: false });
        }
        return api.delete(`/api/ratings/like?id=${id}`);
    },

    // 评论评分
    commentRating: (id, data) => {
        if (DEBUG_MODE && !localStorage.getItem('jwt')) {
            console.log("DEBUG MODE: 模拟评论评分");
            const rating = MOCK_DATA.ratings.find(r => r.rid === parseInt(id));
            if (rating) {
                const newComment = {
                    cid: Date.now(),
                    uid: 101, // 模拟用户ID
                    content: data.content,
                    time: Date.now(),
                    likes: 0,
                    isLiked: false
                };
                rating.comments.push(newComment);
                return getMockResponse(newComment);
            }
            return getMockResponse({ success: false });
        }
        return api.post(`/api/ratings/comment?id=${id}`, data);
    },

    // 获取评分标签
    getRatingTags: () => {
        if (DEBUG_MODE && !localStorage.getItem('jwt')) {
            console.log("DEBUG MODE: 返回模拟的评分标签数据");
            return getMockResponse(MOCK_DATA.ratingTags);
        }
        return api.get('/api/ratings/tags');
    }
};

// 任务相关 API
export const tasksApi = {
    // 获取所有任务
    getTasks: () => {
        if (DEBUG_MODE && !localStorage.getItem('jwt')) {
            console.log("DEBUG MODE: 返回模拟的任务列表数据");
            return getMockResponse(MOCK_DATA.tasks);
        }
        return api.get('/api/tasks/list');
    },

    // 获取任务详情
    getTaskDetail: (id) => {
        if (DEBUG_MODE && !localStorage.getItem('jwt')) {
            console.log("DEBUG MODE: 返回模拟的任务详情数据");
            const task = MOCK_DATA.tasks.find(t => t.tid === parseInt(id));
            return getMockResponse(task || MOCK_DATA.tasks[0]);
        }
        return api.get(`/api/tasks/detail?id=${id}`);
    },

    // 发布新任务
    createTask: (data) => {
        if (DEBUG_MODE && !localStorage.getItem('jwt')) {
            console.log("DEBUG MODE: 模拟创建新任务");
            const newTask = {
                tid: MOCK_DATA.tasks.length + 1,
                uid: 101, // 模拟用户ID
                name: data.name,
                details: data.details,
                tag: data.tag,
                money: data.money,
                reward: data.reward,
                status: 0, // 未接单
                location: data.location,
                contact: data.contact,
                deadline: data.deadline,
                time: Date.now(),
                applicants: []
            };
            MOCK_DATA.tasks.unshift(newTask);
            return getMockResponse(newTask);
        }
        return api.post('/api/tasks/create', data);
    },

    // 申请任务
    applyTask: (id, data) => {
        if (DEBUG_MODE && !localStorage.getItem('jwt')) {
            console.log("DEBUG MODE: 模拟申请任务");
            const task = MOCK_DATA.tasks.find(t => t.tid === parseInt(id));
            if (task) {
                if (task.status === 0) { // 未接单
                    const application = {
                        uid: 101, // 模拟用户ID
                        time: Date.now(),
                        status: 0, // 待接受
                        message: data.message || ''
                    };
                    task.applicants.push(application);
                    return getMockResponse({ success: true });
                } else {
                    return getMockResponse({ success: false, message: '任务已被接取' });
                }
            }
            return getMockResponse({ success: false, message: '任务不存在' });
        }
        return api.post(`/api/tasks/apply?id=${id}`, data);
    },

    // 接受申请
    acceptApplicant: (taskId, userId) => {
        if (DEBUG_MODE && !localStorage.getItem('jwt')) {
            console.log("DEBUG MODE: 模拟接受申请");
            const task = MOCK_DATA.tasks.find(t => t.tid === parseInt(taskId));
            if (task) {
                const applicant = task.applicants.find(a => a.uid === parseInt(userId));
                if (applicant) {
                    task.status = 1; // 已接单
                    applicant.status = 1; // 已接受
                    // 拒绝其他申请
                    task.applicants.forEach(a => {
                        if (a.uid !== parseInt(userId)) {
                            a.status = 2; // 已拒绝
                        }
                    });
                    return getMockResponse({ success: true });
                }
                return getMockResponse({ success: false, message: '申请不存在' });
            }
            return getMockResponse({ success: false, message: '任务不存在' });
        }
        return api.post(`/api/tasks/accept?taskId=${taskId}&userId=${userId}`);
    },

    // 完成任务
    completeTask: (id) => {
        if (DEBUG_MODE && !localStorage.getItem('jwt')) {
            console.log("DEBUG MODE: 模拟完成任务");
            const task = MOCK_DATA.tasks.find(t => t.tid === parseInt(id));
            if (task) {
                if (task.status === 1) { // 已接单
                    task.status = 2; // 已完成
                    return getMockResponse({ success: true });
                } else {
                    return getMockResponse({ success: false, message: '任务状态不正确' });
                }
            }
            return getMockResponse({ success: false, message: '任务不存在' });
        }
        return api.post(`/api/tasks/complete?id=${id}`);
    },

    // 获取任务标签
    getTaskTags: () => {
        if (DEBUG_MODE && !localStorage.getItem('jwt')) {
            console.log("DEBUG MODE: 返回模拟的任务标签数据");
            return getMockResponse(MOCK_DATA.taskTags);
        }
        return api.get('/api/tasks/tags');
    }
};

export default api;