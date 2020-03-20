<template>
  <div>
    <audio src="/static/audio/newgoods.1.mp3"  :id="music" hidden></audio>
  </div>
</template>
<script>
import audio from 'djaudio'
export default {
  data () {
    return {
      music:null
    }
  },
  created () {
    
  },
  methods: {

  }
}

</script>


