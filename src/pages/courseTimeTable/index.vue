<template>
  <div class="admin">
    <div class="addUser" v-if="isAdd">
      <addUser @isAdd="changeStatus"></addUser>
    </div>
    <div class="editUser" v-else-if="isEdit">
      <updateUser @isEdit="changeStatus" :modifyData="modifyData"></updateUser>
    </div>
    <div class="checkUser" v-else>
      <div class="queryTimeTable">
        <el-form :inline="true" :model="queryForm" class="demo-form-inline">
          <el-form-item label="学生号">
            <el-input v-model="queryForm.studentNum" placeholder="请填入学号" aria-label="学生号" style="width:220px"></el-input>
          
          </el-form-item>
          <el-form-item label="课程">
            <el-select
              v-model="queryForm.courseId"
              placeholder="请选择课程"
              aria-label="课程"
              class="seletct"
              clearable
            >
              <div v-for="course in courseArr" :key="course.id">
                <el-option :label="course.name +course.version" :value="course.courseId"></el-option>
              </div>
            </el-select>
          </el-form-item>

          <el-form-item label="教工号">
            <el-select
              v-model="queryForm.teacherId"
              placeholder="请选择教师"
              aria-label="课程"
              class="seletct"
              clearable
            >
              <div v-for="teacher in teacherArr" :key="teacher.id">
                <el-option :label="teacher.name" :value="teacher.teacherId"></el-option>
              </div>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="querySchedule">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="admin_button">
        <el-button type="primary" size="small" @click="addUser">新增课表</el-button>
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
              <el-form-item label="学生">
                <span>{{ props.row.studentInfoEntity.name }}</span>
              </el-form-item>
              <el-form-item label="班级">
                <span>{{ props.row.studentInfoEntity.cla }}</span>
              </el-form-item>
              <el-form-item label="课程名">
                <span>{{ props.row.courseEntity.name }}</span>
              </el-form-item>
              <el-form-item label="教师名">
                <span>{{ props.row.teacherInfoEntity.name }}</span>
              </el-form-item>
              <el-form-item label="学期">
                <span>{{ props.row.semester }}</span>
              </el-form-item>
              <el-form-item label="课程负责人">
                <span>{{ props.row.is_leader?"是":"否" }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="学生" prop="username">
          <template slot-scope="scope">
            <span class="adminName">{{ scope.row.studentInfoEntity.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="班级">
          <template slot-scope="scope">
            <span class="adminName">{{ scope.row.studentInfoEntity.cla }}</span>
          </template>
        </el-table-column>
        <el-table-column label="课程" width="180">
          <template slot-scope="scope">
            <span class="adminName">{{ scope.row.courseEntity.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="任课老师" width="180">
          <template slot-scope="scope">
            <span class="adminName">{{ scope.row.teacherInfoEntity.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="学期">
          <template slot-scope="scope">
            <span class="adminName">{{ scope.row.semester }}</span>
          </template>
        </el-table-column>
        <el-table-column label="课程负责人" prop="isLeader" :formatter="formatter"></el-table-column>

        <el-table-column align="center" label="编辑" width="180">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="modify(scope.row)">修改</el-button>

            <el-button size="mini" type="danger" @click="deleteUser(scope.row.classScheduleId)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- !!! -->
      <div class="pagination">
        <el-pagination layout="prev, pager, next,->" :total="total" background :page-size="10" @current-change="handlePageChange"></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import { getClassSchedule, deleteClassSchedule } from "@/api/courseSchedule";
import Pagination from "@/components/Pagination";
import addUser from "./components/AddUser/index";
import updateUser from "./components/UpdateClassSchedule/index";
import { MessageBox, Message } from "element-ui";
import { currentRoles } from "../../utils/auth";
import { getCourseInfo } from "@/api/course";
import { getTeacherInfo } from "@/api/teacher";
import { getClassList } from "@/api/student";

export default {
  components: { Pagination, addUser,updateUser },
  data() {
    return {
      userList: [],
      total: 50,
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        teacherId: "",
        courseId: "",
        studentNum: "",
      },
      isEdit: false,
      isAdd: false,
      modifyData: {},
      queryForm: {
        studentNum: "",
        courseId: "",
        teacherId: "",
        pageNum: 1,
        pageSize: 50
      },
      courseArr: [],
      classArr: [],
      teacherArr: []
    };
  },
  created() {
    var role = currentRoles();
    console.log(role);
    if (role !== "admin") {
      Message({
        message: "你没有访问的权限",
        type: "success",
        duration: 5 * 1000
      });
      this.$router.push("/");
    } else {
      console.log("creadted");
      this.getUserList();
      this.getCourseTeacherClass();
    }
  },
  methods: {
    getCourseTeacherClass() {
      getCourseInfo({ pageNum: 1, pageSize: 200 })
        .then(result => {
          this.courseArr = result.data.data.list;
        })
        .catch(err => {});
      getTeacherInfo({ pageNum: 1, pageSize: 200 })
        .then(result => {
          this.teacherArr = result.data.data.list;
        })
        .catch(err => {});
      getClassList()
        .then(result => {
          this.classArr = result.data.data;
        })
        .catch(err => {});
    },
    formatter(row, column) {
      let str = "";
      if (row.isLeader == 1) {
        str = "是";
      } else {
        str = "否";
      }
      return str;
    },
    //按照条件查询课表信息
    querySchedule() {
      this.listLoading = true;
      getClassSchedule(this.queryForm)
        .then(result => {
          this.userList = result.data.data.list;
          // this.userList.forEach(value);
          this.total = result.data.data.totalCount;
          this.listLoading = false;
        })
        .catch(err => {});
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
      getClassSchedule(this.listQuery).then(res => {
        console.log(res);
        this.userList = res.data.data.list;
        // this.userList.forEach(value);
        this.total = res.data.data.totalCount;
        this.listLoading = false;
      });
    },
    handlePageChange(e){
      this.listQuery.pageNum =e;
      this.getUserList();
    },
    deleteUser(id) {
      MessageBox.confirm("该记录是否确定删除，删除之后，成绩数据...也将同步删除，过程不可逆", "确定注销", {
        confirmButtonText: "确定删除",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        deleteClassSchedule([id])
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

