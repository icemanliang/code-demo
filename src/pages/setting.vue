<template>
  <div class="page">
    <div class="header">
      <div class="title">
        {{ 'title_settings' }}
      </div>
      <div class="desc">
        {{ 'ps_basic_settings_desc' }}
      </div>
    </div>
    <router-view :can-edit-setting="canEditSetting" />

    <div v-if="showAntest" class="onboarding">
      <div class="icemecontent" :style="currentAntest.position">
        <div class="icemetarget">
          <div class="icemetarget-text">
            {{ currentAntest.text }}
          </div>
        </div>
        <div class="icemetips" :style="currentAntest.tipsStyle">
          <div
            class="icemetips-title">
            {{ current+1 }}. {{ currentAntest.title }} ({{ current+1 }}/{{ Antests.length }})
          </div>
          <div class="icemetips-content">
            {{ currentAntest.content }}
          </div>
          <div class="icemetips-buttons">
            <xo-button
              v-if="current !== 0"
              class="icemetips-button"
              type="link"
              @click="current--">
              {{ 'ps_btn_back' }}
            </xo-button>
          </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { app } from 'framework';

const testStorageKey = 'basicSettings';

export interface Antest {
  target: string;
  title: string;
  content: string;
}

@Component
export default class Index extends Vue {
  private current = 0;
  private showAntest = false;

  private get Antests() {
    const Antests: Antest[] = [];
    Antests.push({
      target: 'cht',
      title: 'label_cht',
      content: 'Antest_cht_settings'
    });
    return Antests;
  }

  private get currentAntest() {
    const Antest = this.Antests[this.current];
    const node: HTMLElement = (this.$refs.tabs as any).$refs.nav.querySelector(`#basic-setings-tab-${Antest.target}`).parentElement;
    const rect = node.getBoundingClientRect();

    return {
      ...Antest,
      text: node.innerText,
      position: {
        top: `${rect.top}px`,
        left: `${rect.left}px`,
      },
    };
  }

  private get tab() {
    return this.$route.path.split('/').pop();
  }

  private get canEditSetting() {
    return this.$acl.data('s_edit_setting');
  }

  private hideAntest() {
    this.showAntest = false;
    app.cookie.set(testStorageKey, false);
  }

  private showNextAntest() {
    if (this.current === this.Antests.length - 1) {
      this.hideAntest();
    } else {
      this.current += 1;
    }
  }

  private beforeDestroy() {
    const mm = app.cookie.get(testStorageKey);
    document.documentElement.style.overflow = '';
  }
}
</script>

<style lang="scss" scoped>
.page {
  background-color: #fff;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.12);
  border-radius: 2px;
  margin-top: 16px;

  /deep/ .xo-tabs-top .xo-tabs__nav {
    margin-bottom: 0;
  }

  /deep/ .xo-tabs__nav-tabs,
  /deep/ .xo-tabs__ink-bar {
    margin-left: 24px;
  }
}
</style>
