<!-- eslint-disable max-len -->
<template>
  <div class="information">
    <div v-if="showCar.value.oldcarInfo.status === carStatus.Rejected" class="card reason">
      <div class="grid">
        <div class="label text-r">
          {{ $ice('reject_reason') }}
        </div>
        <div class="des">
          {{ showCar.value.oldcarInfo.rejectReason }}
        </div>
      </div>
    </div>
    <div v-if="unCar" class="save">
      <xo-button type="primary" :disabled="disabledSave" @click="save">
        {{ $ice('bt_save') }}
      </xo-button>
    </div>
    <div v-if="!addDisabled" class="add" @click="add">
      <div>{{ $ice('add_ic_card_information') }}</div>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Watch } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { carStatus, BaResponse } from 'quick-modules';
import APP, { userInfo } from 'framework';

const ADD_CARD ='m2'; 
const PUT_OR_CARS ='m3';
const GET_ACCOUNT_SETTINGS ='m4';

const AccountSettingModule = namespace('account-settings');
@Component
export default class Ba extends Vue {
  @AccountSettingModule.State('showCar')
  private showCar: {
    visible: boolean,
    editable: boolean,
    showDetail: boolean,
    value: {
      carInfo: BaResponse,
      oldcarInfo: BaResponse,
      isSaving: boolean,
      isDeleting: boolean
    }
  };

  @AccountSettingModule.Action(GET_ACCOUNT_SETTINGS)
  private getAccountSettings: () => void;

  @AccountSettingModule.Action(ADD_CARD)
  private addCard: () => void;

  @AccountSettingModule.Action(PUT_OR_CARS)
  private saveCards: () => void;

  private carStatus = carStatus;
  private isEdit: boolean[] = [];
  private unCar: boolean = false;

  /**
   * 是否Disabled添加按钮
   */
  get addDisabled(): boolean {
    let disabled = false;
    if (
      this.showCar.value.carInfo
      && this.showCar.value.carInfo.status === carStatus.Pending
    ) {
      disabled = true;
    }
    if (this.showCar.value.carInfo && this.showCar.value.carInfo.icInfo && this.showCar.value.carInfo.icInfo.length >= 3) {
      disabled = true;
    }
    return disabled;
  }

  get getUserName(): string {
    return userInfo.name;
  }

  private showEdit(index: number) {
    return this.isEdit[index];
  }

  /**
   * 新增
   */
  private add() {
    this.addCard();
    this.isEdit.push(true);
  }

  private editCard(index: number) {
    this.$set(this.isEdit, index, true);
  }

  private deleteUnSaveCard(index: number) {
    this.isEdit.splice(index, 1);
  }

  private deleteCard(index: number) {
    for (let i = 0; i < this.isEdit.length; i++) {
      this.$set(this.isEdit, i, false);
    }
  }

  private mounted() {
    if (!this.showCar.value.carInfo.icInfo.length) {
      this.add();
    } else {
      for (let i = 0; i < this.showCar.value.carInfo.icInfo.length; i++) {
        this.isEdit.push(false);
      }
    }
  }

  get disabledSave(): boolean {
    let disabled = false;
    this.showCar.value.carInfo.icInfo.forEach(card => {
      if (card.name === '' || card.cardNo === null || card.image === '') {
        disabled = true;
      }
    });
    if (this.showCar.value.carInfo && this.showCar.value.carInfo.status === carStatus.Pending) {
      disabled = true;
    }

    if (this.showCar.value.isSaving || this.showCar.value.isDeleting) {
      disabled = true;
    }
    return disabled;
  }

  private async save() {
    await this.saveCards();
    for (let i = 0; i < this.showCar.value.carInfo.icInfo.length; i++) {
      this.$set(this.isEdit, i, false);
    }
  }

  private confinrmCancel() {
    this.$confirm({
      title: this.$ice('leave_current_page'),
      confirmText: this.$ice('confirm'),
      cancelText: this.$ice('bt_cancel'),
      content: this.$ice('leave_current_page_confirm'),
      onConfirm(instance) {
        return new Promise(resolve => {
          resolve();
        });
      },
    }).then(async () => {
      this.$emit('closeCar');
    });
  }

  private async cancel() {
    if (this.unCar) {
      await this.confinrmCancel();
      return;
    }
    this.$emit('closeCar');
  }

  @Watch('isEdit', { deep: true })
  private update() {
    const { length } = this.isEdit.filter(element => element === true);
    this.unCar = !!length;
  }
}
</script>

<style scoped lang="scss">
.information {
  margin: -16px;
}

.card > div {
  padding: 16px;
}

.card:not(:first-child) > div {
  border-top: 1px dashed #e8e8e8;
}

.add {
  width: 100%;
  height: 64px;
  color: #2673dd;
  display: flex;
  border-top: 1px solid #e8e8e8;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  /deep/ svg {
    fill: #2673dd;
    width: 20px;
    height: 20px;
    margin-right: 11px;
  }
}

/deep/ .xo-tooltip {
  width: 100%;
}
/deep/ .xo-popover__ref {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.save {
  margin-left: 232px;
  margin-bottom: 24px;
  margin-top: 6px;
}
.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

.reject {
  background: rgba(255, 71, 66, 0.04);
}
.reason {
  background: rgba(255, 71, 66, 0.1);
  .label {
    color: #f84540;
    font-weight: $bold;
  }
  .des {
    color: #f84540;
  }
}
.text-r {
  text-align: right;
}
.edit {
  margin-right: 16px;
}
.des {
  font-size: 14px;
  color: #555555;
  letter-spacing: 0;
}
.label {
  width: 160px;
  font-size: 14px;
  color: #333333;
  letter-spacing: 0;
  margin-right: 16px;
}
</style>
