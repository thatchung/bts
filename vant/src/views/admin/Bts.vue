<template>
  <div>
    <div class="bts-container">
      <h2>Trạm: {{ bts.name_id }}</h2>
      <a-row>
        <a-col :span="15">
          <a-col :span="24" class="r-data">
            <a-alert message="Trạng thái hoạt động: Normal" type="success" show-icon v-if="bts.state === 'normal'"/>
            <a-alert message="Trạng thái hoạt động: Alarm" type="error" show-icon v-if="bts.state === 'alarm'"/>
          </a-col>
          <a-col :span="24" class="r-data">
            <a-alert message="Trạng thái kết nối: Connected" type="success" show-icon v-if="bts.status === 'connected'"/>
            <a-alert message="Trạng thái kết nối: Disconnected" type="error" show-icon v-if="bts.status === 'disconnected'"/>
          </a-col>
          <a-col :span="24" class="r-data">
            <a-descriptions title="Thông tin chi tiết">
              <a-descriptions-item label="Tên">
                {{ bts.name_id }}
              </a-descriptions-item>
              <a-descriptions-item label="Tỉnh">
                {{ bts.province }}
              </a-descriptions-item>
              <a-descriptions-item label="Địa chỉ">
                {{ bts.address }}
              </a-descriptions-item>
            </a-descriptions>
          </a-col>
        </a-col>
        <a-col :span="9" class="r-data">
          <GmapMap
            :center="{ lat:bts.lat, lng:bts.lng }"
            :zoom="14"
            map-type-id="terrain"
            style="width: 100%; height: 250px"
          >
            <GmapMarker ref="myMarker" :position="google && new google.maps.LatLng(bts.lat, bts.lng)" />
          </GmapMap>
        </a-col>
      </a-row>
    </div>
    <div class="list-device">
      <div class="filter-container">
        <a-button type="primary" @click="openAddDevice()">
          Thêm Thiết Bị
        </a-button>
      </div>
      <div class="filter-container">
        <div class="filter-item d-inline-block mr-3" style="width:300px;">
          <a-input placeholder="Nhập tên thiết bị" v-model="filter.name" @keyup.enter="onSearch()"/>
        </div>
      </div>
      <a-table rowKey="id" :columns="columns" :data-source="lists" :loading="loading" bordered size="middle" :pagination="false">
        <template slot="action" slot-scope="item">
          <a-button type="primary" :loading="loadingBt" @click="openUpdate(item)">
            Chỉnh Sửa
          </a-button>
          <a-popconfirm title="Bạn có chắc xóa thiết bị này？" ok-text="Yes" cancel-text="No" @confirm="deleteDeviceAction(item)">
            <a-button type="danger" :loading="loadingBt" style="margin-left: 5px;">
              Xóa
            </a-button>
          </a-popconfirm>
        </template>
      </a-table>
    </div>
    <a-modal
      title="Thêm Thiết Bị Mới"
      :visible="isAdd"
      :confirm-loading="confirmLoading"
      ok-text="Thêm"
      cancel-text="Hủy"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-form-model :layout="'vertical'" :model="form">
        <a-form-model-item label="Chọn profile">
          <a-select
            show-search
            placeholder="Chọn profile"
            :default-active-first-option="false"
            :filter-option="false"
            :allowClear="true"
            :not-found-content="null"
            @search="handleSearchProfile"
            @change="(ex) => handleSelectProfile(ex)"
          >
            <a-select-option v-for="p in list_profile" :key="p.id" :value="p.id">
              {{ p.name }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="Tên">
          <a-input v-model="form.name" placeholder="nhập tên thiết bị" />
        </a-form-model-item>
        <a-form-model-item label="Serial">
          <a-input v-model="form.serial" placeholder="nhập serial" />
        </a-form-model-item>
        <a-form-model-item label="Giao thức">
          <a-select style="width: 200px" v-model="form.protocol">
            <a-select-option value="modbus_tcp">
              modbus_tcp
            </a-select-option>
            <a-select-option value="modbus_rtu">
              modbus_rtu
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
    <a-modal
      title="Cập Nhật Thiết Bị"
      :visible="isUpdate"
      :confirm-loading="confirmLoading"
      ok-text="Cập Nhật"
      cancel-text="Hủy"
      @ok="handleUpdateOk"
      @cancel="handleUpdateCancel"
    >
      <a-form-model :layout="'vertical'" :model="form">
        <a-form-model-item label="Chọn profile">
          <a-select
            show-search
            placeholder="Chọn profile"
            :default-active-first-option="false"
            :filter-option="false"
            :allowClear="true"
            :not-found-content="null"
            :value="profile.id"
            @search="handleSearchProfile"
            @change="(ex) => handleSelectProfile(ex)"
          >
            <a-select-option v-for="p in list_profile" :key="p.id" :value="p.id">
              {{ p.name }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="Tên">
          <a-input v-model="form.name" placeholder="nhập tên thiết bị" />
        </a-form-model-item>
        <a-form-model-item label="Serial">
          <a-input v-model="form.serial" placeholder="nhập serial" />
        </a-form-model-item>
        <a-form-model-item label="Giao thức">
          <a-select style="width: 200px" v-model="form.protocol">
            <a-select-option value="modbus_tcp">
              modbus_tcp
            </a-select-option>
            <a-select-option value="modbus_rtu">
              modbus_rtu
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>
<script>
import { gmapApi } from 'vue2-google-maps'
import { getBtsDetial } from '@/api/bts'
import { getDeviceList, addDevice, updateDevice, deleteDevice } from '@/api/device'
import { getDProfilesList } from '@/api/device-profiles'
// import moment from 'moment'
const columns = [
  {
    key: 'name',
    title: 'Tên',
    dataIndex: 'name',
    align: 'center'
  },
  {
    key: 'protocol',
    title: 'Giao thức',
    dataIndex: 'protocol',
    align: 'center'
  },
  {
    key: 'serial',
    title: 'Serial',
    dataIndex: 'serial',
    align: 'center'
  },
  {
    key: 'model',
    title: 'Model',
    dataIndex: 'model',
    align: 'center'
  },
   {
    key: 'brand',
    title: 'Hạng',
    dataIndex: 'brand',
    align: 'center'
  },
  {
    key: 'type',
    title: 'Profile Type',
    dataIndex: 'type',
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
  name: 'BtsDetail',
  computed: {
    google: gmapApi
  },
  data () {
    return {
      columns: Object.freeze(columns),
      lists: [],
      loading: false,
      loadingBt: false,
      bts: {
        name_id: null,
        address: null,
        lat: 0,
        lng: 0,
        state: null,
        status: null,
        province: null,
        province_id: null
      },
      isAdd: false,
      isUpdate: false,
      confirmLoading: false,
      filter: {
        name: null
      },
      list_profile_origin: [],
      list_profile: [],
      profile: {},
      form: {
        name: null,
        serial: null,
        protocol: null
      }
    }
  },
  mounted () {
    if (this.$route.params.id) {
      this.getBts()
      this.loadData()
      this.loadListProfile()
    }
  },
  methods: {
    edit (query) {},
    getBts () {
      if (this.$route.params.id) {
        getBtsDetial({ id: this.$route.params.id }).then(res => {
          if (!res || !res.data) {
            this.$message.warning('Load thông tin không thành công')
            return false
          }
          this.bts = { ...res.data.attributes, id: res.data.id }
        }).finally(() => { })
      }
    },
    onSearch () {
      const params = {}
      if (this.filter.name) {
        params['filters[name][$contains]'] = this.filter.name
      }
      this.loadData(params)
    },
    loadData (params = {}) {
      this.loading = true
      params['filters[bts]'] = this.$route.params.id
      getDeviceList({ ...params }).then(res => {
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
    loadListProfile (name) {
      let params = {}
      if (name) {
        params['filters[name][$contains]'] = name
      }
      getDProfilesList({ ...params }).then(res => {
        this.list_profile = res.data.map(o => { return { ...o.attributes, id: o.id } }) || []
        if (!name) {
          this.list_profile_origin = this.list_profile
        }
      })
    },
    handleSearchProfile (value) {
      if (value && value.length > 0) {
        clearTimeout(this.timeout)
        this.timeout = setTimeout(async () => { this.loadListProfile(value) }, 300)
      } else {
        this.list_profile = this.list_profile_origin
      }
    },
    handleSelectProfile (value) {
      if (value) {
        this.profile = this.list_profile.find(o => o.id === value)
      }
    },
    openAddDevice () {
      this.isAdd = true
      this.form = {
        name: null,
        serial: null,
        protocol: null
      }
      this.profile = {}
      this.list_profile = this.list_profile_origin
    },
    handleOk (e) {
      this.confirmLoading = true
      if (this.$route.params.id && this.form.name && this.form.serial && this.profile.id) {
        const data = {
          ...this.form,
          model: this.profile.model,
          brand: this.profile.brand,
          type: this.profile.type,
          profile_id: this.profile.id,
          bts: this.$route.params.id
        }
        addDevice({ data }).then(res => {
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
      this.form = {
        id: item.id,
        name: item.name,
        serial: item.serial,
        protocol: item.protocol
      }
      this.profile = {
        model: item.model,
        brand: item.brand,
        type: item.type,
        id: item.profile_id
      }
    },
    handleUpdateOk (e) {
      this.confirmLoading = true
      if (this.$route.params.id && this.form.name && this.form.serial && this.profile.id) {
        const data = {
          ...this.form,
          model: this.profile.model,
          brand: this.profile.brand,
          type: this.profile.type,
          profile_id: this.profile.id
        }
        updateDevice({ data, id: this.form.id }).then(res => {
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
    deleteDeviceAction (item) {
      this.loadingBt = true
      if (item.id) {
        deleteDevice({
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
  }
}
</script>
<style lang='less' scoped>
.r-data{
  padding: 5px;
}
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
