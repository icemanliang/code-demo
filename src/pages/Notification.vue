<!-- eslint-disable max-len -->
<template>
  <div class="notification">
    <setting-card v-if="pEnable['enablecarNotifications'] && pEnable['enablecarNotifications'].visible" :fold="!pEnable['enablecarNotifications'].value" :disabled="!canEditSetting">
      <setting-card-header
        slot="header"
        :icon="require('../assets/svg/car.svg')"
        :disabled="!pEnable['enablecarNotifications'].value"
        :title="$mt('label_noti_settings_car_noti')"
        :subtitle="$mt('setting_desc_car')">
        <xo-button
          v-if="canEditSetting"
          class="header-btn"
          @click="updateNotificationSettings({ command: 'enablecarNotifications', value: !pEnable['enablecarNotifications'].value })">
          {{ pEnable['enablecarNotifications'].value ? $mt('btn_disable_car') : $mt('btn_enable_car') }}
        </xo-button>
      </setting-card-header>

      <setting-card-row
        v-if="pEnable['enabletableUpdatescar'].visible"
        :icon="require('../assets/svg/table.svg')"
        :title="$mt('label_car_noti_settings_table_updates')"
        :checked="pEnable['enabletableUpdatescar'].value"
        command="enabletableUpdatescar"
        @operations-handle="updateNotificationSettings" />

      <setting-card-row
        v-if="pEnable['enableNewsletter'].visible"
        :icon="require('../assets/svg/newsletter.svg')"
        :title="$mt('label_car_noti_promo')"
        :checked="pEnable['enableNewsletter'].value"
        command="enableNewsletter"
        @operations-handle="updateNotificationSettings" />

      <setting-card-row
        v-if="pEnable['enableListingUpdates'].visible"
        :icon="require('../assets/svg/newspaper.svg')"
        :title="$mt('label_car_noti_settings_listing')"
        :checked="pEnable['enableListingUpdates'].value"
        command="enableListingUpdates"
        @operations-handle="updateNotificationSettings" />

      <setting-card-row
        v-if="pEnable['enablePersonalisedContent'].visible"
        :icon="require('../assets/svg/user.svg')"
        :title="$mt('label_car_noti_settings_personal')"
        :checked="pEnable['enablePersonalisedContent'].value"
        command="enablePersonalisedContent"
        @operations-handle="updateNotificationSettings" />
    </setting-card>
  </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any, no-shadow */
import { Component, Vue, Prop } from 'vue-property-decorator';
import { SeCar } from 'common-components';
import { notiService, NotificationSettingResponse } from 'quick-modules';
import { AppRequest as request } from 'framework';

@Component({
  components: {
    SeCar: SeCar.default,
    SeCarHeader: SeCar.header,
    SeCarRow: SeCar.row,
  },
})
export default class NotificationSetting extends Vue {
  @Prop() private canEditSetting: boolean;
  private notificationState: NotificationSettingResponse = {} as NotificationSettingResponse;
  private pnOption = {} as { [key: string]: { [key: string]: boolean | any } };
  private pEnable = { ...this.pnOption };

  private async updateNotificationSettings({ command, value }: { command: string, value: boolean }) {
    this.$set(this.pEnable[command], 'value', value);
    try {
      const { error } = await notiService.updateNotificationSetting({ [command]: value });
      if (!error) {
        this.$set(this.pnOption[command], 'value', value);
        this.$user.$reload();
      } else {
        this.pEnable[command] = { ...this.pnOption[command] };
      }
    } catch (e) {
      this.pEnable[command] = { ...this.pnOption[command] };
    }
  }

  private async created() {
    try {
      const { data } = await notiService.getNotificationSetting();
      if (data && request.isRight) {
        this.notificationState = data;
        Object.keys(this.notificationState).forEach((key: string) => {
          const subModuleObj = { ...(this.notificationState as any)[key].subModuleObj };
          const { visible, value } = (this.notificationState as any)[key];
          this.pnOption[key] = { visible, value };
          Object.keys(subModuleObj).forEach((key: string) => {
            this.pnOption[key] = subModuleObj[key];
          });
        });
        this.pEnable = JSON.parse(JSON.stringify(this.pnOption));
      }
    } catch (error) {}
  }
}
</script>

<style scoped lang="scss">
.header-btn {
  font-weight: 500;
}

</style>
