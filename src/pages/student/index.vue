<template>
  <div class="admin">
    <div class="addUser" v-if="isAdd">
       <addUser @isAdd="changeStatus"></addUser>
    </div>
    <div class="editUser"  v-else-if="isEdit">
      <addUser @isEdit="changeStatus" :modifyData="modifyData"></addUser>
    </div>
    <div class="checkUser" v-else>
      <div class="admin_button">
        <el-button type="primary" size="small" @click="addUser">新增学生</el-button>
      </div>
      <el-table v-loading="listLoading" :data="userList" class="admin_table" border fit highlight-current-row>
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="学生号">
                <span>{{ props.row.number }}</span>
              </el-form-item>
              <el-form-item label="学生名">
                <span>{{ props.row.name }}</span>
              </el-form-item>
              <el-form-item label="专业">
                <span>{{ props.row.major }}</span>
              </el-form-item>
              <el-form-item label="届别">
                <span>{{ props.row.grade }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="学生号"  width="180">
           <template slot-scope="scope">
            <span class="adminName">{{ scope.row.number }}</span>
          </template>
        </el-table-column>
        <el-table-column label="学生名" width="180">
          <template slot-scope="scope">
            <span class="adminName">{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="专业" width="180">
          <template slot-scope="scope">
            <span class="adminName">{{ scope.row.major }}</span>
          </template>
        </el-table-column>
        <el-table-column label="届别">
          <template slot-scope="scope">
            <span class="adminName">{{ scope.row.grade }}</span>
          </template>
        </el-table-column>
       
        <el-table-column align="center" label="编辑" width="180">
          <template slot-scope="scope">
           
              <el-button size="mini" type="primary" @click="modify(scope.row)"> 修改</el-button>

            <el-button size="mini" type="danger" @click="deleteUser(scope.row.studentId)">删除</el-button>
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
import { getStuedentInfo, deleteStuedent } from "@/api/student";
import Pagination from "@/components/Pagination";
import addUser from "./components/AddUser/index";
import { currentRoles } from "@/utils/auth";
import { MessageBox, Message } from 'element-ui'
export default {
  components: { Pagination,addUser },
  data() {
    return {
      userList: [
        {
          id: 1,
          number: "hanye",
          name: "***",
          major: "刘嘉豪",
          grade: "18125294570",
        
        },
        {
          id: 1,
          number: "hanye",
          name: "***",
          major: "刘嘉豪",
          grade: "18125294570",
        
        }, {
          id: 1,
          number: "hanye",
          name: "***",
          major: "刘嘉豪",
          grade: "18125294570",
        
        },
      ],
      total: 50,
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageSize: 10
      },
      isEdit:false,
      isAdd:false,
      modifyData:{}
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
      this.getStudentList();
    }
    
    
  },
  methods: {
    //改变编辑状态
    changeStatus(data){
      console.log(data, '')
      this.isAdd = data;
      this.isEdit =data;
      this.getStudentList();
    },
  
    addUser() {
      this.isAdd = true;
    },
    modify(data){
      this.modifyData = data;
      this.isAdd= false;
      this.isEdit = true;
      this.getStudentList();
    },
    //增删改查操作
    getStudentList() {
      this.listLoading = true;
      console.log("执行");
      getStuedentInfo({ pageNum: 1, pageSize: 50 }).then(res => {
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
        deleteStuedent([id])
          .then(result => {
            Message({
              message: "删除成功",
              type: "success",
              duration: 5 * 1000
            });
            this.getStudentList();
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
  .pagination{
    text-align: center;
    width: 100%;
    margin-top: 15px
  }
}
</style>

