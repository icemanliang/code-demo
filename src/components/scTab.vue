<template>
  <div ref="tab" class="sc-universal-tab">
    <br-tabs v-model="activeTab" @tab-click="tabClick" :class="{'br-tab-fixed': isFixed && isSticky}">
      <br-tab-pane v-for="tab in tabList" :key="tab.value" :name="`${tab.value}`">
        <div slot="label" class="approved-tab">
          <span>{{ $t(tab.label) }}</span>
          <br-icon v-if="alertList.includes(tab.value)" :svg="noticeCircleSIcon" class="size-16-icon tip-icon"></br-icon>
        </div>
      </br-tab-pane>
    </br-tabs>
  </div>
</template>

<script  lang="ts">
interface Option {
  label:string; // After Translation Label
  value:string;
}
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { ActivePage } from 'framework';

@Component({
  components: {}
})
export default class InventoryIndex extends Vue {// READ ME
  @Prop({type: Array, required: true}) tabList: Option[]; // Tab List
  @Prop({type:Array, default: []}) alertList: any[]; 
  @Prop({type: String, required: true}) value: string; 
  @Prop({type: Boolean, default: true}) isSticky: boolean; //是否吸顶，默认为true
  private tabEl:any = null;
  private timer:number = 0;

  scrollCallback() {
    this.isFixed  = this.tabEl.getBoundingClientRect().top <= 56;
  }
  @Watch('value', {immediate: true})
  onValueChange(value:string) {
    this.activeTab = value;
  }

  tabClick(value:any) {
    const page = new ActivePage();
    const tab = this.value;
    this.$emit('tabClick', value);
    if(tab !== value) {
      return page;
    }
  }
}
</script>

<style scoped lang="scss">
.sc-universal-tab{
  .tip-icon {
    color: #ee4d2d;
    margin-left: 2px;
    vertical-align: bottom;
  }
}
  
</style>

