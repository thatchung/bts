<template>
  <a-row :gutter="24">
    <a-col v-for="(item, index) in controller" :key="index" :span="6">
      <div :class="`ref-item ${( !item.id ) ? 'fail' : ''}`">
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
      controller: [
          {
            id: 0,
            code: 1,
            dec: 'relay1'
          },
          {
            id: 1,
            code: 1,
            dec: 'relay2'
          },
          {
            id: 2,
            code: 1,
            dec: 'relay3'
          },
          {
            id: 3,
            code: 1,
            dec: 'relay4'
          },
          {
            id: 0,
            code: 2,
            dec: 'input1'
          },
          {
            id: 1,
            code: 2,
            dec: 'input2'
          },
          {
            id: 2,
            code: 2,
            dec: 'input3'
          },
          {
            id: 3,
            code: 2,
            dec: 'input4'
          }
      ]
    }
  },
  mounted () {
    if (this.data && this.data.length > 0) {
      this.controller = this.data
    }
  },
  methods: {
    getData () {
      return this.controller
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
