<template>
  <a-row :gutter="24">
    <a-col v-for="(item, index) in listdata" :key="index" :span="6">
      <div :class="`ref-item ${( !item.id || !item.code || !item.dec || !item.size || !item.scale ) ? 'fail' : ''}`">
        <div class="btn-minus" @click="removeItem(index)">-</div>
        <a-col :span="12" class="col-item">
          <label>Function Code :</label>
        </a-col>
        <a-col :span="12" class="col-item">
          <a-input v-model="item.code" placeholder="code" />
        </a-col>
        <a-col :span="12" class="col-item">
          <label>Description :</label>
        </a-col>
        <a-col :span="12" class="col-item">
          <a-input v-model="item.dec" placeholder="description" />
        </a-col>
        <a-col :span="12" class="col-item">
          <label>Id</label> :
        </a-col>
        <a-col :span="12" class="col-item">
          <a-input v-model="item.id" placeholder="id" />
        </a-col>
        <a-col :span="12" class="col-item">
          <label>Size</label> :
        </a-col>
        <a-col :span="12" class="col-item">
          <a-input v-model="item.size" placeholder="size" />
        </a-col>
        <a-col :span="12" class="col-item">
          <label>Scale</label> :
        </a-col>
        <a-col :span="12" class="col-item">
          <a-input v-model="item.scale" placeholder="scale" />
        </a-col>
      </div>
    </a-col>
    <a-col :span="6" class="col-item" @click="addNewItem()">
      <div class="ref-btn">
        <div class="btn-plus">+</div>
      </div>
    </a-col>
  </a-row>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: 'dc_power'
    },
    data: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data () {
    return {
      listdata: [
        {
          id: 40104,
          dec: 'tmpcab',
          code: 3,
          size: 1,
          scale: 1
        },
        {
          id: 40104,
          dec: 'tmpcab',
          code: 3,
          size: 1,
          scale: 1
        },
        {
          id: 40104,
          dec: 'tmpcab',
          code: 3,
          size: 1,
          scale: 1
        },
        {
          id: 40104,
          dec: 'tmpcab',
          code: 3,
          size: 1,
          scale: 1
        },
        {
          id: 40104,
          dec: 'tmpcab',
          code: 3,
          size: 1,
          scale: 1
        }
      ]
    }
  },
  mounted () {
    if (this.data && this.data.length > 0) {
      this.listdata = this.data
    }
  },
  methods: {
    getData () {
      return this.listdata
    },
    addNewItem () {
      this.listdata.push({
        id: 0,
          dec: '',
          code: 0,
          size: 0,
          scale: 0
      })
    },
    removeItem (index) {
      this.listdata.splice(index, 1)
    }
  }
}
</script>
<style lang="less" scoped>
  .ref-item {
    position: relative;
    border-radius: 4px;
    border: 1px solid #8c8c8c;
    float: left;
    margin-bottom: 20px;
    background-color: #68cd863b;
    padding-top: 10px;
    padding-bottom: 5px;
    height: 190px;
    .col-item{
      margin-bottom: 2px;
    }
    input {
      background-color: #fff0;
    }
    .btn-minus{
      position: absolute;
      right: 2px;
      top: 2px;
      width: 25px;
      height: 25px;
      border-radius: 4px;
      color: #fff;
      text-align: center;
      line-height: 22px;
      font-size: 20px;
      opacity: 0.7;
      cursor: pointer;
      background-color: black;
    z-index: 10;
      &:hover{
        opacity: 1;
      }
    }
  }
  .fail{
    background-color: #f15d6930;
  }
  .ref-btn{
    width: 100%;
    border-radius: 4px;
    border: 1px dashed #8c8c8c;
    float: left;
    margin-bottom: 20px;
    padding-top: 10px;
    padding-bottom: 5px;
    height: 190px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .btn-plus{
    width: 100%;
    height: 190px;
    border-radius: 4px;
    color: black;
    text-align: center;
    line-height: 160px;
    font-size: 100px;
    opacity: 0.7;
    cursor: pointer;
    &:hover{
      opacity: 1;
    }
  }
</style>
