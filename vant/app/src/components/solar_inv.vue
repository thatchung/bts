<template>
  <a-row :gutter="24">
    <a-col v-for="(item, index) in solar_inv" :key="index" :span="6">
      <div :class="`ref-item ${( !item.id || !item.scale ) ? 'fail' : ''}`">
        <a-col :span="12" class="col-item">
          <label>Function Code :</label>
        </a-col>
        <a-col :span="12" class="col-item">
          <label>{{ item.code }}</label>
        </a-col>
        <a-col :span="12" class="col-item">
          <label>Description :</label>
        </a-col>
        <a-col :span="12" class="col-item">
          <label>{{ item.dec }}</label>
        </a-col>
        <a-col :span="12" class="col-item">
          <label>Id</label> :
        </a-col>
        <a-col :span="12" class="col-item">
          <a-input v-model="item.id" placeholder="id" />
        </a-col>
        <a-col :span="12" class="col-item">
          <label>Scale</label> :
        </a-col>
        <a-col :span="12" class="col-item">
          <a-input v-model="item.scale" placeholder="scale" />
        </a-col>
      </div>
    </a-col>
  </a-row>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data () {
    return {
      solar_inv: [
          {
            id: 40049,
            dec: 'id',
            code: 3,
            scale: 1
          },
          {
            id: 40068,
            dec: 'sn',
            code: 3,
            scale: 1
          },
          {
            id: 40036,
            dec: 'model',
            code: 3,
            scale: 1
          },
          {
            id: 40104,
            dec: 'tmpcab',
            code: 3,
            scale: 1
          },
          {
            id: 40109,
            dec: 'st',
            code: 3,
            scale: 1
          },
          {
            id: 40299,
            dec: 'wmaxlim_ena',
            code: 3,
            scale: 1
          },
          {
            id: 40295,
            dec: 'wmaxlim_per',
            code: 3,
            scale: 1
          },
          {
            id: 40296,
            dec: 'wmaxlim_time',
            code: 3,
            scale: 1
          },
          {
            id: 40100,
            dec: 'dcv',
            code: 3,
            scale: 1
          },
          {
            id: 40098,
            dec: 'dci',
            code: 3,
            scale: 1
          },
          {
            id: 40102,
            dec: 'dcw',
            code: 3,
            scale: 1
          },
          {
            id: 40087,
            dec: 'acf',
            code: 3,
            scale: 1
          },
          {
            id: 40074,
            dec: 'ac_ca',
            code: 3,
            scale: 1
          },
          {
            id: 40075,
            dec: 'ac_cb',
            code: 3,
            scale: 1
          },
          {
            id: 40076,
            dec: 'ac_cc',
            code: 3,
            scale: 1
          },
          {
            id: 40081,
            dec: 'ac_va',
            code: 3,
            scale: 1
          },
          {
            id: 40082,
            dec: 'ac_vb',
            code: 3,
            scale: 1
          },
          {
            id: 40083,
            dec: 'ac_vc',
            code: 3,
            scale: 1
          },
          {
            id: 40085,
            dec: 'ac_w',
            code: 3,
            scale: 1
          },
          {
            id: 40091,
            dec: 'ac_var',
            code: 3,
            scale: 1
          },
          {
            id: 40096,
            dec: 'ac_e',
            code: 3,
            scale: 1
          }
      ]
    }
  },
  mounted () {
    if (this.data && this.data.length > 0) {
      this.solar_inv = this.data
    }
  },
  methods: {
    getData () {
      return this.solar_inv
    }
  }
}
</script>
<style lang="less" scoped>
  .ref-item {
    border-radius: 4px;
    border: 1px solid #8c8c8c;
    float: left;
    margin-bottom: 20px;
    background-color: #68cd863b;
    padding-top: 10px;
    padding-bottom: 5px;
    .col-item{
      margin-bottom: 2px;
    }
    input {
      background-color: #fff0;
    }
  }
  .fail{
    background-color: #f15d6930;
  }
</style>
