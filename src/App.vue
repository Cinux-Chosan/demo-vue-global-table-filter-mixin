<template>
  <div id="app">
    <h4>Table 1</h4>
    <Table01 />
    <h4>Table 2</h4>
    <Table02 />
    <br />
    <center><b style="color: red;">鼠标移入表格后点击右上角图标可过滤表格列</b></center>
  </div>
</template>

<script>
import Table01 from './components/SomeTable01.vue'
import Table02 from './components/SomeTable02.vue'

export default {
  name: 'App',
  components: {
    Table01,
    Table02
  }
}
</script>