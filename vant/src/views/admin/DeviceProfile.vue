<template>
  <div>
    <div class="filter-container">
      <a-button type="primary" @click="openAddProfile()">
        Thêm Device Profile
      </a-button>
    </div>
    <div class="filter-container">
      <div class="filter-item d-inline-block mr-3" style="width:300px;">
        <a-input placeholder="Nhập tên profile" v-model="filter.name" @keyup.enter="onSearch()"/>
      </div>
    </div>
    <a-table rowKey="id" :columns="columns" :data-source="lists" :loading="loading" bordered size="middle" :pagination="false">
      <template slot="action" slot-scope="item">
        <a-button type="primary" :loading="loadingBt" @click="openUpdate(item)">
          Chỉnh Sửa
        </a-button>
        <a-popconfirm title="Bạn có chắc xóa Profile này？" ok-text="Yes" cancel-text="No" @confirm="deleteAction(item)">
          <a-button type="danger" :loading="loadingBt" style="margin-left: 5px;">
            Xóa
          </a-button>
        </a-popconfirm>
      </template>
    </a-table>
    <a-modal
      title="Thêm Device Profile Mới"
      :visible="isAdd"
      :confirm-loading="confirmLoading"
      ok-text="Thêm"
      cancel-text="Hủy"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-form-model :layout="'vertical'" :model="form">
        <a-form-model-item label="Tên">
          <a-input v-model="form.name" placeholder="nhập tên" />
        </a-form-model-item>
        <a-form-model-item label="Model">
          <a-input v-model="form.model" placeholder="nhập model" />
        </a-form-model-item>
        <a-form-model-item label="Hãng">
          <a-input v-model="form.brand" placeholder="nhập hãng" />
        </a-form-model-item>
        <a-form-model-item label="Chủng loại">
          <a-select style="width: 250px" @change="handleChangeType">
            <a-select-option value="solar_inv">
              solar_inv
            </a-select-option>
            <a-select-option value="controller">
              controller
            </a-select-option>
            <a-select-option value="power_meter_3p">
              power_meter_3p
            </a-select-option>
            <a-select-option value="power_meter_1p">
              power_meter_1p
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-form-model>
    </a-modal>

    <a-modal
      title="Cập Nhật Device Profile"
      :visible="isUpdate"
      :confirm-loading="confirmLoading"
      ok-text="Cập Nhật"
      cancel-text="Hủy"
      @ok="handleUpdateOk"
      @cancel="handleUpdateCancel"
    >
      <a-form-model :layout="'vertical'" :model="form">
        <a-form-model-item label="Tên">
          <a-input v-model="form.name" placeholder="nhập tên" />
        </a-form-model-item>
        <a-form-model-item label="Model">
          <a-input v-model="form.model" placeholder="nhập model" />
        </a-form-model-item>
        <a-form-model-item label="Hãng">
          <a-input v-model="form.brand" placeholder="nhập hãng" />
        </a-form-model-item>
        <a-form-model-item label="Chủng loại" >
          <a-select :value="form.type" style="width: 250px" @change="handleChangeType">
            <a-select-option value="solar_inv">
              solar_inv
            </a-select-option>
            <a-select-option value="controller">
              controller
            </a-select-option>
            <a-select-option value="power_meter_3p">
              power_meter_3p
            </a-select-option>
            <a-select-option value="power_meter_1p">
              power_meter_1p
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>
<script>
import { getDProfilesList, addDProfile, updateDProfile, deleteDProfile } from '@/api/device-profiles'
import page from '@/mixins/page'
const columns = [
  {
    key: 'id',
    dataIndex: 'id',
    title: 'Id',
    align: 'center',
    width: 80
  },
  {
    key: 'name',
    dataIndex: 'name',
    title: 'Tên',
    align: 'center'
  },
  {
    key: 'model',
    dataIndex: 'model',
    title: 'Model',
    align: 'center'
  },
  {
    key: 'brand',
    dataIndex: 'brand',
    title: 'Hãng',
    align: 'center'
  },
  {
    key: 'type',
    dataIndex: 'type',
    title: 'Vai Trò'
  },
  {
    title: 'Action',
    key: 'action',
    width: 280,
    scopedSlots: { customRender: 'action' }
  }
]
export default {
  name: 'DeviceProfile',
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
        name: null
      },
      form: {
        name: null,
        model: null,
        brand: null,
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
      if (this.filter.name) {
        params['filters[$or][0][name][$contains]'] = this.filter.name
      }
      this.loadData(params)
    },
    loadData (params = {}) {
      this.loading = true
      getDProfilesList(params).then(res => {
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
    openAddProfile () {
      this.isAdd = true
      this.form = {
        name: null,
        model: null,
        brand: null,
        type: null
      }
    },
    handleOk (e) {
      this.confirmLoading = true
      if (this.form.name && this.form.type) {
        addDProfile({ data: this.form }).then(res => {
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
      console.log(this.form)
    },
    handleUpdateOk (e) {
      this.confirmLoading = true
      if (this.form.id && this.form.name && this.form.type) {
        updateDProfile({ data: this.form, id: this.form.id }).then(res => {
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
    deleteAction (item) {
      this.loadingBt = true
      if (item.id) {
        deleteDProfile({
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
