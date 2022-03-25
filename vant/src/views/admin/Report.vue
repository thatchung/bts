<template>
  <div>
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
      <div class="filter-container">
        <download-excel
          class="ant-btn ant-btn-primary"
          style="line-height: 28px;"
          :fetch="getExportReport"
          :fields="data_field_export"
          worksheet="report_data"
          :name="'Report ' + getDate() + '.xls'"
        >
          Export excel
          <i v-if="loadingExportData" class="el-icon-loading"></i>
        </download-excel>
      </div>
    </div>
    <a-table rowKey="_id" :columns="columns" :data-source="lists" :loading="loading" bordered size="middle" :pagination="false">
      <template slot="detail" slot-scope="item">
        <a :href="`/history/${item.id}`" target="_blank">{{ item.id }}</a>
      </template>
      <template slot="time" slot-scope="item">
        <span>{{ item | dateFilter }}</span>
      </template>
      <template slot="action" slot-scope="item">
        <a-button type="primary" :loading="loadingBt" @click="openViewDetail(item)" style="margin-left: 5px;">
          Chi Tiết
        </a-button>
      </template>
    </a-table>
  </div>
</template>
<script>

import { getDeviceLog } from '@/api/device'
import provinces from '@/api/province'
import moment from 'moment'
const columns = [
  {
    key: 'id',
    title: 'Site Id',
    align: 'center',
    scopedSlots: { customRender: 'detail' }
  },
  {
    key: 'time',
    dataIndex: 'time',
    title: 'Ngày',
    align: 'center',
    scopedSlots: { customRender: 'time' }
  },
  {
    key: 'status',
    dataIndex: 'status',
    title: 'Status',
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
  name: 'Dashboard',
  components: {
  },
  filters: {
    dateFilter (date) {
      return moment(date).format('HH:mm:ss DD/MM/YYYY')
    }
  },
  data () {
    return {
      columns: Object.freeze(columns),
      lists: [],
      loading: false,
      loadingBt: false,
      loadingExportData: false,
      confirmLoading: false,
      list_province: [],
      province: {},
      filter: {
        name_id: null,
        province_id: null
      },
      data_field_export: {
        id: 'id',
        time: 'time',
        status: 'status'
      },
      timeout: null
    }
  },
  methods: {
    edit (query) {},
    getDate () {
      return moment().format('hh:mm:ss DD/MM/YYYY')
    },
    async getExportReport () {
      return this.lists
    },
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
      getDeviceLog({ ...params }).then(res => {
        if (!res) {
          this.$message.warning('Load danh sách không thành công')
          return false
        }
        this.lists = res.data || []
        this.total = res.lenght
      }).finally(() => {
        this.loading = false
      })
    },
    openViewDetail (item) {
      this.$router.push('/bts/' + item.id)
    }
  },
  mounted () {
    this.loadData()
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
