<template>
  <div class="admin">
    <div class="indicatorManager" v-if="isIndicator">
      <indicatorManager :requirementId="requirementId" @isRequirmentManager="changeStatus"></indicatorManager>
    </div>
    <div class="addUser" v-else-if="isAdd">
      <AddGraduateRea @isAdd="changeStatus"></AddGraduateRea>
    </div>
    <div class="editUser" v-else-if="isEdit">
      <AddGraduateRea @isEdit="changeStatus" :modifyData="modifyData"></AddGraduateRea>
    </div>
    <div class="checkUser" v-else>
      <div class="admin_button">
        <el-button type="primary" size="small" @click="addUser">新增毕业要求</el-button>
      </div>
      <el-table  v-loading="listLoading" :data="userList" class="admin_table" border fit highlight-current-row>
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="毕业要求点">
                <span>{{ props.row.number  }}</span>
              </el-form-item>
              <el-form-item label="毕业要求内容">
                <span> {{ props.row.content }}</span>
              </el-form-item>
               <el-form-item label="版本号">
                <span>{{ props.row.version }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="毕业要求点" width="180" prop="username">
          <template slot-scope="scope" >
            <span class="adminName">{{ scope.row.number }}</span>
          </template>
        </el-table-column>
        <el-table-column label="毕业要求内容">
          <template slot-scope="scope">
            <span class="adminName">{{ scope.row.content }}</span>
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
            <el-button size="mini" type="danger" @click="deleteGraduateRequirement(scope.row.graduationRequirementId)">删除</el-button>
            <el-button size="mini" type="primary" @click="indicator(scope.row.graduationRequirementId)">指标点管理</el-button>
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
import { getGraduateRequirement, deleteGraduateRequirement } from "@/api/graduateRequirement";
import Pagination from "@/components/Pagination";
import AddGraduateRea from "./components/AddGraduateRea/index";
import indicatorManager from "@/pages/graduateIndicator"
import { MessageBox, Message } from 'element-ui'
import { currentRoles } from "@/utils/auth";
export default {
  components: { Pagination, AddGraduateRea,indicatorManager },
  data() {
    return {
      userList: [      ],
      total: 50,
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageSize: 10
      },
      isEdit: false,
      isAdd: false,
      modifyData: {},
      isIndicator:false,
      requirementId :'',
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
    //改变编辑状态
    changeStatus(data) {
      console.log(data, "");
      this.isAdd = data;
      this.isEdit = data;
      this.isIndicator = data;
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
    //进入到指标点管理
    indicator(data){
      this.isIndicator = true;
      this.requirementId = data;  
    },
    //增删改查操作
    getUserList() {
      this.listLoading = true;
      console.log("执行");
      getGraduateRequirement(1,50).then(res => {
        console.log(res);
        this.userList = res.data.data.list;
        // this.userList.forEach(value);
        this.total = res.data.data.totalCount;
        this.listLoading = false;
      });
    },
    deleteGraduateRequirement(id) {
      MessageBox.confirm("你确定要删除", "确定注销", {
        confirmButtonText: "确定删除",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        deleteGraduateRequirement([id])
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

