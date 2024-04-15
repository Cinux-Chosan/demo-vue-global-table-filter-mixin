<template>
  <div>
    <el-table :data="tableData">
      <el-table-column prop="date" label="Date" />
      <el-table-column prop="name" label="Name" />
      <el-table-column prop="gender" label="Gender" />
      <el-table-column prop="age" label="Age" />
      <el-table-column prop="height" label="Height" />
      <el-table-column prop="weight" label="Weight" />
      <el-table-column prop="school" label="School" />
      <el-table-column prop="education" label="Education" />
      <el-table-column prop="address" label="Address" />
      <el-table-column prop="phone" label="Phone" />
      <el-table-column prop="email" label="Email" />
      <el-table-column prop="firstJobTime" label="First Job Time" />
      <el-table-column prop="entryTime" label="Entry Time" />
      <el-table-column prop="leaveTime" label="Leave Time" />
      <el-table-column prop="position" label="Position" />
      <el-table-column prop="maritalStatus" label="Marital Status" />
      <el-table-column prop="operation" label="Operation" fixed="right" width="180">
        <template #default="{ row }">
          <el-button type="text" size="small">Edit</el-button>
          <el-button type="text" size="small">Delete</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
const tableData = [
  {
    date: '2016-05-02',
    name: '王小虎',
    gender: '男',
    age: 18,
    height: 180,
    weight: 70,
    school: '清华大学',
    education: '本科',
    address: '上海市普陀区金沙江路 1518 弄',
    phone: '13800000000',
    email: 'xx@qq.com',
    firstJobTime: '2016-05-02',
    entryTime: '2016-05-02',
    leaveTime: '2016-05-03',
    position: '前端工程师',
    maritalStatus: '未婚'
  }
]
</script>

