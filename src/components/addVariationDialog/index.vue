<template>
  <wp-modal class="mp-add-variations-dialog" :visible="addDialogVisible"
                :title="$kh('nominateSelectVariations')" :width="846" @cancel="closeDialog"
  >
    <section slot="content" class="add-variations-body">
      <wp-tabs v-model="activeTab">
        <wp-tab-pane :label="$kh('nominateTabSelect')" name="select">
          <div class="search-select">
            <div class="search-form">
              <wp-cascader :options="kindTree" :popper-class="`mp-kind-cascader`"
                               v-model="searchForm.kind_ids" @change="changekind" :clearable="canClearkind"
              />
              <wp-input-group :prepend-width="160">
                <wp-select slot="prepend" v-model="searchForm.field" :placeholder="$kh('commonSelectPlaceholder')">
                  <wp-option v-for="item in productOptions" :key="item.field" :value="item.field">{{item.label}}</wp-option>
                </wp-select>
                <wp-input clearable slot="append" v-model="searchForm.value" @keyup.enter.native="searchProduct">
                </wp-input>
              </wp-input-group>
            </div>
            <div class="status-filter">
              <wp-checkbox @change="searchProduct" v-model="searchForm.available_only">{{$kh('nominateShowAvailable')}}</wp-checkbox>
              <wp-popover :content="availableOnlyTip" trigger="hover">
              </wp-popover>
            </div>
            <wp-table class="add-variation-table" :row-class-name="getRowClassName" :data="currentList" :height="300"
                          :loading="loading" :empty-text="$kh('commonNoVariation')" valign="middle"
            >
              <wp-table-column label=" " :width="40">
                <template slot-scope="props">
                  <span v-if="props.row.kyList && props.row.kyList.length" class="expand-cell" @click="switchItemExpand(props.row)">
                  </span>
                </template>
              </wp-table-column>
              <wp-table-column :width="32">
                <template slot="header" slot-scope="header">
                  <wp-checkbox class="header-checkbox" @change="selectAllChange" :acturalValue="hasSelect"
                                   :indeterminate="isPartSelect"
                  />
                </template>
                <template slot-scope="props">
                  <wp-checkbox @change="selectRows([props.row, ...props.row.kyList || []], !getCheckValue(props.row))" :acturalValue="getCheckValue(props.row)"
                                   :indeterminate="getCheckStatus(props.row)"
                  />
                </template>
              </wp-table-column>
              <wp-table-column :width="300" :label="$kh('nominateVariations')">
                <template slot-scope="props">
                  <div class="item-info-name" v-if="!props.row.isChild">
                    <img :src="props.row.itemImage" class="item-image-info">
                    <span>{{props.row.itemName}}</span>
                  </div>
                  <span v-else>{{props.row.modelName}}</span>
                </template>
              </wp-table-column>
              <slot />
              <mp-loading v-if="loading" slot="loading" />
            </wp-table>
            <wp-pagination class="bottom-pagination" v-if="pager.total" :total="pager.total"
                               :current="pager.page_no"
                               :page-size="pager.count"
                               @page-change="onPageChange"
            />
          </div>
        </wp-tab-pane>
        <wp-tab-pane :label="$kh('nominateBatchUpload')" name="batch">
          <batch-upload @addVariations="addBatchVariations" v-if="activeTab === 'batch'" :batchConfig="batchConfig"
                        @downloadTemplate="downloadTemplate"
          />
        </wp-tab-pane>
      </wp-tabs>

    </section>
    <section v-if="activeTab === 'select'" slot="footer">
      <section class="right-action-btn">
        <wp-button @click="closeDialog">{{$kh('commonCancel')}}</wp-button>
        <wp-button :disabled="!selectedList.length" @click="addVariations" type="primary">{{$kh('commonNext')}}</wp-button>
      </section>
    </section>
    <section v-else slot="footer" />
  </wp-modal>
</template>

<script lang="ts">
import { State, namespace } from 'vuex-class';
import { Component, Vue, Prop, Watch, Emit } from 'vue-property-decorator';
import { environment } from 'framework';

const ProductState = namespace('productsStore');
const defaultSearchForm = {
  kind_ids: [''],
  itemIds: [],
  field: 'item_names',
  value: '',
  available_only: true,
};

const defaultPager = {
  count: 20,
  page_no: 1,
  total: 0,
};

interface Pager {
  count: number,
  page_no: number,
  total: number
}

interface BatchConfig {
  actionUrl: string;
  errorField: string;
  listField: string;
  actionData?: any;
  isky?: boolean;
}

@Component
export default class AddVariationDialog extends Vue {
  @Prop(Boolean) dialogVisible: boolean;
  @Prop(Array) productOptions: any[];
  @Prop(Object) pager: Pager;
  @Prop(Array) itemList: any[];
  @Prop(Boolean) loading: boolean;
  @Prop(String) defaultField: string;
  @Prop(String) availableOnlyTip: string;
  @Prop(Object) batchConfig: BatchConfig;

  addDialogVisible: boolean = false;
  searchForm = defaultSearchForm;
  hasSelect: boolean = false;
  expandList: string[] = [];
  kyList: any[] = [];
  selectedList: string[] = [];
  selectedRows: any[] = [];
  activeTab: string = '';
  kindTree: any[] = [{ label: this.$kh('addAllCategories'), value: '' }];
  @Emit('close')
  closeDialog() {
    this.addDialogVisible = false;
  }

  openDialog() {
    this.addDialogVisible = true;
  }

  addVariations() {
    this.$emit('addVariation', this.selectedRows, 'select');
    this.$emit('close');
  }

  addBatchVariations(kyList) {
    this.$emit('addVariation', kyList, 'batch');
    this.$emit('close');
  }

  getRowClassName(row) {
    return (row.kyList && row.kyList.length) ? 'item-row' : 'ky-row';
  }

  selectAllChange(value) {
    this.selectRows(value ? this.kyList : []);
  }

  getCheckValue(row) {
    const selectedList = this.selectedList;
    if (row.kyList && row.kyList.length) {
      return row.kyList.some(item => selectedList.includes(item.kyId || item.itemId));
    } else {
      return selectedList.includes(row.kyId || row.itemId);
    }
  }

  getCheckStatus(row) {
    const selectedList = this.selectedList;
    if (row.kyList && row.kyList.length) {
      const filterList = row.kyList.filter(item => selectedList.includes(item.kyId || item.itemId));
      return !!filterList.length && filterList.length !== row.kyList.length;
    } else {
      return false;
    }
  }

  selectRows(list, value?) {
    const rows = list.map(item => item.kyId || item.itemId);
    const set = new Set(this.selectedList);
    if (value !== undefined) {
      if (value === true) {
        list.forEach(item => {
          set.add(item.kyId || item.itemId);
        });
      } else {
        list.forEach(item => {
          set.delete(item.kyId || item.itemId);
          const selectedIndex = this.selectedRows.findIndex(ky =>
            (ky.kyId || ky.itemId) === (item.kyId || item.itemId));
          if (selectedIndex > -1) {
            this.selectedRows.splice(selectedIndex, 1);
          }
        });
      }
      set.delete((list[0] || {}).itemId);
    } else {
      this.kyList.forEach(item => {
        if (rows.includes(item.kyId || item.itemId) && !item.kyList) {
          set.add(item.kyId || item.itemId);
        } else {
          set.delete(item.kyId || item.itemId);
          const selectedIndex = this.selectedRows.findIndex(ky =>
            (ky.kyId || ky.itemId) === (item.kyId || item.itemId));
          if (selectedIndex > -1) {
            this.selectedRows.splice(selectedIndex, 1);
          }
        }
      });
    }
    this.selectedList = [...set];
    const selectedRows = this.selectedRows;
    const currentSelectedRows = this.kyList.filter(item => set.has(item.kyId || item.itemId));
    this.selectedRows = selectedRows.concat(currentSelectedRows.filter(row => !selectedRows.find(item => {
      return (row.kyId || row.itemId) === (item.kyId || item.itemId);
    })));
    this.hasSelect = !!currentSelectedRows.length;
  }

  changekind(value) {
    if (value.length === 0) {
      this.searchForm.kind_ids = [''];
    }
    this.searchProduct();
  }

  switchItemExpand(row) {
    const set = new Set(this.expandList);
    if (set.has(row.itemId)) {
      set.delete(row.itemId);
    } else {
      set.add(row.itemId);
    }
    this.expandList = [...set];
  }

  searchProduct() {
    this.$emit('getAddDialogProducts', {
      page_no: 1,
      form: this.searchForm,
    });
  }

  onPageChange(page) {
    this.$emit('getAddDialogProducts', {
      page_no: page,
      form: this.searchForm,
    });
  }

  get canClearkind() {
    return !!this.searchForm.kind_ids.filter(item => item !== '').length;
  }

  get currentList() {
    const list = this.expandList;
    return this.kyList.filter(item => item.kyList || list.includes(item.itemId));
  }

  get isPartSelect() {
    const selectedList = this.selectedList || [];
    const filterList = this.kyList.filter(item => selectedList.includes(item.kyId || item.itemId));
    return !!filterList.length && filterList.length !== (this.kyList.filter(ky => !ky.kyList).length);
  }

  @Watch('dialogVisible', { immediate: true })
  onDialogVisibleChange(visible: boolean) {
    this.addDialogVisible = visible;
    if (visible) {
      this.searchForm = { ...defaultSearchForm, field: this.defaultField };
      this.hasSelect = false;
      this.expandList = [];
      this.kyList = [];
      this.selectedList = [];
      this.selectedRows = [];
      this.activeTab = 'select';
      const newArr:any = [];
      this.searchProduct();

      if (!this.kindTree.filter(item => !!item.value).length) {
        const arr = [];
        this.kindTree = [{ label: this.$kh('addAllCategories'), value: '' }, ...arr];
      }
    }
  }

  @Watch('searchForm.value')
  onValueChange(nv: boolean) {
    if (!nv) {
      this.searchProduct();
    }
  }

  @Watch('itemList', { immediate: true, deep: true })
  onItemListChange() {
    const kyList:any[] = [];
    this.itemList.forEach(item => kyList.push(item, ...(item.kyList || []).map(ky => ({
      ...ky,
      isChild: true,
      itemId: item.itemId,
      itemName: item.itemName,
      itemImage: item.itemImage,
    }))));
    this.kyList = kyList.map((item, index) => {
      return {
        ...item,
        barcode: item.barcode || '',
      };
    });

    this.expandList = this.itemList.filter(item => !item.kyList).map(item => item.itemId);
    this.hasSelect = kyList.some(item => this.selectedList.includes(item.kyId || item.itemId));
  }

  downloadTemplate() {
    this.$emit('downloadTemplate');
  }
}
</script>

<style lang="scss" scoped>
  .add-variations-body {
    overflow: hidden;
  }
  .search-form {
    width: 100%;
    height: 32px;
    display: flex;
    .wp-cascader {
      width: 209px;
      margin-right: 26px;
    }
    .wp-input-group {
      flex: 1;
      .wp-select {
        width: 160px;
      }
    }
  }
  .status-filter {
    display: flex;
    height: 16px;
    font-size: 12px;
    color: #333333;
    margin: 16px 0;
    align-items: center;
    justify-content: flex-end;
  }
  .expand-cell {
    display: inline-block;
    height: 16px;
  }
  .item-info-name {
    display: flex;
    align-items: center;
    font-size: 14px;
    line-height: 16px;
    color: #999;
    .item-image-info {
      display: inline-block;
      width: 32px;
      height: 32px;
      margin-right: 8px;
    }
  }
  .item-id-info {
    font-size: 12px;
    color: #888888;
  }
  .bottom-pagination {
    display: flex;
    justify-content: flex-end;
    margin-top: 24px;
  }
  .right-action-btn {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    .tips {
      font-size: 12px;
      color: #999999;
    }
    .wp-button {
      margin-left: 16px;
    }
  }
  .empty-wrapper {
    height: 282px;
  }

  .popover-icon {
    width: 16px;
    height: 16px;
    margin-left: 8px;
    vertical-align: middle;
    font-size: 16px;
    color: #999999;
  }
</style>

<style lang="scss">
  .mp-add-variations-dialog {
    .wp-modal__body {
      max-height: 504px;
      padding: 0 30px;
      box-shadow: none;
      .wp-tabs-line .wp-tabs__nav-tab {
        padding-bottom: 10px;
        height: 46px;
      }
      .add-variation-table .wp-table__body {
        border-collapse: collapse;
      }

      .add-variation-table {
        border-collapse: initial;
      }
      .add-variations-body .wp-table__row .wp-table__cell {
        align-items: center;
        width: 100%;
        display: flex;
        line-height: unset;
        word-break: break-word;
        overflow-x: hidden;
        padding-bottom: 12px;
        padding-top: 12px;
      }
      .add-variations-body .item-row {
        background: #fff;
        .wp-table__cell {
          padding-bottom: 7px;
          padding-top: 7px;
        }
      }
      .add-variations-body .ky-row {
        background: #FAFAFA;
        td {
          border-top: 1px solid #eeeeee;
          &.is-first, &.is-last {
            border-color: transparent;
          }
        }
        &:nth-of-type(1) {
          td {
            border-color: transparent;
          }
        }
      }
      .wp-table tbody tr td {
        border-color: transparent;
      }
    }
    .wp-modal__header {
      padding-bottom: 20px;
    }
    .search-form .wp-input-group .wp-input__suffix {
      max-width: 40px;
      padding-left: 0;
      cursor: pointer;
      .search-icon {
        width: 16px;
        height: 16px;
        margin-left: 8px;
      }
    }
  }
</style>
