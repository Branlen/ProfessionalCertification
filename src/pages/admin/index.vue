<template>
  <div class="admin">
    <div class="admin_button">
      <el-button type="primary" size="small" @click="addAdmin">新增管理员</el-button>
    </div>
    <el-table :data="userList"  border fit highlight-current-row>
        <el-table-column type="expand">
      <template slot-scope="props">
        <el-form label-position="left" inline class="demo-table-expand">
          <el-form-item label="用户账号">
            <span>{{ props.row.username }}</span>
          </el-form-item>
          <el-form-item label="用户名称">
            <span>{{ props.row.name }}</span>
          </el-form-item>
          <el-form-item label="用户 ID">
            <span>{{ props.row.id }}</span>
          </el-form-item>
          <el-form-item label="用户号码">
            <span>{{ props.row.telephone }}</span>
          </el-form-item>
          <el-form-item label="用户性别">
            <span>{{ props.row.sex }}</span>
          </el-form-item>
          <el-form-item label="用户邮箱">
            <span>{{ props.row.email }}</span>
          </el-form-item>
          <el-form-item label="用户head">
            <span>{{ props.row.head }}</span>
          </el-form-item>
        </el-form>
      </template>
    </el-table-column>
      <el-table-column label="账号" prop="username" width="180"></el-table-column>
      <el-table-column label="名称" width="180">
        <template slot-scope="scope">
          <span class="adminName">{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机" width="180">
        <template slot-scope="scope">
          <span class="adminName">{{ scope.row.telephone }}</span>
        </template>
      </el-table-column>
       <el-table-column label="邮箱">
        <template slot-scope="scope">
          <span class="adminName">{{ scope.row.email }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="编辑" width="180">
        <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  data() {
    return {
      userList: [
        {
          id: 1,
          username: "zhangqiang",
          password: "***",
          name: "张强",
          telephone: "18125240124",
          sex: "男",
          head: "1",
          email: "zhangqiang@126.com",
          isDelete: false
        },
        {
          id: 2,
          username: "wuchun",
          password: "***",
          name: "吴春",
          telephone: "18925014466",
          sex: "女",
          head: "1",
          email: "189250@163.com",
          isDelete: false
        },
        {
          id: 10,
          username: "queling",
          password: "***",
          name: "雀灵",
          telephone: "13750234570",
          sex: "女",
          head: "what's",
          email: "1435380700@qq.com",
          isDelete: false
        }
      ]
    };
  }
};
</script>
<style lang="less" scoped>
.admin{
  padding: 20px 30px 20px 30px;
  margin: 0 auto;
  .admin_button{
    margin: 0 0 10px 0;
  }
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 60%;
  }


}

</style>

