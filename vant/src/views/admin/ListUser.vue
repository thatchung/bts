<template>
  <div>
    <div class="filter-container">
      <a-button type="primary" @click="openAddUser()">
        Thêm Nhân Viên
      </a-button>
    </div>
    <div class="filter-container">
      <div class="filter-item d-inline-block mr-3" style="width:300px;">
        <a-input placeholder="Nhập tên nhân viên" v-model="filter.user_name" @keyup.enter="onSearch()"/>
      </div>
    </div>
    <a-table rowKey="id" :columns="columns" :data-source="lists" :loading="loading" bordered size="middle" :pagination="false">
      <template slot="action" slot-scope="item">
        <a-button type="primary" :loading="loadingBt" @click="openUpdate(item)">
          Chỉnh Sửa
        </a-button>
        <a-popconfirm title="Bạn có chắc xóa Tài Khoản này？" ok-text="Yes" cancel-text="No" @confirm="deleteUserAction(item)">
          <a-button type="danger" :loading="loadingBt" style="margin-left: 5px;">
            Xóa
          </a-button>
        </a-popconfirm>
      </template>
    </a-table>
    <!-- <Pagination :total="total" @change="changePage" @showSizeChange="changePageSize" /> -->
    <a-modal
      title="Thêm Nhân Viên Mới"
      :visible="isAdd"
      :confirm-loading="confirmLoading"
      ok-text="Thêm"
      cancel-text="Hủy"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-form-model :layout="'vertical'" :model="form">
        <a-form-model-item label="Username">
          <a-input v-model="form.username" placeholder="nhập username" />
        </a-form-model-item>
        <a-form-model-item label="Email">
          <a-input v-model="form.email" placeholder="nhập email" />
        </a-form-model-item>
        <a-form-model-item label="Password">
          <a-input v-model="form.password" placeholder="nhập password" />
        </a-form-model-item>
        <a-form-model-item label="Họ Tên">
          <a-input v-model="form.full_name" placeholder="nhập họ và tên" />
        </a-form-model-item>
        <a-form-model-item label="Số Điện Thoại">
          <a-input v-model="form.phone" placeholder="nhập số điện thoại" />
        </a-form-model-item>
        <a-form-model-item label="Vai trò">
          <a-select style="width: 120px" @change="handleChangeType">
            <a-select-option value="admin">
              Admin
            </a-select-option>
            <a-select-option value="viewer">
              Viewer
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-form-model>
    </a-modal>

    <a-modal
      title="Cập Nhật Nhân Viên"
      :visible="isUpdate"
      :confirm-loading="confirmLoading"
      ok-text="Cập Nhật"
      cancel-text="Hủy"
      @ok="handleUpdateOk"
      @cancel="handleUpdateCancel"
    >
      <a-form-model :layout="'vertical'" :model="form">
        <a-form-model-item label="Username">
          <a-input v-model="form.username" placeholder="nhập username" />
        </a-form-model-item>
        <a-form-model-item label="Email">
          <a-input v-model="form.email" placeholder="nhập email" />
        </a-form-model-item>
        <a-form-model-item label="Password">
          <a-input v-model="form.password" placeholder="Để trống nếu không cập nhật" />
        </a-form-model-item>
        <a-form-model-item label="Họ Tên">
          <a-input v-model="form.full_name" placeholder="nhập họ và tên" />
        </a-form-model-item>
        <a-form-model-item label="Số Điện Thoại">
          <a-input v-model="form.phone" placeholder="nhập số điện thoại" />
        </a-form-model-item>
        <a-form-model-item label="Vai trò">
          <a-select :value="form.type" style="width: 120px" @change="handleChangeType">
            <a-select-option value="admin">
              Admin
            </a-select-option>
            <a-select-option value="viewer">
              Viewer
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>
<script>
import { getUserList, addUser, updateUser, deleteUser } from '@/api/user'
import page from '@/mixins/page'
const columns = [
  {
    key: 'id',
    dataIndex: 'id',
    title: 'Id',
    align: 'center'
  },
  {
    key: 'username',
    dataIndex: 'username',
    title: 'Username',
    align: 'center'
  },
  {
    key: 'email',
    dataIndex: 'email',
    title: 'Email',
    align: 'center'
  },
  {
    key: 'type',
    dataIndex: 'type',
    title: 'Vai Trò',
    width: 80,
    align: 'type'
  },
  {
    key: 'full_name',
    dataIndex: 'full_name',
    title: 'Họ Tên',
    align: 'center'
  },
  {
    key: 'phone',
    dataIndex: 'phone',
    title: 'SĐT',
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
      filter: {
        user_name: null
      },
      form: {
        email: null,
        password: null,
        username: null,
        full_name: null,
        phone: null,
        type: null
      }
    }
  },
  methods: {
    edit (query) {},
    handleChangeType (selectedItems) {
      this.form.type = selectedItems
    },
    onSearch () {
      const params = {}
      if (this.filter.user_name) {
        params['filters[$or][0][username][$contains]'] = this.filter.user_name
        params['filters[$or][1][full_name][$contains]'] = this.filter.user_name
      }
      this.loadData(params)
    },
    loadData (params = {}) {
      this.loading = true
      getUserList(params).then(res => {
        if (!res) {
          this.$message.warning('Load danh sách không thành công')
          return false
        }
        this.lists = res || []
        this.total = res.lenght
      }).finally(() => {
        this.loading = false
      })
    },
    openAddUser () {
      this.isAdd = true
      this.form = {
        email: null,
        password: null,
        username: null,
        full_name: null,
        phone: null,
        type: null
      }
    },
    handleOk (e) {
      this.confirmLoading = true
      if (this.form.email && this.form.password && this.form.username) {
        if (this.form.password.length <= 6) {
          this.$message.warning('Password must be at least 6 characters')
          return
        }
        addUser({
          ...this.form,
          confirmed: true
        }).then(res => {
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
    },
    handleUpdateOk (e) {
      this.confirmLoading = true
      if (this.form.id && this.form.email && this.form.username) {
        const updateData = {
          id: this.form.id,
          email: this.form.email,
          username: this.form.username
        }
        if (this.form.password) {
          if (this.form.password.length <= 6) {
            this.$message.warning('Password must be at least 6 characters')
            return
          }
          updateData.password = this.form.password
        }
        if (this.form.full_name) {
          updateData.full_name = this.form.full_name
        }
        if (this.form.type) {
          updateData.type = this.form.type
        }
        if (this.form.phone) {
          updateData.phone = this.form.phone
        }

        updateUser(updateData).then(res => {
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
    deleteUserAction (item) {
      this.loadingBt = true
      if (item.id) {
        deleteUser({
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
    }
  },
  mounted () {
    this.loadData()
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
