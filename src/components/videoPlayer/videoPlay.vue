<template>
  <Modal
    :mask-closable="false"
    footer-hide
    @on-visible-change="onChange"
    width="800"
    :title="title"
    v-model="visible"
  >
    <video
      width="100%"
      autoplay
      muted
      poster="~@/assets/video/loader-thumb.jpg"
      ref="video"
    ></video>
  </Modal>
</template>

<script>
export default {
  props: ["url", "sub", "title", "show"],
  name: "videoPlay",
  data() {
    return {
      visible: this.show,
      type: "jmuxer"
    };
  },
  watch: {
    show() {
      this.visible = this.show;
      if (this.show) {
        this.render();
      }
    }
  },
  methods: {
    render() {
      if (this.url.indexOf(".m3u8") > -1) {
        this.type = "hls";
        this.hlsPlay();
      } else {
        this.type = "jmuxer";
        this.play(
          "wss://mobile.jxrqgs.com/jxrq/utils/rtsp2ws?stream=" +
            encodeURIComponent(this.url ? this.url : this.sub)
        );
      }
    },
    play(wsURL) {
      const jmuxer = (this.player = new JMuxer({
        node: this.$refs.video,
        mode: "video",
        debug: true
      }));

      const ws = (this.ws = new WebSocket(wsURL));
      ws.binaryType = "arraybuffer";

      ws.addEventListener(
        "message",
        function(event) {
          const data = this.parse(event.data);
          jmuxer.feed(data);
        }.bind(this)
      );
    },
    parse(data) {
      let input = new Uint8Array(data),
        dv = new DataView(input.buffer),
        duration,
        audioLength,
        video;

      duration = dv.getUint16(0, true);
      audioLength = dv.getUint16(2, true);
      video = input.subarray(audioLength + 4);

      return {
        video: video,
        duration: duration
      };
    },
    hlsPlay() {
      const video = this.$refs.video;
      const hls = (this.hlsPlayer = new Hls());
      hls.loadSource(process.env.VUE_APP_BOOT + this.url);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, function() {
        video.play();
      });
    },
    onChange(v) {
      if (!v) {
        if (this.type == "jmuxer") {
          this.ws.close();
          this.player.destroy();
        } else {
          this.hlsPlayer.destroy();
        }

        this.$emit("update:show", v);
      }
    }
  }
};
</script>

<style scoped></style>
