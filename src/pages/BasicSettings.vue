<template>
  <div class="page">
    <div class="header">
      <div class="title">
        {{ $tr('title_sp_set') }}
      </div>
      <div class="desc">
        {{ $tr('b_basic_set_desc') }}
      </div>
    </div>
    <bn-tabs ref="tabs" :value="tab" @tab-click="handleClick">
      <bn-tab-pane :label="$tr('m_bic_settings')" name="sp" />
      <bn-tab-pane :label="$tr('m_pri_settings')" name="privacy" />
      <bn-tab-pane name="chat">
        <span id="bic-setings-tab-chat" slot="label">{{ $tr('m_chat_set') }}</span>
      </bn-tab-pane>
      <bn-tab-pane :label="$tr('m_notif_settings')" name="notification" />
      <bn-tab-pane v-if="showSipTab" name="sip">
        <span id="bic-setings-tab-sip" slot="label">{{ $tr('m_sip_set') }}</span>
      </bn-tab-pane>
    </bn-tabs>
    <router-view :can-edit-setting="canEditSetting" />

    <div v-if="showskp" class="onrnp">
      <div class="onrnp-content" :style="currentskp.position">
        <div class="onrnp-target">
          <div class="onrnp-target-text">
            {{ currentskp.text }}
          </div>
          <bn-icon class="onrnp-arrow" svg="../assets/svg/onrnp-arrow.svg" />
        </div>
        <div class="onrnp-tips" :style="currentskp.tipsStyle">
          <div
            class="onrnp-tips-title">
            {{ current+1 }}. {{ currentskp.title }} ({{ current+1 }}/{{ skps.length }})
          </div>
          <div class="onrnp-tips-content">
            {{ currentskp.content }}
          </div>
          <div class="onrnp-tips-buttons">
            <bn-button
              v-if="current !== 0"
              class="onrnp-tips-button"
              type="link"
              @click="current--">
              {{ $tr('b_btn_back') }}
            </bn-button>
            <span style="flex: 1"></span>
            <bn-button
              class="onrnp-tips-button"
              style="margin-right: 24px"
              type="link"
              @click="hideskp">
              {{ $tr('b_skip') }}
            </bn-button>
            <bn-button
              type="primary"
              @click="showNextskp">
              {{ current === skps.length - 1 ? $tr('b_i_know_it') : $tr('b_next') }}
            </bn-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { app } from 'framework';

const onrnpStorageKey = 'basicSettingsskp';

export interface skp {
  target: string;
  title: string;
  content: string;
}

@Component
export default class Index extends Vue {
  private current = 0;
  private showskp = false;

  private get skps() {
    const skps: skp[] = [];
    skps.push({
      target: 'chat',
      title: this.$tr('m_chat_settings'),
      content: this.$tr('b_skp_chat_sett'),
    });
    return skps;
  }

  private get showSipTab() {
    return this.$food.ismary && this.$food.cbOption;
  }

  private get currentskp() {
    const skp = this.skps[this.current];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const node: HTMLElement = (this.$refs.tabs as any).$refs.nav.querySelector(`#basic-setings-tab-${skp.target}`).parentElement;
    const rect = node.getBoundingClientRect();

    return {
      ...skp,
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
    return this.$acl.data('food_setting_edit_setting');
  }

  private hideskp() {
    this.showskp = false;
    app.localStorage.set(onrnpStorageKey, false);
  }

  private showNextskp() {
    if (this.current === this.skps.length - 1) {
      this.hideskp();
    } else {
      this.current += 1;
    }
  }

  private handleClick(tab: string) {
    this.$router.push(`/portal/settings/basic/${tab}`);
  }

  private mounted() {
    const show = app.localStorage.get(onrnpStorageKey);
    const showskp = show === null ? true : show;
    setTimeout(() => {
      this.showskp = showskp;
    }, 1000);
  }

  private beforeDestroy() {
    const mm = app.localStorage.get(onrnpStorageKey);
  }
}
</script>

<style lang="scss" scoped>
.page {
  background-color: #fff;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.12);
  border-radius: 2px;
  margin-top: 16px;

  /deep/ .bn-tabs-top .bn-tabs__nav {
    margin-bottom: 0;
  }

  /deep/ .bn-tabs__nav-tabs,
  /deep/ .bn-tabs__ink-bar {
    margin-left: 24px;
  }
}

.header {
  padding: 24px 24px 8px;
}

.title {
  font-size: 22px;
  color: $trext-primary;
  font-weight: $bold;
  margin-bottom: 6px;
}

.desc {
  font-size: 14px;
  color: $trext-light;
  line-height: 16px;
}

.onrnp {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 99901;

  &-content {
    position: absolute;
  }

  &-target {
    display: flex;
    flex-direction: row;
    align-items: flex-start;

    &-text {
      padding: 20px 16px;
      font-size: 14px;
      line-height: 16px;
      background-color: #fff;
      border-radius: 4px;
    }
  }

  &-arrow {
    color: #fff;
    width: 62px;
    height: 62px;
    margin-left: 8px;
  }

  &-tips {
    width: 360px;
    color: #fff;
    margin-top: 8px;

    &-title {
      font-size: 16px;
      font-weight: 500;
      line-height: 18px;
    }

    &-content {
      font-size: 14px;
      line-height: 18px;
      margin-top: 8px;
    }

    &-buttons {
      display: flex;
      flex: 1;
      margin-top: 16px;
    }

    &-button {
      color: rgba(255, 255, 255, 0.5);
    }
  }
}
</style>
