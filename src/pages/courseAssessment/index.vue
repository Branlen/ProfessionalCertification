<template>
  <div class="admin">
    <div class="rulesManager" v-if="isRulesManager">
      <!-- 传进去课程id和课程考核id -->
      <AssessmentRules :AssessmentId="AssessmentId" @isRulesManager="changeStatus" :courseId="childCourseId" :currentAssessmentPattern="currentAssessmentPattern"></AssessmentRules>
    </div>
    <div class="addUser" v-else-if="isAdd">
      <AddAssessment @isAdd="changeStatus"></AddAssessment>
    </div>
    <div class="editUser" v-else-if="isEdit">
      <AddAssessment @isEdit="changeStatus" :modifyData="modifyData"></AddAssessment>
    </div>
    <div class="checkUser" v-else>
      <div class="admin_button">
        <el-button type="primary" size="small" @click="addUser">新增课程考核方式</el-button>
      </div>
      <el-table v-loading="listLoading" :data="userList" class="admin_table" border fit highlight-current-row>
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
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
                <span>{{ props.row.courseContent.experimentPeriod }}</span>
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
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="课程名" prop="username">
          <template slot-scope="scope">
            <span class="adminName">{{ scope.row.courseName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="课程考核方式" width="200">
          <template slot-scope="scope">
            <span class="adminName">{{ scope.row.pattern }}</span>
          </template>
        </el-table-column>
        <el-table-column label="权重" width="200">
          <template slot-scope="scope">
            <span class="adminName">{{ scope.row.weight }}</span>
          </template>
        </el-table-column>
         <el-table-column label="版本号" width="180">
          <template slot-scope="scope">
            <span class="adminName">{{ scope.row.version }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="编辑" width="320">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="modify(scope.row)">修改</el-button>
            <el-button size="mini" type="danger" @click="deleteCourseAssessment(scope.row.courseAssessmentId)">删除</el-button>
            <el-button size="mini" type="primary" @click="rulesManager(scope.row)">课程细则管理</el-button>
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
import { getCourseAssessment, deleteCourseAssessment } from "@/api/courseAssessment";
import {getCourseInfoID} from "@/api/course"
import Pagination from "@/components/Pagination";
import AddAssessment from "./components/AddAssessment/index"
import AssessmentRules from "@/pages/courseAssessmentRules/index"
import { MessageBox, Message } from 'element-ui'
import { currentRoles } from "../../utils/auth";
export default {
  components: { Pagination, AddAssessment,AssessmentRules },
  data() {
    return {
      userList: [
        {
          id: 1,
          pattern: "hanye",
          courseName: "***",
          weight: "刘嘉豪",
          version:"2017",
          courseId:"2",
          courseContent: {
            id: 1,
            number: "hanye",
            name: "***",
            period: "刘嘉豪",
            experiment_period: "18125294570",
            credit: "男",
            curriculum: "1",
            category: "1337434190@qq.com",
            version: 2017
          }
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
      isRulesManager:false,
      AssessmentId:"",
      childCourseId:'',
      currentAssessmentPattern:"",
      modifyData: {}
    };
  },
  created() {
     var role = currentRoles();
    console.log(role);
    if (role != "admin"&&role!="courseLeader") {
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
      this.isRulesManager = data;
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
    rulesManager(data){
      this.AssessmentId = data.courseAssessmentId;
      this.currentAssessmentPattern = data.pattern
      this.childCourseId = data.courseId;
      this.isRulesManager = true;
    },
    //增删改查操作
    getUserList() {
      this.listLoading = true;
      console.log("执行");
      getCourseAssessment(1,50).then(res => {
        
        this.userList = res.data.data.list;
        this.userList.forEach(item=>{
          getCourseInfoID(item.courseId).then((result) => {
            this.$set(item,"courseName", result.data.data.name)
            this.$set(item,"courseContent",result.data.data)
          }).catch((err) => {
            
          });
        });
        this.total = res.data.data.totalCount;
        this.listLoading = false;
      });
    },
    deleteCourseAssessment(id) {
      MessageBox.confirm("你确定要删除", "确定注销", {
        confirmButtonText: "确定删除",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        deleteCourseAssessment([id])
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

