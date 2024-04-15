<template>
  <div class="table-filter-trigger-container" :class="{ 'popover-visible': searchFromPopoverVisible }">
    <el-popover placement="bottom" :append-to-body="true" v-model="searchFromPopoverVisible" trigger="click">
      <i class="el-icon-menu table-filter-trigger" slot="reference" />
      <div>
        <el-checkbox-group v-model="selectedColumns">
          <el-checkbox v-for="column in columns" :label="column.label" :key="column.label" :name="column.label"
            style="display: block;margin-right: 0;">
            {{ column.label }}
          </el-checkbox>
        </el-checkbox-group>
      </div>
    </el-popover>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'

const emit = defineEmits(['filter', 'requestLatestColumns'])

const searchFromPopoverVisible = ref(false)
const columns = ref([])
const selectedColumns = ref([])

watch(columns, (newVal, oldVal) => {
  const newAddItem = newVal.filter((item) => !oldVal.some((oldItem) => oldItem.label === item.label))
  selectedColumns.value = [
    ...selectedColumns.value.filter(i => newVal.some(n => n.label === i)), // 过滤掉之前选中但是新的表格中不存在的列
    ...newAddItem.map(i => i.label)
  ]
})

watch(selectedColumns, (newVal) => emit('filter', newVal))

watch(searchFromPopoverVisible, (newVal) => {
  // 每次打开时更新列数据到最新
  if (newVal) {
    emit('requestLatestColumns')
  }
})

defineExpose({
  columns,
})
</script>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'tableFilterBar'
})
</script>

<style lang="less" scoped>
.table-filter-trigger-container {
  display: none;
  position: absolute;
  right: 4px;
  top: 6px;
  cursor: pointer;
  z-index: 5; // fixed right 的列会挡住图标

  &.popover-visible {
    .table-filter-trigger {
      opacity: 1;
    }
  }

  .table-filter-trigger {
    font-size: 25px;
    color: #5cb6ff;
    opacity: 0;
    transition: all .2s;

    &:hover {
      opacity: 1 !important;
    }
  }
}
</style>