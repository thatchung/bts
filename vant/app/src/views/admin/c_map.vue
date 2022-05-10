<template>
  <div>
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
  </div>
</template>

<script>
export default {
  name: 'Map',
  props: {
    markers: {
      type: Array,
      default: () => { return [] }
    }
  },
  data () {
    return {
      center: { lat: 10.7776261, lng: 106.6930872 },
      showByIndex: null,
      statistic: {
        total_bts: 0,
        total_action: 0,
        total_disconection: 0
      }
    }
  }
}
</script>

<style lang="less" scoped>

</style>
