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
          <button type="submit" class="submit-btn" :disabled="isSubmitting">
            <span>{{ isSubmitting ? '发布中...' : '发布' }}</span>
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

      <div class="detail-content" v-if="!isLoadingDetail">
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
      
      <!-- 加载状态 -->
      <div class="loading-container" v-else>
        <div class="loading-spinner"></div>
        <p>加载中...</p>
      </div>

      <!-- 添加评论表单 - 固定在底部 -->
      <div class="add-comment-form">
        <textarea v-model="newComment" placeholder="写下你的评论..." rows="3"></textarea>
        <button class="submit-comment-btn" @click="submitComment" :disabled="isSubmittingComment">
          {{ isSubmittingComment ? '发布中...' : '发布评论' }}
        </button>
      </div>
    </div>

    <!-- 留言列表 -->
    <div class="main-section message-section" v-else>
      <!-- 搜索结果提示 -->
      <div class="search-results-info" v-if="searchQuery">
      </div>

      <!-- 加载状态 -->
      <div class="loading-container" v-if="isLoading">
        <div class="loading-spinner"></div>
        <p>加载中...</p>
      </div>
      
      <!-- 留言列表 -->
      <transition-group name="message-fade" tag="div" class="message-list" v-else>
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
      <div class="no-results" v-if="searchQuery && !isLoading && displayedMessages.length === 0">
        <p>没有找到匹配 "{{ searchQuery }}" 的留言</p>
      </div>
      
      <!-- 没有任何留言时显示 -->
      <div class="no-results" v-if="!isLoading && !searchQuery && messages.length === 0">
        <p>暂无留言，快来发表第一条留言吧！</p>
      </div>
    </div>
  </main>
</template>

<script>
import { messageboardApi } from '@/api';

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
      messages: [],
      newPost: {
        title: '',
        content: '',
        tag: ''
      },
      selectedMessage: null, // 当前选中的留言
      newComment: '', // 新评论内容
      isLoading: true, // 加载留言列表状态
      isLoadingDetail: false, // 加载留言详情状态
      isSubmitting: false, // 提交新留言状态
      isSubmittingComment: false, // 提交评论状态
      error: null
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
        this.fetchMessageDetail(newId);
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
    // 获取所有留言
    async fetchMessages() {
      this.isLoading = true;
      try {
        const response = await messageboardApi.getMessages();
        if (response.data && response.data.code === 200) {
          this.messages = response.data.data || [];
          this.$emit('messages-updated', this.messages);
        } else {
          console.error('获取留言列表失败:', response.data.msg);
          this.error = response.data.msg || '获取留言列表失败';
        }
      } catch (error) {
        console.error('获取留言列表出错:', error);
        this.error = '网络错误，请稍后再试';
      } finally {
        this.isLoading = false;
      }
    },
    // 获取留言详情
    async fetchMessageDetail(id) {
      this.isLoadingDetail = true;
      try {
        const response = await messageboardApi.getMessageDetail(id);
        if (response.data && response.data.code === 200) {
          this.selectedMessage = response.data.data;
          this.newComment = ''; // 清空评论框
        } else {
          console.error('获取留言详情失败:', response.data.msg);
          this.$emit('show-toast', { type: 'error', message: response.data.msg || '获取留言详情失败' });
        }
      } catch (error) {
        console.error('获取留言详情出错:', error);
        this.$emit('show-toast', { type: 'error', message: '网络错误，请稍后再试' });
      } finally {
        this.isLoadingDetail = false;
      }
    },
    // 提交新留言
    async submitNewPost() {
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

      this.isSubmitting = true;

      try {
        const response = await messageboardApi.createMessage({
          title: this.newPost.title,
          content: this.newPost.content,
          tag: this.newPost.tag
        });

        if (response.data && response.data.code === 200) {
          // 重置表单
          this.newPost = {
            title: '',
            content: '',
            tag: ''
          };

          // 隐藏表单
          this.$emit('hide-new-post-form');

          // 重新获取留言列表
          await this.fetchMessages();

          // 提示成功
          setTimeout(() => {
            alert('留言发布成功！');
          }, 300);
        } else {
          console.error('发布留言失败:', response.data.msg);
          alert(response.data.msg || '发布留言失败');
        }
      } catch (error) {
        console.error('发布留言出错:', error);
        alert('网络错误，请稍后再试');
      } finally {
        this.isSubmitting = false;
      }
    },
    // 点赞/取消点赞留言
    async toggleLike(message) {
      try {
        if (message.isLiked) {
          // 已点赞，取消点赞
          const response = await messageboardApi.unlikeMessage(message.mid);
          if (response.data && response.data.code === 200) {
            message.isLiked = false;
            // 依赖后端返回的结果，不在前端手动减1
          } else {
            console.error('取消点赞失败:', response.data.msg);
            this.$emit('show-toast', { type: 'error', message: response.data.msg || '取消点赞失败' });
            return;
          }
        } else {
          // 未点赞，添加点赞
          const response = await messageboardApi.likeMessage(message.mid);
          if (response.data && response.data.code === 200) {
            message.isLiked = true;
            // 依赖后端返回的结果，不在前端手动加1
          } else {
            console.error('点赞失败:', response.data.msg);
            this.$emit('show-toast', { type: 'error', message: response.data.msg || '点赞失败' });
            return;
          }
        }

        // 重新获取留言数据，确保点赞数正确
        if (this.selectedMessage && message.mid === this.selectedMessage.mid) {
          await this.fetchMessageDetail(message.mid);
        } else {
          // 如果是在列表页点赞，更新整个留言列表
          await this.fetchMessages();
        }

        // 通知父组件消息已更新（用于热门列表更新）
        this.$emit('messages-updated', this.messages);
      } catch (error) {
        console.error('点赞操作出错:', error);
        this.$emit('show-toast', { type: 'error', message: '网络错误，请稍后再试' });
      }
    },
    // 点赞/取消点赞评论
    async toggleCommentLike(comment) {
      try {
        if (comment.isLiked) {
          // 已点赞，取消点赞
          const response = await messageboardApi.unlikeComment(comment.cid);
          if (response.data && response.data.code === 200) {
            comment.isLiked = false;
            // 依赖后端返回的结果，不在前端手动减1
          } else {
            console.error('取消点赞评论失败:', response.data.msg);
            this.$emit('show-toast', { type: 'error', message: response.data.msg || '取消点赞评论失败' });
            return;
          }
        } else {
          // 未点赞，添加点赞
          const response = await messageboardApi.likeComment(comment.cid);
          if (response.data && response.data.code === 200) {
            comment.isLiked = true;
            // 依赖后端返回的结果，不在前端手动加1
          } else {
            console.error('点赞评论失败:', response.data.msg);
            this.$emit('show-toast', { type: 'error', message: response.data.msg || '点赞评论失败' });
            return;
          }
        }

        // 重新获取留言详情，确保评论点赞数正确
        if (this.selectedMessage) {
          await this.fetchMessageDetail(this.selectedMessage.mid);
        }
      } catch (error) {
        console.error('评论点赞操作出错:', error);
        this.$emit('show-toast', { type: 'error', message: '网络错误，请稍后再试' });
      }
    },
    // 显示留言详情
    showMessageDetail(message) {
      this.fetchMessageDetail(message.mid);
    },
    // 关闭留言详情
    closeMessageDetail() {
      // 关闭留言详情
      this.selectedMessage = null;

      // 通知父组件消息已更新（用于热门列表更新）
      this.$emit('messages-updated', this.messages);
    },
    // 提交评论
    async submitComment() {
      // 验证评论
      if (!this.newComment.trim()) {
        alert('请输入评论内容');
        return;
      }

      this.isSubmittingComment = true;

      try {
        const response = await messageboardApi.commentMessage(this.selectedMessage.mid, {
          content: this.newComment
        });

        if (response.data && response.data.code === 200) {
          // 重新获取留言详情，更新评论列表
          await this.fetchMessageDetail(this.selectedMessage.mid);
          
          // 清空评论框
          this.newComment = '';
          
          // 更新留言列表中的评论数
          const originalMessage = this.messages.find(m => m.mid === this.selectedMessage.mid);
          if (originalMessage && this.selectedMessage.comments) {
            originalMessage.comments = this.selectedMessage.comments;
          }

          // 通知父组件消息已更新
          this.$emit('messages-updated', this.messages);
        } else {
          console.error('发表评论失败:', response.data.msg);
          alert(response.data.msg || '发表评论失败');
        }
      } catch (error) {
        console.error('发表评论出错:', error);
        alert('网络错误，请稍后再试');
      } finally {
        this.isSubmittingComment = false;
      }
    },
    // 清除搜索
    clearSearch() {
      this.$emit('clear-search');
    }
  },
  created() {
    // 获取留言列表
    this.fetchMessages();
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

/* 加载状态样式 */
.loading-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: #8B0000;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  margin-bottom: 10px;
  border: 4px solid rgba(139, 0, 0, 0.1);
  border-left-color: #8B0000;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.action-btn.like.active, .comment-action-btn.like.active {
  color: #FF4500;
  font-weight: 500;
}

/* 禁用按钮样式 */
.submit-btn:disabled, .submit-comment-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

</style>