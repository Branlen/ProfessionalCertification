<template>
  <div class="admin">
    <div class="addUser" v-if="isAdd">
      <addUser @isAdd="changeStatus"></addUser>
    </div>
    <div class="editUser" v-else-if="isEdit">
      <addUser @isEdit="changeStatus" :modifyData="modifyData"></addUser>
    </div>
    <div class="checkUser" v-else>
      <div class="admin_button">
        <el-button type="primary" size="small" @click="addUser">新增毕业要求课程关联关系</el-button>
      </div>
      <el-table v-loading="listLoading" :data="userList" class="admin_table" border fit highlight-current-row>
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="指标点">
                <span>{{ props.row.indicator }}</span>
              </el-form-item>
              <el-form-item label="课程名">
                <span>{{ props.row.courseName }}</span>
              </el-form-item>
              <el-form-item label="权重">
                <span>{{ props.row.weight }}</span>
              </el-form-item>
               <el-form-item label="版本号">
                <span>{{ props.row.version }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="指标点" prop="username">
          <template slot-scope="scope">
            <span class="adminName">{{ scope.row.indicator }}</span>
          </template>
        </el-table-column>
        <el-table-column label="课程名" width="180">
          <template slot-scope="scope">
            <span class="adminName">{{ scope.row.courseName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="权重" width="180">
          <template slot-scope="scope">
            <span class="adminName">{{ scope.row.weight }}</span>
          </template>
        </el-table-column>
         <el-table-column label="版本号" width="180">
          <template slot-scope="scope">
            <span class="adminName">{{ scope.row.version }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="编辑" width="180">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="modify(scope.row)">修改</el-button>

            <el-button size="mini" type="danger" @click="deleteUser(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination layout="prev, pager, next,->" :total="50"></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import { getUserList, deleteUser } from "@/api/user-mgt";
import Pagination from "@/components/Pagination";
import addUser from "./components/AddUser/index";
import { MessageBox, Message } from 'element-ui'
import { currentRoles } from "../../utils/auth";
export default {
  components: { Pagination, addUser },
  data() {
    return {
      userList: [
        {
          id: 1,
          indicator: "hanye",
          courseName: "***",
          weight: "刘嘉豪",
          version:"2017"
        },
        {
          id: 1,
          indicator: "hanye",
          courseName: "***",
          weight: "刘嘉豪",
          version:"2017"
        },
        {
          id: 1,
          indicator: "hanye",
          courseName: "***",
          weight: "刘嘉豪",
          version:"2017"
        },
        {
          id: 1,
          indicator: "hanye",
          courseName: "***",
          weight: "刘嘉豪",
          version:"2017"
        }
      ],
      total: 50,
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageSize: 10
      },
      isEdit: false,
      isAdd: false,
      modifyData: {}
    };
  },
  created() {
    //console.log('creadted');
    //this.getList();
  },
  methods: {
    //改变编辑状态
    changeStatus(data) {
      console.log(data, "");
      this.isAdd = data;
      this.isEdit = data;
    },
    getList() {
      this.listLoading = true;
      console.log("执行");
      getUserList(this.listQuery).then(res => {
        console.log(res);
        this.userList = res.data.data.list;
        this.total = res.data.data.totalCount;
        this.listLoading = false;
      });
    },
    addUser() {
      this.isAdd = true;
    },
    modify(data) {
      this.modifyData = data;
      this.isAdd = false;
      this.isEdit = true;
    },
    deleteUser() {
      deleteUser(id).then(res => {
        consoole.log(res);
      });
    }
  }
};
</script>
<style lang="less" scoped>
.admin {
  padding: 20px 30px 20px 30px;
  margin: 0 auto;

  .admin_button {
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
  .pagination {
    text-align: center;
    width: 100%;
    margin-top: 15px;
  }
}
</style>

