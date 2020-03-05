<template>
  <div class="admin">
    <div class="ObjectiveManager" v-if="isObjectiveManager">
      <objectiveManage :id="objectiveId" @isObjectiveManager="changeStatus"></objectiveManage>
    </div>
    <div class="addUser" v-else-if="isAdd">
      <addUser @isAdd="changeStatus"></addUser>
    </div>
    <div class="editUser" v-else-if="isEdit">
      <addUser @isEdit="changeStatus" :modifyData="modifyData"></addUser>
    </div>
    <div class="checkUser" v-else>
      <div class="admin_button">
        <el-button type="primary" size="small" @click="addUser">新增课程</el-button>
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
              <el-form-item label="课程编号">
                <span>{{ props.row.number }}</span>
              </el-form-item>
              <el-form-item label="课程名">
                <span>{{ props.row.name }}</span>
              </el-form-item>
              <el-form-item label="理论学时">
                <span>{{ props.row.period }}</span>
              </el-form-item>
              <el-form-item label="实际学时">
                <span>{{ props.row.experimentPeriod }}</span>
              </el-form-item>
              <el-form-item label="学分">
                <span>{{ props.row.credit }}</span>
              </el-form-item>
              <el-form-item label="课程性质">
                <span>{{ props.row.curriculum }}</span>
              </el-form-item>
              <el-form-item label="课程类别">
                <span>{{ props.row.category }}</span>
              </el-form-item>
              <el-form-item label="版本号">
                <span>{{ props.row.version }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="课程编号" prop="username">
          <template slot-scope="scope">
            <span class="adminName">{{ scope.row.number }}</span>
          </template>
        </el-table-column>
        <el-table-column label="课程名" width="120">
          <template slot-scope="scope">
            <span class="adminName">{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="理论学时" width="120">
          <template slot-scope="scope">
            <span class="adminName">{{ scope.row.period }}</span>
          </template>
        </el-table-column>
        <el-table-column label="实验学时">
          <template slot-scope="scope">
            <span class="adminName">{{ scope.row.experimentPeriod }}</span>
          </template>
        </el-table-column>
        <el-table-column label="学分">
          <template slot-scope="scope">
            <span class="adminName">{{ scope.row.credit }}</span>
          </template>
        </el-table-column>
        <el-table-column label="课程性质">
          <template slot-scope="scope">
            <span class="adminName">{{ scope.row.curriculum }}</span>
          </template>
        </el-table-column>
        <el-table-column label="课程类别">
          <template slot-scope="scope">
            <span class="adminName">{{ scope.row.category }}</span>
          </template>
        </el-table-column>
        <el-table-column label="版本号">
          <template slot-scope="scope">
            <span class="adminName">{{ scope.row.version }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="编辑" width="280">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="modify(scope.row)">修改</el-button>
            <el-button size="mini" type="danger" @click="deleteUser(scope.row.courseId)">删除</el-button>
            <el-button
              size="mini"
              type="primary"
              @click="objectiveManage(scope.row.courseId)"
            >课程目标管理</el-button>
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
import { getCourseInfo, deleteCourse } from "@/api/course";
import Pagination from "@/components/Pagination";
import addUser from "./components/AddUser/index";
import objectiveManage from "@/pages/courseObject/index";
import { MessageBox, Message } from "element-ui";
import { currentRoles } from "../../utils/auth";
export default {
  components: { Pagination, addUser, objectiveManage },
  data() {
    return {
      userList: [],
      total: 50,
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageSize: 10
      },
      //当前的状态
      isEdit: false,
      isAdd: false,
      isObjectiveManager: false,
      objectiveId: "",
      modifyData: {}
    };
  },
  created() {
    var role = currentRoles();
    console.log(role);
    if (role != "admin"&&role!="outlineCompilers") {
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
    //改变编辑状态
    changeStatus(data) {
      console.log(data, "");
      this.isAdd = data;
      this.isEdit = data;
      this.isObjectiveManager = data;
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
    //更改当前为课程目标管理状态
    objectiveManage(id) {
      this.isObjectiveManager = true;
      console.log(id);
      this.objectiveId = id;
    },
    //增删改查操作
    getUserList() {
      this.listLoading = true;
      console.log("执行");
      getCourseInfo({ pageNum: 1, pageSize: 50 }).then(res => {
        console.log(res);
        this.userList = res.data.data.list;
        // this.userList.forEach(value);
        this.total = res.data.data.totalCount;
        this.listLoading = false;
      });
    },
    deleteUser(id) {
      MessageBox.confirm("你确定要删除", "确定注销", {
        confirmButtonText: "确定删除",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        deleteCourse([id])
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

