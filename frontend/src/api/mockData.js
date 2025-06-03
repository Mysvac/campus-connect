// 模拟数据，在调试模式下使用
export const MOCK_DATA = {
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
          isLiked: false        }
      ]
    },
    {
      mid: 6,
      uid: 1001,
      title: "课程互助 - 高数习题讨论",
      content: "第三章的习题有些不太懂，有同学可以一起讨论吗？特别是关于极限的计算。",
      tag: "课程互助",
      time: Date.now() - 4 * 3600000, // 4小时前
      praise: 12,
      isLiked: false,
      comments: [
        {
          cid: 601,
          uid: 1003,
          content: "我也在学这个，可以一起讨论！",
          time: Date.now() - 3 * 3600000,
          praise: 5,
          isLiked: false
        }
      ]
    },
    {
      mid: 7,
      uid: 1001,
      title: "寻找失物 - 黑色钱包",
      content: "昨天在图书馆丢了一个黑色钱包，里面有学生卡和一些现金。如果有人捡到请联系我，非常感谢！",
      tag: "失物招领",
      time: Date.now() - 18 * 3600000, // 18小时前
      praise: 8,
      isLiked: false,
      comments: [
        {
          cid: 701,
          uid: 1002,
          content: "我帮你关注一下，希望能找到！",
          time: Date.now() - 16 * 3600000,
          praise: 3,
          isLiked: false
        }
      ]
    },
    {
      mid: 8,
      uid: 1001,
      title: "二手交易 - 出售计算机组成原理教材",
      content: "刚考完试，出售《计算机组成原理》教材，8成新，原价68元，现价40元。有需要的同学可以联系我。",
      tag: "二手交易",
      time: Date.now() - 24 * 3600000, // 1天前
      praise: 15,
      isLiked: false,
      comments: [
        {
          cid: 801,
          uid: 1004,
          content: "我需要这本书，可以面谈吗？",
          time: Date.now() - 20 * 3600000,
          praise: 2,
          isLiked: false
        },
        {
          cid: 802,
          uid: 1005,
          content: "书的质量怎么样？有笔记吗？",
          time: Date.now() - 18 * 3600000,
          praise: 1,
          isLiked: false
        }
      ]
    },
    {
      mid: 9,
      uid: 1001,
      title: "学习讨论 - 数据结构算法分享",
      content: "最近在学习排序算法，整理了一些笔记和代码示例，愿意分享给需要的同学。包括冒泡排序、快速排序等。",
      tag: "学习讨论",
      time: Date.now() - 36 * 3600000, // 1.5天前
      praise: 28,
      isLiked: false,
      comments: [
        {
          cid: 901,
          uid: 1003,
          content: "太棒了！我正好需要这些资料。",
          time: Date.now() - 30 * 3600000,
          praise: 8,
          isLiked: false
        },
        {
          cid: 902,
          uid: 1002,
          content: "能分享一下快排的代码吗？",
          time: Date.now() - 28 * 3600000,
          praise: 6,
          isLiked: false
        }
      ]
    },
    {
      mid: 10,
      uid: 1001,
      title: "校园问题 - 宿舍热水供应时间",
      content: "最近宿舍的热水供应时间变短了，希望能够延长供应时间，特别是晚上洗澡的时候经常没有热水。",
      tag: "校园问题",
      time: Date.now() - 48 * 3600000, // 2天前
      praise: 42,
      isLiked: false,
      comments: [
        {
          cid: 1001,
          uid: 1005,
          content: "我们宿舍也有这个问题！",
          time: Date.now() - 40 * 3600000,
          praise: 15,
          isLiked: false
        },
        {
          cid: 1002,
          uid: 1004,
          content: "建议大家一起向宿管反映。",
          time: Date.now() - 35 * 3600000,
          praise: 12,
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
      tag: 1, // 快递代取
      money: 15, // 15元
      reward: 1500, // 15元
      status: 0, // 0: 待接取, 1: 进行中, 2: 终止, 3: 已完成
      location: '从1号宿舍到主教学楼',
      contact: '13800138000',
      deadline: Date.now() + 86400000 * 1, // 1天后截止
      time: Date.now() - 3600000 * 2, // 2小时前发布
      applicants: [
        {
          uid: 1002,
          time: Date.now() - 3600000 * 1,
          status: 0, // 0: 待同意, 1: 已接受, 2: 已拒绝
          message: '我现在在宿舍区，可以马上帮你送文件！'
        },
        {
          uid: 1003,
          time: Date.now() - 3600000 * 0.5,
          status: 0,
          message: '我也可以帮忙，有经验！'
        }
      ]
    },
    {
      tid: 2,
      uid: 102,
      name: '帮忙带早餐',
      details: '明早8点，请帮忙从2号食堂带一份早餐到4号宿舍楼，报酬从优',
      tag: 2, // 食品代购
      money: 8, // 8元
      reward: 800, // 8元
      status: 0,
      location: '从2号食堂到4号宿舍',
      contact: '13900139000',
      deadline: Date.now() + 86400000 * 0.5, // 12小时后截止
      time: Date.now() - 3600000 * 5, // 5小时前发布
      applicants: [
        {
          uid: 1004,
          time: Date.now() - 3600000 * 3,
          status: 0,
          message: '我住在4号宿舍楼，很方便！'
        }
      ]
    },
    {
      tid: 3,
      uid: 103,
      name: '寻找数学笔记',
      details: '上周在图书馆丢失了一本数学笔记，急需找回',
      tag: 3, // 失物招领
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
      tag: 4, // 运动伙伴
      money: 0, // 无报酬
      reward: 0, // 无报酬
      status: 0,
      location: '东区篮球场',
      contact: '13700137000',
      deadline: Date.now() + 86400000 * 2, // 2天后截止
      time: Date.now() - 3600000 * 12, // 12小时前发布
      applicants: [
        {
          uid: 1005,
          time: Date.now() - 3600000 * 8,
          status: 0,
          message: '我也想打球，算我一个！'
        },
        {
          uid: 1006,
          time: Date.now() - 3600000 * 6,
          status: 0,
          message: '我可以参加，球技还可以'
        }
      ]
    },
    {
      tid: 5,
      uid: 105,
      name: '复印资料代取',
      details: '需要有人帮忙去图书馆复印5份资料，大约50页',
      tag: 5, // 学习互助
      money: 20, // 20元
      reward: 2000, // 20元
      status: 1, // 进行中
      location: '图书馆复印室',
      contact: '18900189000',
      deadline: Date.now() + 3600000 * 5, // 5小时后截止
      time: Date.now() - 3600000 * 8, // 8小时前发布
      executorId: 1006, // 执行者ID
      applicants: [
        {
          uid: 1006,
          time: Date.now() - 3600000 * 6,
          status: 1, // 已接受
          message: '我可以帮你复印，我正好在图书馆学习'
        }
      ]
    },
    {
      tid: 6,
      uid: 1001, // 当前用户发的任务，用于测试申请者管理
      name: '代取快递',
      details: '菜鸟驿站有一个快递需要代取，比较重，需要帮忙',
      tag: 1, // 快递代取
      money: 10,
      reward: 1000,
      status: 0,
      location: '菜鸟驿站',
      contact: '13800138001',
      deadline: Date.now() + 86400000 * 2,
      time: Date.now() - 3600000 * 4,
      applicants: [
        {
          uid: 1002,
          time: Date.now() - 3600000 * 2,
          status: 0,
          message: '我有时间，可以帮你取快递'
        },
        {
          uid: 1003,
          time: Date.now() - 3600000 * 1,
          status: 0,
          message: '我正好路过菜鸟驿站，可以顺便帮你取'
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
  ],

  // 用户数据
  users: [
    {
      uid: 1001,
      name: "张三",
      phone: "13800138001",
      email: "zhangsan@example.com",
      profile: "https://via.placeholder.com/200x200?text=User1",
      gender: 1, // 1: 男, 2: 女, 0: 未设置
      wallet: 10000, // 100元
      permission: 1, // 1: 普通用户, 2: 管理员
      registerTime: Date.now() - 86400000 * 30 // 30天前
    },
    {
      uid: 1002,
      name: "李四",
      phone: "13800138002",
      email: "lisi@example.com",
      profile: "https://via.placeholder.com/200x200?text=User2",
      gender: 1,
      wallet: 5000,
      permission: 1,
      registerTime: Date.now() - 86400000 * 25
    },
    {
      uid: 1003,
      name: "王五",
      phone: "13800138003",
      email: "wangwu@example.com",
      profile: "https://via.placeholder.com/200x200?text=User3",
      gender: 1,
      wallet: 15000,
      permission: 1,
      registerTime: Date.now() - 86400000 * 20
    },
    {
      uid: 1004,
      name: "赵六",
      phone: "13800138004",
      email: "zhaoliu@example.com",
      profile: "https://via.placeholder.com/200x200?text=User4",
      gender: 1,
      wallet: 7500,
      permission: 1,
      registerTime: Date.now() - 86400000 * 15
    },
    {
      uid: 1005,
      name: "钱七",
      phone: "13800138005",
      email: "qianqi@example.com",
      profile: "https://via.placeholder.com/200x200?text=User5",
      gender: 2,
      wallet: 12000,
      permission: 1,
      registerTime: Date.now() - 86400000 * 10
    },
    {
      uid: 2001,
      name: "管理员",
      phone: "13900139001",
      email: "admin@example.com",
      profile: "https://via.placeholder.com/200x200?text=Admin",
      gender: 1,
      wallet: 0,
      permission: 2,
      registerTime: Date.now() - 86400000 * 100
    }
  ],
  
  // 用户密码映射（仅在前端模拟时使用）
  userPasswords: {
    "13800138001": "password123",
    "13800138002": "password123",
    "13800138003": "password123",
    "13800138004": "password123",
    "13800138005": "password123",
    "13900139001": "admin123"
  }
};

// 创建返回模拟数据的方法
export const getMockResponse = (mockData) => {
  return Promise.resolve({
    data: {
      code: 1,
      msg: "success",
      data: mockData
    }
  });
};