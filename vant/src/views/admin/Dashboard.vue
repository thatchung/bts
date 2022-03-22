<template>
  <div>
    <div class="map-container">
      <GmapMap
        :center="{lat:10, lng:10}"
        :zoom="7"
        map-type-id="terrain"
        style="width: 500px; height: 300px"
      >
        <!-- <GmapMarker
          :key="index"
          v-for="(m, index) in markers"
          :position="m.position"
          :clickable="true"
          :draggable="true"
        /> -->
      </GmapMap>
    </div>
  </div>
</template>
<script>

export default {
  name: 'Dashboard',
  // components: {
  //   MglMap
  // },
  data () {
    return {
      loading: false,
      loadingBt: false
    }
  },
  methods: {
    edit (query) {}
  },

  mounted () {

  }
}
</script>
<style lang='less' scoped>
</style>
