<template>
  <div>
    <Spinner v-if="isLoading" />
    <template v-else>
      <form v-show="!isLoading"
          @submit.prevent="handleSubmit"
        >
        <div class="form-group">
          <label for="name">Name</label>
          <input type="text"
            id="name"
            v-model="restaurant.name"
            class="form-control"
            name="name"
            placeholder="Enter name"
            required
          >
        </div>

        <div class="form-group">
          <label for="categoryId">Category</label>
          <select id="categoryId"
              v-model="restaurant.categoryId"
              class="form-control"
              name="categoryId"
              required
            >
            <option value="0" selected disabled>--請選擇--</option>
            <option v-for="cate in categories"
              :key="cate.id"
              :value="cate.id"
            >{{cate.name}}</option>
          </select>
        </div>

        <div class="form-group">
          <label for="tel">Tel</label>
          <input type="text"
            id="tel"
            v-model="restaurant.tel"
            class="form-control"
            name="tel"
            placeholder="Enter telephone number"
          >
        </div>

        <div class="form-group">
          <label for="address">Address</label>
          <input type="text"
            id="address"
            v-model="restaurant.address"
            class="form-control"
            name="address"
            placeholder="Enter address"
          >
        </div>

        <div class="form-group">
          <label for="opening-hours">Opening Hours</label>
          <input type="time"
            id="opening-hours"
            v-model="restaurant.openingHours"
            class="form-control"
            name="opening_hours"
          >
        </div>

        <div class="from-group">
          <label for="description">Description</label>
          <textarea class="form-control"
            id="description"
            v-model="restaurant.description"
            name="description"
            rows="3"
          >
          </textarea>
        </div>

        <div class="form-group">
          <label for="image">Image</label>
          <img v-if="restaurant.image"
            :src="restaurant.image"
            class="d-block img-thumbnail mb-3"
            width="200" height="200"
          >
          <input type="file"
            id="image"
            name="image"
            accept="image/*"
            class="form-control-file"
            @change="handleFileChange"
          >
        </div>

        <button class="btn btn-primary"
            type="submit"
            :disabled="isProcessing"
          >
          {{ isProcessing ? '處理中...' : '送出' }}
        </button>
        <button class="ml-3 btn btn-link" @click="$router.back()">
          回上頁
        </button>
      </form>
    </template>
  </div>
</template>

<script>
import Spinner from '../components/Spinner.vue'
import adminAPI from '../apis/admin.js'
import { Toast } from '../utils/helpers.js'

export default {
  props: {
    initialRestaurant: {
      type: Object,
      default: () => ({
        name: '',
        categoryId: 0,
        tel: '',
        address: '',
        description: '',
        image: '',
        openingHours: '',
      })
    },
    isProcessing: {
      type: Boolean,
      default: false
    }
  },
  components: {
    Spinner
  },
  data() {
    return {
      restaurant: this.initialRestaurant,
      categories: [],
      isLoading: true
    }
  },
  watch: {
    initialRestaurant(newValue) {
      this.restaurant = { ...newValue }
    }
  },
  created() {
    this.fetchCategories()
  },
  methods: {
    async fetchCategories() {
      try {
        const { data } = await adminAPI.categories.get()
        this.categories = data.categories
        this.isLoading = false

      } catch(err) {
        this.isLoading = false
        Toast.fire({
          icon: 'error',
          title: '無法取得餐廳類別，請稍後再試'
        })
      }
    },
    handleFileChange(e) {
      const files = e.target.files
      if (!files.length) return false

      const imageURL = window.URL.createObjectURL(files[0])
      this.restaurant.image = imageURL
    },
    handleSubmit(e) {
      const { name, categoryId } = this.restaurant
      if (!name || !categoryId) {
        return Toast.fire({
          icon: 'warning',
          title: '請填寫餐廳名稱與類別'
        })
      }

      const form = e.target
      const formData = new FormData(form)
      this.$emit('after-submit', formData)
    }
  }
}
</script>