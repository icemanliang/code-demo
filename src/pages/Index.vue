<template>
  <div class="bs">
    <div>
      <p>djiwdiwdjiwji</p>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

// @ts-ignore
import { app } from 'framework';

const Storagekey = 'icemlcomeFlag';

@Component
export default class IndexPage extends Vue {
  dialogVisible: boolean = false;
  closeDialog() {
    this.dialogVisible = false;
  }
  created() {
    const readedWelcome = app.localStorage.get(Storagekey);
    if (!readedWelcome) {
      this.dialogVisible = true;
      app.localStorage.set(Storagekey, 'readed');
    }
  }
}
</script>

<style lang="scss" scoped>
.bs {
  padding-top: $header-height;
  &-s-info {
    margin-top: 20px;
    width: 100px;
  }

}
</style>
