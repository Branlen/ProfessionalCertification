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
        <el-button type="primary" size="small" @click="addUser">新增用户</el-button>
      </div>
      <el-table
        v-loading="listLoading"
        :data="userList"
        class="admin_table"
        border
        fit
        highlight-current-row
      >
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="教师编号">
                <span>{{ props.row.number }}</span>
              </el-form-item>
              <el-form-item label="教师名">
                <span>{{ props.row.name }}</span>
              </el-form-item>
              <el-form-item label="教师密码">
                <span>{{ props.row.password }}</span>
              </el-form-item>
              <el-form-item label="角色">
                <span>{{ props.row.role }}</span>
              </el-form-item>
              <el-form-item label="state">
                <span>{{ props.row.sex }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="教师编号" prop="username" width="180">
          <template slot-scope="scope">
            <span class="adminName">{{ scope.row.number }}</span>
          </template>
        </el-table-column>
        <el-table-column label="教师名" width="180">
          <template slot-scope="scope">
            <span class="adminName">{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="密码" width="180">
          <template slot-scope="scope">
            <span class="adminName">{{ scope.row.password }}</span>
          </template>
        </el-table-column>
        <el-table-column label="角色">
          <template slot-scope="scope">
            <span class="adminName">{{ scope.row.role }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="state" :formatter="formatter" label="状态">
          <!-- <template slot-scope="scope">
            <span class="adminName">{{ scope.row.state }}</span>
          </template>-->
        </el-table-column>
        <el-table-column align="center" label="编辑" width="180">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="modify(scope.row)">修改</el-button>

            <el-button
              size="mini"
              type="danger"
              slot="reference"
              @click="deleteTeacher(scope.row.teacherId) "
            >删除</el-button>
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
import {
  getTeacherInfo,
  getTeacherInfoID,
  deleteTeacher
} from "@/api/teacher.js";
import { MessageBox, Message } from "element-ui";
import Pagination from "@/components/Pagination";
import addUser from "./components/AddUser/index";
import { currentRoles } from "@/utils/auth";
export default {
  components: { Pagination, addUser },
  data() {
    return {
      userList: [],
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
    var role = currentRoles();
    console.log(role);
    if (role != "admin") {
      Message({
        message: "你没有访问的权限",
        type: "success",
        duration: 5 * 1000
      });
       this.$router.push("/");
    } else {
      console.log("creadted");
      this.getUserList();
    }
  },
  methods: {
    formatter(row, column) {
      let str = "";
      if (row.state == 1) {
        str = "在职";
      } else if (row.state == 2) {
        str = "离职";
      } else {
        str = "无";
      }
      return str;
    },
    //改变编辑状态
    changeStatus(data) {
      console.log(data, "");
      this.isAdd = data;
      this.isEdit = data;
      this.getUserList();
    },

    addUser() {
      this.isAdd = true;
    },
    modify(data) {
      this.modifyData = data;
      this.isAdd = false;
      this.isEdit = true;
    },
    //增删改查操作
    getUserList() {
      this.listLoading = true;
      console.log("执行");
      getTeacherInfo({ pageNum: 1, pageSize: 50 }).then(res => {
        console.log(res);
        this.userList = res.data.data.list;
        this.userList.forEach(item => {
          var str = "";
          var arr = item.roleEntityList;
          console.log("tag", arr);
          if (arr != null) {
            arr.forEach((ite, index, array) => {
              str += ite.name;
              if (index != array.length - 1) {
                str += ",";
              }
            });
          }

          item["role"] = str;
        });
        this.total = res.data.data.totalCount;
        this.listLoading = false;
      });
    },
    deleteTeacher(id) {
      MessageBox.confirm("你确定要删除", "确定注销", {
        confirmButtonText: "确定删除",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        deleteTeacher([id.toString()])
          .then(result => {
            Message({
              message: "删除成功",
              type: "success",
              duration: 5 * 1000
            });
            this.getUserList();
          })
          .catch(err => {
            Message({
              message: "删除失败",
              type: "error",
              duration: 5 * 1000
            });
          });
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

