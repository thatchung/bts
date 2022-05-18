<template>
  <div>
    <!-- <div class="filter-container">
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
          @change="(ex) => onChangeProvince(ex)"
          @deselect="(ex) => deSelectChangeSearch()"
        >
          <a-select-option v-for="p in list_province" :key="p.id" :value="p.id">
            {{ p.name }}
          </a-select-option>
        </a-select>
      </div>
    </div> -->
    <!-- <div class="map-container">
      <GmapMap
        :center="center"
        :zoom="12"
        map-type-id="satellite"
        style="margin-top: 25px;width: 100%; height: calc(100vh - 150px)"
      >
        <GmapMarker
          :key="index"
          v-for="(m, index) in markers"
          :position="m"
          @mouseover="showByIndex = index"
          @mouseout="showByIndex = null"
        >
          <gmap-info-window :opened="showByIndex === index" >
            <div>
              <div>Trạm : <b>{{ m.label }}</b></div>
              <div>Nhân Viên : <b>{{ m.user }}</b></div>
            </div>
          </gmap-info-window>
        </GmapMarker>
      </GmapMap>
    </div> -->
    <div class="map-popup">
      <GmapMap
        :center="center"
        :zoom="12"
        map-type-id="satellite"
        style="width: 100%; height: 100%"
      >
        <GmapMarker
          :key="index"
          v-for="(m, index) in markers"
          :position="m"
          :clickable="true"
          @click="center=m.position"
          @mouseover="showByIndex = index"
          @mouseout="showByIndex = null"
          :icon="markerOptions"
        >
          <gmap-info-window :opened="showByIndex === index" >
            <div>
              <div><a-icon type="table" />: <b>{{ m.label }}</b></div>
              <div><a-icon type="user" /> : <b>{{ m.user }}</b></div>
            </div>
          </gmap-info-window>
        </GmapMarker>
      </GmapMap>
      <div class="statistic-panel">
        <a-statistic title="Tổng trạm" :value="statistic.total_bts" />
        <a-statistic title="Trạm đang hoạt động" :value="statistic.total_action" />
        <a-statistic title="Trạm mất kết nói" :value="statistic.total_disconection" />
      </div>
    </div>
  </div>
</template>
<script>
import { getBtsList } from '@/api/bts'
import provinces from '@/api/province'
// import MapPopup from './c_map'

export default {
  name: 'Dashboard',
  // components: {
  //   MapPopup
  // },
  data () {
    return {
      loading: false,
      loadingBt: false,
      lists: [],
      center: { lat: 10.7776261, lng: 106.6930872 },
      markers: [],
      list_province: [],
      province: {},
      filter: {
        province_id: null
      },
      showByIndex: null,
      statistic: {
        total_bts: 0,
        total_action: 0,
        total_disconection: 0
      },
      markerOptions: {
        url: require('@/assets/image/tram.png'),
        size: {
          width: 30, height: 33
        },
        scaledSize: {
          width: 30, height: 33
        }
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
    onChangeProvince (value) {
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
        this.markers = this.lists.map(o => {
          return {
            lat: o.lat,
            lng: o.lng,
            label: o.name_id,
            user: o.users_user ? o.users_user.data.attributes.full_name : ''
          }
        })
        if (this.markers.length > 0) {
          this.center = { lat: this.markers[0].lat, lng: this.markers[0].lng }
        }
        this.statistic.total_bts = this.lists.length
        this.statistic.total_action = this.lists.length
        this.statistic.total_disconection = 0
      }).finally(() => {
        this.loading = false
      })
    }
  },
  mounted () {
    this.loadData()
    this.list_province = provinces
    this.$store.commit('setCollapsedInfo', true)
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
.map-popup{
  position: absolute;
  top: -55px;
  left: 0px;
  z-index: 100;
  width: 100%;
  height: 100vh;
}
.filter-container{
  margin-bottom: 5px;
  margin-right: 5px;
  height: 30px;
  display: inline-block;
}
.filter-item{
  float: left;
  margin-right: 5px;
}
.statistic-panel-left{
  float: left;
  box-shadow: 0 0px 10px 0 rgb(32 33 36 / 28%);
  padding: 10px;
  border-radius: 7px;
}
.statistic-panel{
  float: right;
  box-shadow: 0 0px 10px 0 rgb(32 33 36 / 28%);
  padding: 0px 10px;
  background-color: #ffffff5c;
  position: absolute;
  bottom: 0px;
  left: 0px;
}
.ant-statistic{
  margin-right: 10px;
  display: inline-block;
  padding: 0px 20px;
}
</style>
