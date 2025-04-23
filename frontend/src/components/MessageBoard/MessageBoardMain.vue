<template>
  <main class="message-board-main">
    <!-- 新建留言表单 -->
    <div class="main-section new-post-form" v-if="showNewPostForm">
      <h2 class="form-title">发布新留言</h2>
      <form @submit.prevent="submitNewPost" class="form-container">
        <div class="form-group">
          <label for="post-title">标题</label>
          <input type="text" id="post-title" v-model="newPost.title" required maxlength="30" placeholder="请输入标题(最多30字)">
        </div>

        <div class="form-group content-group">
          <label for="post-content">内容</label>
          <textarea id="post-content" v-model="newPost.content" required placeholder="请输入留言内容..."></textarea>
        </div>

        <div class="form-group">
          <label for="post-tag">标签</label>
          <div class="custom-select">
            <select id="post-tag" v-model="newPost.tag" required>
              <option value="" disabled selected>请选择标签</option>
              <option value="学习">学习</option>
              <option value="生活">生活</option>
              <option value="活动">活动</option>
              <option value="失物">失物</option>
              <option value="交易">交易</option>
              <option value="求助">求助</option>
              <option value="吐槽">吐槽</option>
            </select>
            <div class="select-arrow"></div>
          </div>
        </div>

        <div class="form-actions">
          <button type="button" class="cancel-btn" @click="$emit('hide-new-post-form')">取消</button>
          <button type="submit" class="submit-btn">
            <span>发布</span>
            <svg width="15px" height="10px" viewBox="0 0 13 10">
              <path d="M1,5 L11,5"></path>
              <polyline points="8 1 12 5 8 9"></polyline>
            </svg>
          </button>
        </div>
      </form>
    </div>

    <!-- 留言详情 -->
    <div class="main-section message-detail" v-else-if="selectedMessage">
      <div class="modal-header">
        <h3>留言详情</h3>
        <button class="close-btn" @click="closeMessageDetail">×</button>
      </div>

      <div class="detail-content">
        <!-- 留言内容 -->
        <div class="detail-message-card">
          <div class="message-header">
            <div class="user-info">
              <img :src="'https://via.placeholder.com/40'" alt="用户头像" class="user-avatar">
              <div>
                <h4 class="user-name">用户{{ selectedMessage.uid }}</h4>
                <span class="post-time">{{ formatTime(selectedMessage.time) }}</span>
              </div>
            </div>
            <div class="message-tags">
              <span class="message-tag">{{ selectedMessage.tag }}</span>
            </div>
          </div>

          <h3 class="message-title">{{ selectedMessage.title }}</h3>

          <div class="message-content">
            <p>{{ selectedMessage.content }}</p>
          </div>

          <div class="message-actions">
            <button class="action-btn like" :class="{ active: selectedMessage.isLiked }" @click="toggleLike(selectedMessage)">
              <i class="icon">👍</i>
              <span>{{ selectedMessage.praise }}</span>
            </button>
            <button class="action-btn comment">
              <i class="icon">💬</i>
              <span>{{ selectedMessage.comments.length }}</span>
            </button>
          </div>
        </div>

        <!-- 评论列表 -->
        <div class="comments-section">
          <h4>评论 ({{ selectedMessage.comments.length }})</h4>
          <div class="comments-list" v-if="selectedMessage.comments.length > 0">
            <div class="comment-item" v-for="comment in selectedMessage.comments" :key="comment.cid">
              <div class="comment-header">
                <div class="user-info">
                  <img :src="'https://via.placeholder.com/30'" alt="用户头像" class="comment-avatar">
                  <div>
                    <h5 class="comment-user-name">用户{{ comment.uid }}</h5>
                    <span class="comment-time">{{ formatTime(comment.time) }}</span>
                  </div>
                </div>
              </div>
              <div class="comment-content">
                <p>{{ comment.content }}</p>
              </div>
              <div class="comment-actions">
                <button class="comment-action-btn like" :class="{ active: comment.isLiked }" @click="toggleCommentLike(comment)">
                  <i class="icon">👍</i>
                  <span>{{ comment.praise }}</span>
                </button>
              </div>
            </div>
          </div>
          <div class="no-comments" v-else>
            <p>暂无评论，快来发表第一条评论吧！</p>
          </div>
        </div>
      </div>

      <!-- 添加评论表单 - 固定在底部 -->
      <div class="add-comment-form">
        <textarea v-model="newComment" placeholder="写下你的评论..." rows="3"></textarea>
        <button class="submit-comment-btn" @click="submitComment">发布评论</button>
      </div>
    </div>

    <!-- 留言列表 -->
    <div class="main-section message-section" v-else>
      <!-- 搜索结果提示 -->
      <div class="search-results-info" v-if="searchQuery">
      </div>

      <transition-group name="message-fade" tag="div" class="message-list">
        <div class="message-card" v-for="message in displayedMessages" :key="message.mid" @click="showMessageDetail(message)">
          <div class="message-header">
            <div class="user-info">
              <img :src="'https://via.placeholder.com/40'" alt="用户头像" class="user-avatar">
              <div>
                <h4 class="user-name">用户{{ message.uid }}</h4>
                <span class="post-time">{{ formatTime(message.time) }}</span>
              </div>
            </div>
            <div class="message-tags">
              <span class="message-tag">{{ message.tag }}</span>
            </div>
          </div>
          <h3 class="message-title">{{ message.title }}</h3>
          <div class="message-content">
            <p>{{ message.content }}</p>
          </div>
          <div class="message-actions" @click.stop>
            <button class="action-btn like" :class="{ active: message.isLiked }" @click="toggleLike(message)">
              <i class="icon">👍</i>
              <span>{{ message.praise }}</span>
            </button>
            <button class="action-btn comment" @click.stop="showMessageDetail(message)">
              <i class="icon">💬</i>
              <span>{{ message.comments.length }}</span>
            </button>
          </div>
        </div>
      </transition-group>

      <!-- 没有搜索结果时显示 -->
      <div class="no-results" v-if="searchQuery && displayedMessages.length === 0">
        <p>没有找到匹配 "{{ searchQuery }}" 的留言</p>
      </div>
    </div>
  </main>
</template>

<script>
export default {
  name: 'MessageBoardMain',
  props: {
    showNewPostForm: {
      type: Boolean,
      default: false
    },
    currentTag: {
      type: String,
      default: null
    },
    searchQuery: {
      type: String,
      default: ''
    },
    selectedMessageId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      messages: [
        {
          mid: 1,
          uid: 1001,
          title: '高等数学资料求助',
          content: '谁有高等数学第七版的电子书资料？明天就要交作业了，急需！',
          tag: '学习',
          praise: 12,
          time: 1712659200000, // 时间戳形式
          isLiked: false,
          comments: [
            {
              cid: 1,
              mid: 1,
              uid: 1008,
              content: '我有PDF版，加我微信发给你',
              praise: 5,
              time: 1712662800000,
              isLiked: false
            },
            {
              cid: 2,
              mid: 1,
              uid: 1012,
              content: '可以去图书馆二楼找找，那里有很多高数资料',
              praise: 3,
              time: 1712666400000,
              isLiked: false
            }
          ]
        },
        {
          mid: 2,
          uid: 1002,
          title: '英语角活动通知',
          content: '周六在图书馆三楼有英语角活动，欢迎大家参加，可以一起练习口语~',
          tag: '活动',
          praise: 24,
          time: 1712572800000,
          isLiked: false,
          comments: [
            {
              cid: 3,
              mid: 2,
              uid: 1006,
              content: '请问具体几点开始？需要提前报名吗？',
              praise: 2,
              time: 1712576400000,
              isLiked: false
            },
            {
              cid: 4,
              mid: 2,
              uid: 1002,
              content: '下午两点开始，不需要报名，直接来就可以啦！',
              praise: 4,
              time: 1712580000000,
              isLiked: false
            }
          ]
        },
        {
          mid: 3,
          uid: 1003,
          title: '新奶茶店推荐',
          content: '食堂二楼新开了一家奶茶店，今天有买一送一活动，味道还不错，推荐大家去尝尝！',
          tag: '生活',
          praise: 38,
          time: 1712400000000,
          isLiked: false,
          comments: [
            {
              cid: 5,
              mid: 3,
              uid: 1009,
              content: '刚去买了一杯，确实不错！推荐他家的芋泥波波奶茶',
              praise: 7,
              time: 1712403600000,
              isLiked: false
            },
            {
              cid: 6,
              mid: 3,
              uid: 1010,
              content: '请问价格大概是多少？',
              praise: 1,
              time: 1712410800000,
              isLiked: false
            },
            {
              cid: 7,
              mid: 3,
              uid: 1003,
              content: '中杯15，大杯18，加料额外收费',
              praise: 3,
              time: 1712414400000,
              isLiked: false
            }
          ]
        },
        {
          mid: 4,
          uid: 1004,
          title: '丢失学生卡',
          content: '今天中午在一教丢失了学生卡，如有捡到请联系我，万分感谢！',
          tag: '失物',
          praise: 5,
          time: 1712400000000,
          isLiked: false,
          comments: [
            {
              cid: 8,
              mid: 4,
              uid: 1013,
              content: '同学你好，请问学生卡是什么颜色的？我好像在一教门口看到一张',
              praise: 2,
              time: 1712407200000,
              isLiked: false
            }
          ]
        },
        {
          mid: 5,
          uid: 1005,
          title: '二手自行车出售',
          content: '有一辆二手自行车想出售，骑了不到半年，状态良好，有意者请私信。',
          tag: '交易',
          praise: 7,
          time: 1712313600000,
          isLiked: false,
          comments: [
            {
              cid: 9,
              mid: 5,
              uid: 1011,
              content: '请问什么型号的？价格多少？',
              praise: 1,
              time: 1712317200000,
              isLiked: false
            },
            {
              cid: 10,
              mid: 5,
              uid: 1005,
              content: '永久牌的，原价500，现在350出，可小刀',
              praise: 2,
              time: 1712324400000,
              isLiked: false
            }
          ]
        }
      ],
      newPost: {
        title: '',
        content: '',
        tag: ''
      },
      nextMid: 6, // 下一个留言ID
      nextCid: 11, // 下一个评论ID
      selectedMessage: null, // 当前选中的留言
      newComment: '', // 新评论内容
    }
  },
  computed: {
    displayedMessages() {
      let filtered = this.messages;

      // 先按标签筛选
      if (this.currentTag) {
        filtered = filtered.filter(message => message.tag === this.currentTag);
      }

      // 再按搜索关键词筛选
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(message =>
            message.title.toLowerCase().includes(query) ||
            message.content.toLowerCase().includes(query) // 可选：也搜索内容
        );
      }

      return filtered;
    }
  },
  watch: {
    selectedMessageId(newId) {
      if (newId) {
        const message = this.messages.find(m => m.mid === newId);
        if (message) {
          this.showMessageDetail(message);
        }
      }
    }
  },
  methods: {
    formatTime(timestamp) {
      const now = Date.now();
      const diff = now - timestamp;

      // 一天内
      if (diff < 86400000) {
        return '今天';
      }
      // 两天内
      else if (diff < 172800000) {
        return '昨天';
      }
      // 一周内
      else if (diff < 604800000) {
        return Math.floor(diff / 86400000) + '天前';
      }
      // 其他情况显示具体日期
      else {
        const date = new Date(timestamp);
        return `${date.getMonth() + 1}月${date.getDate()}日`;
      }
    },
    submitNewPost() {
      // 表单验证
      if (!this.newPost.title.trim()) {
        alert('请输入标题');
        return;
      }
      if (!this.newPost.content.trim()) {
        alert('请输入内容');
        return;
      }
      if (!this.newPost.tag) {
        alert('请选择标签');
        return;
      }

      // 创建新留言
      const newMessage = {
        mid: this.nextMid++,
        uid: 1000 + Math.floor(Math.random() * 100),
        title: this.newPost.title,
        content: this.newPost.content,
        tag: this.newPost.tag,
        praise: 0,
        time: Date.now(),
        isLiked: false,
        comments: []
      };

      // 添加到留言列表头部
      this.messages.unshift(newMessage);

      // 重置表单
      this.newPost = {
        title: '',
        content: '',
        tag: ''
      };

      // 隐藏表单
      this.$emit('hide-new-post-form');

      // 提示成功
      setTimeout(() => {
        alert('留言发布成功！');
      }, 300);

      // 更新消息列表，通知父组件
      this.$emit('messages-updated', this.messages);
    },
    toggleLike(message) {
      if (message.isLiked) {
        // 已点赞，取消点赞
        message.praise--;
        message.isLiked = false;
      } else {
        // 未点赞，添加点赞
        message.praise++;
        message.isLiked = true;
      }

      // 更新原始消息（如果是在详情页）
      if (this.selectedMessage && message.mid === this.selectedMessage.mid) {
        const originalMessage = this.messages.find(m => m.mid === message.mid);
        if (originalMessage) {
          originalMessage.isLiked = message.isLiked;
          originalMessage.praise = message.praise;
        }
      }

      // 通知父组件消息已更新（用于热门列表更新）
      this.$emit('messages-updated', this.messages);
    },
    toggleCommentLike(comment) {
      if (comment.isLiked) {
        // 已点赞，取消点赞
        comment.praise--;
        comment.isLiked = false;
      } else {
        // 未点赞，添加点赞
        comment.praise++;
        comment.isLiked = true;
      }

      // 更新原始消息中的评论
      if (this.selectedMessage) {
        const originalMessage = this.messages.find(m => m.mid === this.selectedMessage.mid);
        if (originalMessage) {
          const originalComment = originalMessage.comments.find(c => c.cid === comment.cid);
          if (originalComment) {
            originalComment.isLiked = comment.isLiked;
            originalComment.praise = comment.praise;
          }
        }
      }
    },
    showMessageDetail(message) {
      // 显示留言详情
      this.selectedMessage = JSON.parse(JSON.stringify(message)); // 创建深拷贝
      this.newComment = ''; // 清空评论框
    },
    closeMessageDetail() {
      // 找到原始消息并更新点赞状态
      if (this.selectedMessage) {
        const originalMessage = this.messages.find(m => m.mid === this.selectedMessage.mid);
        if (originalMessage) {
          originalMessage.isLiked = this.selectedMessage.isLiked;
          originalMessage.praise = this.selectedMessage.praise;
          originalMessage.comments = [...this.selectedMessage.comments]; // 更新评论
        }
      }

      // 关闭留言详情
      this.selectedMessage = null;

      // 通知父组件消息已更新（用于热门列表更新）
      this.$emit('messages-updated', this.messages);
    },
    submitComment() {
      // 验证评论
      if (!this.newComment.trim()) {
        alert('请输入评论内容');
        return;
      }

      // 创建新评论
      const comment = {
        cid: this.nextCid++,
        mid: this.selectedMessage.mid,
        uid: 1000 + Math.floor(Math.random() * 100), // 随机用户ID
        content: this.newComment,
        praise: 0,
        time: Date.now(),
        isLiked: false
      };

      // 添加到评论列表
      this.selectedMessage.comments.push(comment);

      // 清空评论框
      this.newComment = '';

      // 更新原始消息的评论
      const originalMessage = this.messages.find(m => m.mid === this.selectedMessage.mid);
      if (originalMessage) {
        originalMessage.comments = [...this.selectedMessage.comments];
      }

      // 通知父组件消息已更新
      this.$emit('messages-updated', this.messages);
    },
    clearSearch() {
      // 清除搜索并通知父组件
      this.$emit('clear-search');
    }
  },
  created() {
    // 初始时通知父组件消息列表
    this.$emit('messages-updated', this.messages);
  }
}
</script>

<style scoped>

.no-results {
  display: flex;
  justify-content: center;
  height: 800px;
  font-size: 1.1rem;
  color: #333;
  font-style: italic;
}


.message-board-main {
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: 100%;
  background-color: #f5f5f5; /* Light background for the main area */
  font-family: 'Georgia', serif;
}

.announcement-banner p {
  margin: 0;
}

.message-section, .new-post-form {
  background-color: #f9f9f9;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  flex-grow: 1;
  overflow-y: auto;
  border: 1px solid #e0e0e0;
}
/* 留言列表样式保持不变，但确保overflow正确 */
.message-section .message-list {
  overflow-y: auto;
  height: 100%;
}
.section-title, .form-title {
  font-size: 1.5rem;
  margin-bottom: 20px;
  color: #8B0000; /* Dark red matching header */
  position: relative;
  padding-bottom: 10px;
  text-align: center;
  font-family: 'Georgia', serif; /* Academic font from header */
}

.section-title::after, .form-title::after {
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

.message-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Post-it note style for message cards */
.message-card {
  background-color: #fffdf0; /* Light yellow post-it note color */
  border-radius: 2px;
  padding: 15px;
  box-shadow: 3px 3px 5px rgba(0, 0, 0, 0.15);
  position: relative;
  border-bottom: 1px solid #e0d070;
  border-right: 1px solid #e0d070;
  font-family: 'Georgia', serif;
}

/* Post-it note effect */
.message-card::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  border-width: 0 16px 16px 0;
  border-style: solid;
  border-color: #e0d070 #f9f9f9; /* Creates folded corner effect */
}

.message-card:hover {
  transform: translateY(-5px) rotate(1deg);
  box-shadow: 5px 5px 7px rgba(0, 0, 0, 0.2);
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #8B0000; /* Dark red border */
}

.user-name {
  margin: 0;
  font-size: 1rem;
  color: #8B0000; /* Dark red text */
  font-weight: bold;
}

.post-time {
  font-size: 0.8rem;
  color: #777;
}

.message-title {
  font-size: 1.1rem;
  margin: 10px 0;
  color: #8B0000; /* Dark red text */
  font-weight: bold;
  text-decoration: underline;
  text-underline-offset: 3px;
}

.message-tags {
  display: flex;
  gap: 5px;
}

.message-tag {
  background-color: rgba(139, 0, 0, 0.1); /* Light red background */
  color: #8B0000; /* Dark red text */
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  border: 1px solid #8B0000;
}

.message-content {
  margin: 15px 0;
  color: #333;
  line-height: 1.5;
}

.message-actions {
  display: flex;
  gap: 15px;
  border-top: 1px solid #e0d070;
  padding-top: 12px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  color: #8B0000; /* Dark red color */
  font-size: 0.9rem;
  padding: 5px 10px;
  border-radius: 15px;

}

.action-btn:hover {
  background-color: rgba(139, 0, 0, 0.1); /* Light red background */
  color: #B22222; /* Brighter red on hover */
}

.action-btn.like:hover {
  color: #B22222;
}

.action-btn.comment:hover {
  color: #B22222;
}

.icon {
  font-size: 1.1rem;
}

/* New post form styles */
/* 共享样式，确保三个部分都占满相同空间 */
.main-section {
  background-color: #f9f9f9;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  flex-grow: 1;
  border: 1px solid #e0e0e0;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden; /* 防止内容溢出 */
}

/* 新建表单样式 */
.new-post-form .form-container {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  height: 100%;
}

.new-post-form .content-group {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.new-post-form #post-content {
  flex-grow: 1;
  min-height: 150px;
  resize: none;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #8B0000; /* Dark red text */
  font-family: 'Georgia', serif;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #8B0000; /* Dark red border */
  border-radius: 8px;
  font-size: 0.95rem;
  color: #333;
  background-color: #fffdf0; /* Very light yellow background */
  font-family: 'Georgia', serif;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: #B22222; /* Brighter red on focus */
  box-shadow: 0 0 0 2px rgba(178, 34, 34, 0.2);
}

/* Custom Select Styling */
.custom-select {
  position: relative;
  display: inline-block;
  width: 100%;
}

.custom-select select {
  appearance: none;
  -webkit-appearance: none;
  width: 100%;
  padding: 10px;
  border: 1px solid #8B0000;
  border-radius: 8px;
  background-color: #fffdf0;
  color: #333;
  cursor: pointer;
  font-family: 'Georgia', serif;
  font-size: 0.95rem;
}

.custom-select .select-arrow {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 8px solid #8B0000;
  pointer-events: none;
}

.custom-select select:focus {
  outline: none;
  border-color: #B22222;
  box-shadow: 0 0 0 2px rgba(178, 34, 34, 0.2);
}

.custom-select select option {
  background-color: #fffdf0;
  color: #333;
  padding: 10px;
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
  display: flex;
  align-items: center;
}

.cancel-btn {
  background-color: transparent;
  border: 1px solid #8B0000; /* Dark red border */
  color: #8B0000; /* Dark red text */
}

.cancel-btn:hover {
  background-color: rgba(139, 0, 0, 0.1); /* Light red background */
}

.submit-btn {
  background: linear-gradient(135deg, #8B0000 0%, #B22222 100%); /* Dark red gradient */
  border: none;
  color: white;
  box-shadow: 0 4px 6px rgba(139, 0, 0, 0.3);
  position: relative;
  gap: 8px;
}

.submit-btn svg {
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke: white;
  stroke-width: 2;
  transform: translateX(-5px);
}

.submit-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(139, 0, 0, 0.4);
}

.submit-btn:hover svg {
  transform: translateX(0);
}

/* 留言详情样式 */
.message-detail {
  padding: 0; /* 移除padding以便header能够充分利用空间 */
}

.message-detail .modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: linear-gradient(135deg, #8B0000 0%, #B22222 100%);
  color: white;
}

.message-detail .detail-content {
  padding: 20px;
  overflow-y: auto;
  flex-grow: 1;
}

/* 留言详情卡片 - 简化样式 */
.detail-message-card {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  border: 1px solid #e0e0e0;
}

/* 移除便签效果 */
.detail-message-card::before {
  display: none;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: linear-gradient(135deg, #8B0000 0%, #B22222 100%);
  color: white;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.3rem;
  font-family: 'Georgia', serif;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 1.8rem;
  cursor: pointer;
  line-height: 1;
  padding: 0 5px;
}

.close-btn:hover {
  transform: scale(1.2);
}

/* 详情页中的留言卡片样式 */
.detail-message-card {
  background-color: #fffdf0; /* 保持与普通留言卡片一致的背景色 */
  border-radius: 2px;
  padding: 20px;
  box-shadow: 3px 3px 5px rgba(0, 0, 0, 0.15);
  position: relative;
  border-bottom: 1px solid #e0d070;
  border-right: 1px solid #e0d070;
  font-family: 'Georgia', serif;
  margin-bottom: 20px;
}

.detail-message-card::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  border-width: 0 16px 16px 0;
  border-style: solid;
  border-color: #e0d070 #f9f9f9;
}

/* 评论列表样式 - 更简洁紧凑的版本 */
.comments-section {
  display: flex;
  flex-direction: column;
  margin-top: 20px;
}

.comments-section h4 {
  font-size: 1.1rem;
  color: #8B0000;
  margin: 0 0 15px 0;
  padding-bottom: 8px;
  border-bottom: 1px solid #e0e0e0;
  font-weight: bold;
  font-family: 'Georgia', serif;
}

.comments-list {
  display: flex;
  flex-direction: column;
}

/* 简化评论项，不使用卡片样式 */
.comment-item {
  padding: 10px 0;
  border-bottom: 1px solid #e8e8e8;
}

.comment-item:hover {
  background-color: rgba(139, 0, 0, 0.03);
}

.comment-header {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
  margin-bottom: 5px;
}

.comment-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #8B0000;
}

.comment-user-name {
  margin: 0;
  font-size: 0.9rem;
  color: #8B0000;
  font-weight: 600;
}

.comment-time {
  font-size: 0.75rem;
  color: #777;
  margin-left: auto; /* 将时间推到右侧 */
}

.comment-content {
  font-size: 0.95rem;
  line-height: 1.4;
  color: #333;
  margin: 0 0 5px 38px; /* 左侧缩进，与头像对齐 */
}

.comment-actions {
  display: flex;
  justify-content: flex-end;
}

.comment-action-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  background: none;
  border: none;
  cursor: pointer;
  color: #8B0000;
  font-size: 0.8rem;
  padding: 2px 6px;
  border-radius: 12px;
}

.comment-action-btn:hover {
  background-color: rgba(139, 0, 0, 0.1);
}

.comment-action-btn.active {
  color: #FF4500;
  font-weight: 500;
}

.no-comments {
  text-align: center;
  padding: 15px 0;
  color: #777;
  font-style: italic;
}

/* 评论表单固定在底部 */
.add-comment-form {
  padding: 15px 20px;
  background-color: #f9f9f9;
  border-top: 1px solid #e0e0e0;
  margin-top: auto; /* 推到底部 */
  box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.05);
}

.add-comment-form textarea {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #8B0000;
  border-radius: 8px;
  font-size: 0.95rem;
  resize: none;
  background-color: #fffdf0;
  font-family: 'Georgia', serif;
}

.add-comment-form textarea:focus {
  outline: none;
  border-color: #B22222;
  box-shadow: 0 0 0 3px rgba(178, 34, 34, 0.2);
}

.submit-comment-btn {
  margin-top: 12px;
  padding: 10px 25px;
  background: linear-gradient(135deg, #8B0000 0%, #B22222 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  cursor: pointer;
  float: right;
  font-family: 'Georgia', serif;
  font-weight: 500;
}

.submit-comment-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(139, 0, 0, 0.3);
}

/* 滚动条样式 */
.message-section::-webkit-scrollbar,
.modal-body::-webkit-scrollbar {
  width: 8px;
}

.message-section::-webkit-scrollbar-track,
.modal-body::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.message-section::-webkit-scrollbar-thumb,
.modal-body::-webkit-scrollbar-thumb {
  background: rgba(139, 0, 0, 0.5);
  border-radius: 4px;
}

.message-section::-webkit-scrollbar-thumb:hover,
.modal-body::-webkit-scrollbar-thumb:hover {
  background: rgba(139, 0, 0, 0.7);
}

/* 点赞高亮效果 */
.action-btn.like.active .icon,
.comment-action-btn.like.active .icon {
}

/* 添加消息列表过渡动画 */
.message-fade-enter-active, .message-fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}
.message-fade-enter, .message-fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
.message-fade-move {
  transition: transform 0.3s;
}



</style>