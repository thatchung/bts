<template>
  <div>
    <div class="filter-container">
      <a-button type="primary" @click="openAddBts()">
        Thêm Trạm
      </a-button>
    </div>
    <div class="filter-container">
      <div class="filter-item d-inline-block mr-3" style="width:300px;">
        <a-input placeholder="Nhập mã trạm" v-model="filter.name_id" @keyup.enter="onSearch()"/>
      </div>
      <div class="filter-item" style="width:150px;">
        <a-select
          style="width: 150px"
          show-search
          placeholder="Chọn tỉnh"
          :default-active-first-option="false"
          :filter-option="false"
          :allowClear="true"
          :not-found-content="null"
          @search="handleSearchProvince"
          @change="(ex) => onSearchProvince(ex)"
          @deselect="(ex) => deSelectChangeSearch()"
        >
          <a-select-option v-for="p in list_province" :key="p.id" :value="p.id">
            {{ p.name }}
          </a-select-option>
        </a-select>
      </div>
    </div>
    <a-table rowKey="id" :columns="columns" :data-source="lists" :loading="loading" bordered size="middle" :pagination="false">
      <template slot="detail" slot-scope="item">
        <a :href="`/bts/${item.id}`" target="_blank">{{ item.name_id }}</a>
      </template>
      <template slot="action" slot-scope="item">
        <a-button type="primary" :loading="loadingBt" @click="openUpdate(item)">
          Chỉnh Sửa
        </a-button>
        <a-button type="primary" :loading="loadingBt" @click="openViewDetail(item)" style="margin-left: 5px;">
          Chi Tiết
        </a-button>
        <a-popconfirm title="Bạn có chắc xóa trạm này？" ok-text="Yes" cancel-text="No" @confirm="deleteBtsAction(item)">
          <a-button type="danger" :loading="loadingBt" style="margin-left: 5px;">
            Xóa
          </a-button>
        </a-popconfirm>
      </template>
    </a-table>
    <!-- <Pagination :total="total" @change="changePage" @showSizeChange="changePageSize" /> -->
    <a-modal
      title="Thêm Trạm Mới"
      :visible="isAdd"
      :confirm-loading="confirmLoading"
      ok-text="Thêm"
      cancel-text="Hủy"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-form-model :layout="'vertical'" :model="form">
        <a-form-model-item label="Mã trạm">
          <a-input v-model="form.name_id" placeholder="nhập mã trạm" />
        </a-form-model-item>
        <a-form-model-item label="Tỉnh">
          <a-select
            show-search
            placeholder="Chọn tỉnh"
            :default-active-first-option="false"
            :filter-option="false"
            :allowClear="true"
            :not-found-content="null"
            @search="handleSearchProvince"
            @change="(ex) => handleSelectProvince(ex)"
          >
            <a-select-option v-for="p in list_province" :key="p.id" :value="p.id">
              {{ p.name }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="Địa chỉ">
          <a-input v-model="form.address" placeholder="nhập địa chỉ" />
        </a-form-model-item>
        <a-form-model-item label="Lat">
          <a-input v-model="form.lat" placeholder="nhập điểm lat" />
        </a-form-model-item>
        <a-form-model-item label="Lng">
          <a-input v-model="form.lng" placeholder="nhập điểm lng" />
        </a-form-model-item>
        <a-form-model-item label="Chọn nhân viên">
          <a-select
            show-search
            placeholder="Chọn nhân viên"
            :default-active-first-option="false"
            :filter-option="false"
            :allowClear="true"
            :not-found-content="null"
            @change="(ex) => handleSelectChange(ex)"
            @deselect="(ex) => deSelectChange()"
          >
            <a-select-option v-for="d in list_users" :key="d.id" :value="d.id">
              {{ d.full_name }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-form-model>
    </a-modal>

    <a-modal
      title="Cập Nhật Thông Tin Trạm"
      :visible="isUpdate"
      :confirm-loading="confirmLoading"
      ok-text="Cập Nhật"
      cancel-text="Hủy"
      @ok="handleUpdateOk"
      @cancel="handleUpdateCancel"
    >
      <a-form-model :layout="'vertical'" :model="form">
        <a-form-model-item label="Mã trạm">
          <a-input v-model="form.name_id" placeholder="nhập mã trạm" />
        </a-form-model-item>
        <a-form-model-item label="Tỉnh">
          <a-select
            show-search
            placeholder="Chọn tỉnh"
            :default-active-first-option="false"
            :filter-option="false"
            :allowClear="true"
            :not-found-content="null"
            :value="province.id"
            @search="handleSearchProvince"
            @change="(ex) => handleSelectProvince(ex)"
          >
            <a-select-option v-for="p in list_province" :key="p.id" :value="p.id">
              {{ p.name }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="Địa chỉ">
          <a-input v-model="form.address" placeholder="nhập địa chỉ" />
        </a-form-model-item>
        <a-form-model-item label="Lat">
          <a-input v-model="form.lat" placeholder="nhập điểm lat" />
        </a-form-model-item>
        <a-form-model-item label="Lng">
          <a-input v-model="form.lng" placeholder="nhập điểm lng" />
        </a-form-model-item>
        <a-form-model-item label="Chọn nhân viên">
          <a-select
            show-search
            placeholder="Chọn nhân viên"
            :default-active-first-option="false"
            :filter-option="false"
            :allowClear="true"
            :not-found-content="null"
            :value="user_id"
            @change="(ex) => handleSelectChange(ex)"
            @deselect="(ex) => deSelectChange()"
          >
            <a-select-option v-for="d in list_users" :key="d.id" :value="d.id">
              {{ d.full_name }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>
<script>
import { getUserList } from '@/api/user'
import { getBtsList, addBts, updateBts, deleteBts } from '@/api/bts'
import provinces from '@/api/province'
import page from '@/mixins/page'
const columns = [
  {
    key: 'name_id',
    title: 'Mã trạm',
    align: 'center',
    scopedSlots: { customRender: 'detail' }
  },
  {
    key: 'address',
    dataIndex: 'address',
    title: 'Địa chỉ',
    align: 'center'
  },
  {
    key: 'province',
    dataIndex: 'province',
    title: 'Tỉnh',
    align: 'center'
  },
  {
    key: 'state',
    dataIndex: 'state',
    title: 'Trạng thái hoạt động',
    align: 'center'
  },
  {
    key: 'status',
    dataIndex: 'status',
    title: 'Kết nối',
    align: 'center'
  },
  {
    title: 'Action',
    key: 'action',
    width: 280,
    scopedSlots: { customRender: 'action' }
  }
]
export default {
  name: 'User',
  mixins: [page],
  // components: {
  //   Pagination: () => import('@@/pagination')
  // },
  data () {
    return {
      columns: Object.freeze(columns),
      lists: [],
      loading: false,
      loadingBt: false,
      isAdd: false,
      isUpdate: false,
      confirmLoading: false,
      list_users: [],
      user_id: null,
      list_province: [],
      province: {},
      filter: {
        name_id: null,
        province_id: null
      },
      form: {
        name_id: null,
        address: null,
        lat: null,
        lng: null
      },
      timeout: null
    }
  },
  methods: {
    edit (query) {},
    handleSearchProvince (value) {
      if (value && value.length > 0) {
        clearTimeout(this.timeout)
        this.timeout = setTimeout(async () => { this.searchProvince(value) }, 300)
      } else {
        this.list_province = provinces
      }
    },
    searchProvince (value) {
      this.list_province = provinces.filter(f => f.name.toLowerCase().includes(value.toLowerCase()))
    },
    handleSelectProvince (value) {
      if (value) {
        this.user_id = value
        this.province = this.list_province.find(o => o.id === value)
      }
    },
    handleSelectChange (value) {
      if (value) {
        this.user_id = value
      }
    },
    deSelectChange () {
      this.group_id = null
      this.group_name = null
    },
    loadUser () {
      getUserList().then(res => {
        this.list_users = res || []
      })
    },
    onSearchProvince (value) {
      if (value) {
        this.filter.province_id = value
        this.onSearch()
      }
    },
    deSelectChangeSearch () {
      this.filter.province_id = null
    },
    onSearch () {
      const params = {}
      if (this.filter.name_id) {
        params['filters[name_id][$contains]'] = this.filter.name_id
      }
      if (this.filter.province_id) {
        params['filters[province_id][$eq]'] = this.filter.province_id
      }
      this.loadData(params)
    },
    loadData (params = {}) {
      this.loading = true
      getBtsList({ ...params, 'populate[0]': 'users_user' }).then(res => {
        if (!res) {
          this.$message.warning('Load danh sách không thành công')
          return false
        }
        this.lists = res.data.map(o => { return { ...o.attributes, id: o.id } }) || []
        this.total = res.lenght
      }).finally(() => {
        this.loading = false
      })
    },
    openAddBts () {
      this.isAdd = true
      this.form = {
        name_id: null,
        address: null,
        lat: null,
        lng: null
      }
    },
    handleOk (e) {
      this.confirmLoading = true
      if (this.form.name_id && this.form.address) {
        const data = {
          ...this.form,
          users_user: this.user_id,
          province_id: this.province ? this.province.id : null,
          province: this.province ? this.province.name : null,
          state: 'normal',
          status: 'disconnected'
        }
        addBts({ data }).then(res => {
          if (!res) {
            this.$message.warning('Thêm mới không thành công')
            return false
          }
          this.$message.success('Thêm mới thành công')
          this.isAdd = false
          this.loadData()
        })
      }
      this.confirmLoading = false
    },
    handleCancel (e) {
      this.isAdd = false
    },
    openUpdate (item) {
      this.isUpdate = true
      this.form = item
      this.user_id = item.users_user?.data?.id
      this.province = item.province_id ? this.list_province.find(o => o.id === item.province_id) : {}
    },
    handleUpdateOk (e) {
      this.confirmLoading = true
      if (this.form.id && this.form.name_id && this.form.address) {
        const data = {
          ...this.form,
          province_id: this.province ? this.province.id : null,
          province: this.province ? this.province.name : null,
          users_user: this.user_id
        }
        updateBts({ data, id: this.form.id }).then(res => {
          if (!res) {
            this.$message.warning('Cập nhật không thành công')
            return false
          }
          this.$message.success('Cập nhật thành công')
          this.isUpdate = false
          this.loadData()
        })
      }
      this.confirmLoading = false
    },
    handleUpdateCancel (e) {
      this.isUpdate = false
    },
    deleteBtsAction (item) {
      this.loadingBt = true
      if (item.id) {
        deleteBts({
          id: item.id
        }).then(res => {
          if (!res) {
            this.$message.warning('Xóa không thành công')
            return false
          }
          this.$message.success('Xóa thành công')
          this.loadData()
        })
      }
      this.loadingBt = false
    },
    openViewDetail (item) {
      this.$router.push('/bts/' + item.id)
    }
  },
  mounted () {
    this.loadData()
    this.loadUser()
    this.list_province = provinces
  }
}
</script>
<style lang='less' scoped>
.control-table{
  width: 100%;
  display: block;
  float: left;
  margin: 5px 0px;
}
.filter-container{
  margin-bottom: 5px;
  margin-right: 5px;
  height: 30px;
  display: inline-block;
  float: left;
}
.filter-item{
  float: left;
  margin-right: 5px;
}
.ant-table-wrapper{
  padding-top: 40px;
}
</style>
