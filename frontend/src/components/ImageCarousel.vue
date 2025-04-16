<template>
  <div class="carousel-area" :style="{ width: width + 'px' }">
    <el-carousel :height="height + 'px'" :width="width + 'px'" motion-blur>
      <el-carousel-item v-for="item in items" :key="item.id">
        <img :src="item.imageUrl" :alt="item.altText" class="carousel-image">
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
export default {
  name: 'ImageCarousel',
  props: {
    items: {
      type: Array,
      required: true,
      validator: (value) => {
        return value.every(item => 'id' in item && 'imageUrl' in item && 'altText' in item);
      }
    },
    height: {
      type: Number,
      default: 300
    },
    width: {
      type: Number,
      default: 300
    }
  }
}
</script>

<style scoped>
.carousel-area {
  margin: 0 auto;
}

.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

:deep(.el-carousel),
:deep(.el-carousel__container) {
  width: 100%;
  height: 100%;
}

:deep(.el-carousel__item) {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f7fa;
}
</style>