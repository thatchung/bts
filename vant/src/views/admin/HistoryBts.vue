<template>
  <div>
    <h2>Thông tin thiết bị trạm: {{ id }}</h2>
    <div class="filter-container">
      <div class="filter-item">
        <a-select
          style="width: 150px"
          show-search
          placeholder="Chọn thiết bị"
          :default-active-first-option="false"
          :filter-option="false"
          :allowClear="true"
          :not-found-content="null"
          @change="(ex) => onChange(ex)"
          @deselect="(ex) => deSelectChangeSearch()"
        >
          <a-select-option v-for="p in listDevice" :key="p.id" :value="p.id">
            {{ p.name }}
          </a-select-option>
        </a-select>
      </div>
    </div>
    <line-chart :chartdata="chartdata" :options="options" />
  </div>
</template>
<script>
import { getDeviceLog } from '@/api/device'
import LineChart from '@/components/Chart.vue'
import moment from 'moment'

export default {
  name: 'HistoryBts',
  components: {
    LineChart
  },
  data () {
    return {
      id: null,
      loading: false,
      filter: {
        create_date: null
      },
      colors: ['#1890ff', '#227b64', '#3f4082', '#b00000', '#b18c67', '#ac1ea1', '#ff8900', '#29221c', '#68cd86', '#810663'],
      chartdata: {
        labels: ['1', '2', '3', '4', '5', '6', '7'],
        datasets: [
          {
            label: 'Device 1',
            backgroundColor: '#1890ff',
            data: [40, 20, 1, 22, 12, 12, 40]
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      },
      dataBts: [],
      listDevice: [],
      deviceIndex: 0
    }
  },
  mounted () {
    this.id = this.$route.params.id
    const params = {}
    // this.filter.create_date = moment()
    // if (this.filter.create_date) {
    //   params.create_date_gte = moment(this.filter.create_date).startOf('month').format('YYYY-MM-DD')
    //   params.create_date_lte = moment(this.filter.create_date).endOf('month').format('YYYY-MM-DD')
    // }
    this.loadData(params)
  },
  methods: {
    edit (query) {},
    onChange (value) {
      if (value) {
        this.deviceIndex = value
        let labels = this.dataBts.map(o => { return moment(o.time).format('HH:mm:ss DD/MM/YYYY') })
        let data = this.dataBts.map(o => { return o.data.device[0].AC_E })
        let datasets = [
          {
            label: this.listDevice[value].name,
            backgroundColor: '#1890ff',
            data: data
          }
        ]
        this.chartdata = {
          labels: labels || [],
          datasets: datasets || []
        }
      }
    },
    deSelectChangeSearch () {
      this.deviceIndex = 0
    },
    onSearch () {
      const params = {}
      // if (this.filter.create_date) {
      //   params.create_date_gte = moment(this.filter.create_date).startOf('month').format('YYYY-MM-DD')
      //   params.create_date_lte = moment(this.filter.create_date).endOf('month').format('YYYY-MM-DD')
      // }
      this.loadData(params)
    },
    loadData (params) {
      const filter = {
        id: this.$route.params.id,
        ...params
      }
      this.loading = true
      getDeviceLog(filter).then(res => {
        if (!res) {
          return false
        }
        this.dataBts = res.data
        this.listDevice = res.data.length > 0 ? res.data[0].data.device.map((o, i) => { return { name: o.sNo, id: i } }) : []
        let labels = res.data.map(o => { return moment(o.time).format('HH:mm:ss DD/MM/YYYY') })
        // let data = res.data.map(o => { return o.data.device[0].AC_E })
        let datasets = []
        for (let i = 0; i < this.listDevice.length; i++) {
          let item = {
            label: this.listDevice[i].name,
              backgroundColor: this.colors[i],
              data: res.data.map(o => { return o.data.device[i].AC_E })
          }
          datasets.push(item)
        }
        // let datasets = [
        //   {
        //     label: this.listDevice[0].name,
        //     backgroundColor: '#1890ff',
        //     data: data
        //   }
        // ]
        this.chartdata = {
          labels: labels || [],
          datasets: datasets || []
        }
        this.loading = false
      })
    }
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
  height: 30px;
}
.filter-item{
  float: left;
  margin-right: 5px;
}
.filter-title{
  margin-right: 10px;
  font-weight: 600;
}
.data-table{
  margin-top: 100px;
}
.statistic-panel{
  float: right;
  box-shadow: 0 0px 10px 0 rgb(32 33 36 / 28%);
  padding: 10px;
  border-radius: 7px;
}
.ant-statistic{
  margin-right: 10px;
  display: inline-block;
  padding: 0px 20px;
}
</style>
