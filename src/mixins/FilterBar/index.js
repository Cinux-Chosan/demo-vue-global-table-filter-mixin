import Vue, { nextTick } from 'vue';
import { Table } from 'element-ui';
import FilterBar from './FilterBar.vue';
import './style.less';

const FilterBarComponent = Vue.extend(FilterBar);

Table.mixins?.push({
  watch: {
    // 通过 v-if 控制的动态增删列，当列发生改变时也需要立即应用过滤条件，否则出现增删之后会触发 el-table 内部的更新，导致所有列都展现出来
    'store.states.columns'() {
      this.filterColumn(this.mixinFilterBarData.filterColumns);
    },
    // 过滤条件发生变化时需要重新执行最新的过滤条件
    'mixinFilterBarData.filterColumns'(column) {
      this.filterColumn(column);
    }
  },
  data() {
    return {
      mixinFilterBarData: {
        filtering: false, // 是否正在执行过滤，过滤操作会更新 store.states.columns，防止递归触发 filterColumn
        filterColumns: null, // 需要被过滤的列
      },
    };
  },
  created() {
    this.mixinFilterBarInstance = null; // 存放 Filter 组件实例
  },
  async mounted() {
    // 创建一个图标元素，添加在 el-table 的右上角
    const icon = document.createElement('div');

    // 创建 Filter 组件
    const filterBar = new FilterBarComponent();
    this.mixinFilterBarInstance = filterBar;

    // 监听过滤事件
    filterBar.$on('filter', (column) => {
      this.mixinFilterBarData.filterColumns = [...column]
    });

    // 每当过滤组件打开时，获取最新的列数据（因为表格列可能动态发生变化，例如通过 v-if 控制了某些 column）
    filterBar.$on('requestLatestColumns', () => {
      this.mixinFilterBarInstance.columns = this.store.states._columns
        .filter((column) => !isFilterWhiteType(column.type))
        .map((col) => {
          return {
            ...col,
            label: resolveLabel(col), // 某些 column 可能没有设置 label，例如 type 为 index、selection 这种，这里需要处理一下，否则过滤组件内该项展示为空
          };
        });
    });

    if (this.$el) {
      // 添加组件到 el-table 内
      this.$el.appendChild(icon);

      // 用于样式控制，由于 el-table 内部动态控制样式，直接添加 class 会被冲掉，因此采用 data 来控制
      this.$el.dataset['hasFilterMixin'] = true;

      filterBar.$mount(icon);
    }
  },
  beforeDestroy() {
    this.mixinFilterBarInstance?.$destroy();
    this.mixinFilterBarInstance = this.mixinFilterBarData = null;
  },
  methods: {
    async filterColumn(column) {
      // store.updateColumns 会导致 store.states.columns 产生变化，因此需要在这里判断是否正在过滤，避免重复过滤
      if (!column || this.mixinFilterBarData.filtering) {
        return
      }

      this.mixinFilterBarData.filtering = true;

      try {
        const origin = this.store.states._columns;
        this.store.states._columns = origin.filter((col) => isFilterWhiteType(col.type) || column?.includes(resolveLabel(col)));
        this.store.updateColumns();
        // 更新列之后还原 el-table 内部的数据，列的增删都会同步到该数据上，因此需要还原，并在每次打开过滤组件时获取最新的列数据
        this.store.states._columns = origin;
        await nextTick(); // 等待输完更新完成再 layout，如果同步 layout 可能出现样式问题（如正常的列和 fixed 的列高度出现不一致等情况）
        this.doLayout();
      } catch (error) {
        console.error(`表格过滤异常：`, error.message || error)
      } finally {
        this.mixinFilterBarData.filtering = false;
      }
    },
  },
});

function isFilterWhiteType(type) {
  return [
    'expand',
    //'selection',
    // 'index'
  ].includes(type);
}

function resolveLabel(column) {
  return column.label || { selection: '选择', index: '序号' }[column.type]
}
