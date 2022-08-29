<template>
  <ul class="qm-scroll-bar">
    <li v-for="(item, index) in list" :key="item.value + item.label" :class="{
      'qm-active': activeIndex === index}" @click="jump(item.value, index)">{{$t(item.label)}}</li>
  </ul>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
interface ScrollItem {
  label: string;
  value: string; // 在外部需将每个滚动的content 给id给绑上value，value 必须确保唯一性
}
interface DOMHeight {
  top: number,
  height: number,
  bottom: number
}
@Component({})
export default class Index extends Vue {
  @Prop({type: Array}) list: ScrollItem[];
  @Prop() scrollingElement: HTMLElement;
  private domHeightList: DOMHeight[] = [];
  private activeIndex: number = 0;

  @Watch('list')
  onScrollListChange(cur: ScrollItem[]) {
    if (Array.isArray(cur) && cur.length > 0) {
      const domHeightList: DOMHeight[] = [];
      this.$nextTick(() => {
          cur.forEach(item => {
          const dom = document.getElementById(item.value as string);
          if (dom) {
            domHeightList.push({
              top: dom.offsetTop,
              height: dom.clientHeight,
              bottom: dom.offsetTop + dom.clientHeight
            });
          }
        });
        this.domHeightList = domHeightList;
      });

    }
  }

  jump(value: string, index: number) {
    this.$emit('jump', value, index);
  }

  onScreenScroll() {
    let activeIndex = 0;
    const scrollElememntTop = this.scrollingElement.scrollTop;
    this.domHeightList.some((item, index) => {
      if (scrollElememntTop < item.top) {
        activeIndex = index ? index -1 : index; 
        return true;
      } else {
        return false;
      }
    });
    if (scrollElememntTop === this.scrollingElement.scrollHeight - this.scrollingElement.clientHeight) {
      activeIndex = this.domHeightList.length - 1;
    }
    this.activeIndex = activeIndex;
  }

  mounted() {
    window.addEventListener('scroll', this.onScreenScroll);
  }

}
</script>

<style lang="scss" scoped>
  .qm-scroll-bar {
    border-left: 2px solid #dbdbdb;
    li {
      padding: 0 24px;
      margin-bottom: 14px;
      color: #222;
      line-height: 16px;
      cursor: pointer;
      &.qm-active {
        color: #ee4d2d;
        font-weight: 500px;
        position: relative;
        &:before {
          content: " ";
          position: absolute;
          left: -2px;
          top: 0;
          width: 2px;
          height: 16px;
          background: #ee4d2d;
        }
      }
      &:last-child {
        margin:0;
      }
    }
  }
</style>