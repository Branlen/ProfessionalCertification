<template>
  <div class="admin">
    <div class="addUser" v-if="isAdd">
      <AddObject @isAdd="changeStatus" :courseID="id" ></AddObject>
    </div>
    <div class="editUser" v-else-if="isEdit">
      <AddObject @isEdit="changeStatus" :modifyData="modifyData" :courseID="id"></AddObject>
    </div>
    <div class="checkUser" v-else>
      <div class="admin_button">

        <el-button type="info" size="small" @click="rebackCourse">返回</el-button>
        <el-button type="primary" size="small" @click="addUser">新增目标</el-button>
      </div>
      <el-table  v-loading="listLoading" :data="userList" class="admin_table" border fit highlight-current-row>
        <el-table-column type="expand"  width="80px">
          <template slot-scope="props">
            <!-- <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="课程编号">
                <span>{{ props.row.courseContent.number }}</span>
              </el-form-item>
              <el-form-item label="课程名">
                <span>{{ props.row.courseContent.name }}</span>
              </el-form-item>
              <el-form-item label="理论学时">
                <span>{{ props.row.courseContent.period }}</span>
              </el-form-item>
              <el-form-item label="实际学时">
                <span>{{ props.row.courseContent.experiment_period }}</span>
              </el-form-item>
              <el-form-item label="学分">
                <span>{{ props.row.courseContent.credit }}</span>
              </el-form-item>
              <el-form-item label="课程性质">
                <span>{{ props.row.courseContent.curriculum }}</span>
              </el-form-item>
              <el-form-item label="课程类别">
                <span>{{ props.row.courseContent.category }}</span>
              </el-form-item>
              <el-form-item label="版本号">
                <span>{{ props.row.courseContent.version }}</span>
              </el-form-item>
            </el-form> -->
             <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="目标号">
                <span>{{ props.row.number }}</span>
              </el-form-item>
              <el-form-item label="目标内容">
                <span>{{ props.row.objective }}</span>
              </el-form-item>
             </el-form>
          </template>
        </el-table-column>
       
        <el-table-column label="目标号" width="180">
          <template slot-scope="scope">
            <span class="adminName">{{ scope.row.number }}</span>
          </template>
        </el-table-column>
        <el-table-column label="目标内容" >
          <template slot-scope="scope">
            <span class="adminName">{{ scope.row.objective }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="编辑" width="180">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="modify(scope.row)">修改</el-button>

            <el-button size="mini" type="danger" @click="deleteCourseObjective(scope.row.courseObjectiveId)">删除</el-button>
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
import { getCourseObjective, deleteCourseObjective } from "@/api/courseObjective";
import Pagination from "@/components/Pagination";
import AddObject from "./components/AddObject/index";
import { MessageBox, Message } from 'element-ui'
import { currentRoles } from "../../utils/auth";
export default {
  components: { Pagination, AddObject },
  data() {
    return {
      userList: [  ],
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
  props:{
    id:""
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
    rebackCourse(){
       this.$emit("isObjectiveManager", false);
    },
    //增删改查操作
    getUserList() {
      this.listLoading = true;
      console.log("执行");
      getCourseObjective(1,50,this.id).then(res => {
        console.log(res);
        this.userList = res.data.data.list;
        // this.userList.forEach(value);
        this.total = res.data.data.totalCount;
        this.listLoading = false;
      });
    },
    deleteCourseObjective(id) {
      MessageBox.confirm("你确定要删除", "确定注销", {
        confirmButtonText: "确定删除",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        deleteCourseObjective([id])
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

