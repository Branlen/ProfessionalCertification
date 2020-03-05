<template>
  <div class="courseRules">
    <div class="addUser" v-if="isAdd">
      <AddRules @isAdd="changeStatus" :rulesContent="userList"></AddRules>
    </div>
    <div class="editUser" v-else-if="isEdit">
      <AddRules @isEdit="changeStatus" :modifyData="modifyData"></AddRules>
    </div>
    <div class="checkUser" v-else>
      <div class="admin_button">
        <el-button type="info" size="small" @click="backAssessment">返回</el-button>
        <el-button type="primary" size="small" @click="addUser">管理考核细则</el-button>
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
              <el-form-item label="课程名">
                <span>{{ props.row.courseName }}</span>
              </el-form-item>
              <el-form-item label="考核方式">
                <span>{{ props.row.pattern }}</span>
              </el-form-item>
              <el-form-item label="细则方式">
                <span>{{ props.row.detail }}</span>
              </el-form-item>
              <el-form-item label="权重">
                <span>{{ props.row.weight }}</span>
              </el-form-item>
              <el-form-item label="课程关联的目标">
                <span>{{ props.row.weight }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="考核方式" prop="username" width="300">
          <template slot-scope="scope">
            <span class="adminName">{{ scope.row.pattern }}</span>
          </template>
        </el-table-column>
        <el-table-column label="细则方式" width="300">
          <template slot-scope="scope">
            <span class="adminName">{{ scope.row.detail }}</span>
          </template>
        </el-table-column>
        <el-table-column label="权重" width="300">
          <template slot-scope="scope">
            <span class="adminName">{{ scope.row.weight }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="编辑" >
          <template slot-scope="scope">
            <el-button size="mini" type="danger" @click="deleteUser(scope.row.id)">删除</el-button>
            <el-button
              type="primary"
              size="small"
              @click="manageRuleObjective(scope.row.courseAssessmentRuleId)"
            >新增目标与细则的关系</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination layout="prev, pager, next,->" :total="50"></el-pagination>
      </div>
    </div>
    <el-drawer
      title="课程目标选择"
      :visible.sync="drawer"
      direction="rtl"
      :before-close="handleClose"
      class="courseObjective"
    >
      <el-form action style="padding:15px">
        <div
          v-for="(course,index) in objecetRules "
          :key="course.courseObjectiveId"
          class="typeObjective"
        >
          <el-select
            v-model="course.courseObjectiveId"
            :placeholder="'请选择课程目标' +index "
      
            class="seletct"
          >
            <div v-for="objective in objectives" :key="objective.id">
              <el-option :label="objective.objective" :value="objective.courseObjectiveId"></el-option>
            </div>
          </el-select>
          <el-button
            class="dangerBut"
            type="danger"
            @click.prevent="removeObjectiveRule(course)"
        
          >删除</el-button>
        </div>

        <el-button type="primary"  @click="submitObjective">提交</el-button>
        <el-button @click="addObjectiveRule" >新增课程目标</el-button>
      </el-form>
    </el-drawer>
  </div>
</template>
<script>
import {
  getCourseAssessmentRule,
  getCourseAssessmentRuleByAssessmentID,
  deleteCourseAssessmentRule,
  saveRuleObject,
  deleteRuleObject,
  getRuleObjectByRuleId
} from "@/api/courseAssessmentRules";
import { getCourseObjective } from "@/api/courseObjective";
import Pagination from "@/components/Pagination";
import AddRules from "./components/AddCourseAssessmentRules/index";
import { MessageBox, Message } from "element-ui";
import {isRepeat} from "@/utils/validate"
import { currentRoles } from "../../utils/auth";
export default {
  components: { Pagination, AddRules },
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
      modifyData: {},
      drawer: false,
      //选择的课程目标id
      courseObjectiveId: "",
      objecetRules: [
        {
          courseObjectiveId: ""
        }
      ],
      objectives: [
        {
          id: 3,
          objective: "!!理解通信的基本概念理解通信的基本概念理解通信的基本概念!"
        },
        {
          id: 4,
          objective: "!理解通信的基本概念理解通信的基本概念理解通信的基本概念"
        }
      ],
      //当前细则id
      currentCourseAssessmentRuleIdId: "",
      //当前所有目标与细则关联的目标细则id
      currentRuleObjectiveArr:[]
    };
  },
  props: {
    AssessmentId: "",
    courseId: "",
    currentAssessmentPattern: ""
  },
  created() {
    console.log("creadted");
    this.getUserList();
  },
  methods: {
    //改变编辑状态
    changeStatus(data) {
      console.log(data, "");
      this.isAdd = data;
      this.isEdit = data;
      this.getUserList();
    },

    modify(data) {
      this.modifyData = data;
      this.isAdd = false;
      this.isEdit = true;
    },
    addUser() {
      this.isAdd = true;
      this.isEdit = false;
    },
    backAssessment() {
      this.$emit("isRulesManager", false);
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    removeObjectiveRule(item) {
      var index = this.objecetRules.indexOf(item);
      if (index !== -1) {
        this.objecetRules.splice(index, 1);
      }
    },
    addObjectiveRule() {
      this.objecetRules.push({
        courseObjectiveId: "",
        key: Date.now()
      });
    },
    //增删改查操作
    getUserList() {
      this.listLoading = true;
      console.log("执行");
      getCourseAssessmentRuleByAssessmentID(this.AssessmentId).then(res => {
        console.log(res);
        this.userList = res.data.data;
        this.userList.forEach(item => {
          this.$set(item, "pattern", this.currentAssessmentPattern);
        });
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
    },
    //课程细则目标关联的所有函数
    manageRuleObjective(id) {
      this.drawer = true;
      this.currentCourseAssessmentRuleIdId = id;
      this.currentRuleObjectiveArr = []
      //得到与指标有关的所有课程目标
       getRuleObjectByRuleId(id)
        .then(result => {
          console.log("AA",result);
          this.objecetRules = result.data.data;

          this.objecetRules.forEach(item => {
            this.$set(item, "ruleId", id);
            this.$set(item,"courseObjectiveId",item.courseObjectiveEntity.courseObjectiveId)
            this.currentRuleObjectiveArr.push(item.ruleObjectiveId);
          });
        })
        .catch(err => {});
      getCourseObjective(1, 200, this.courseId)
        .then(result => {
          this.objectives = result.data.data.list;
        })
        .catch(err => {});
    },
    submitObjective(id) {
      //判断权重是否为1，课程是否重复
       if (isRepeat(this.objecetRules, "courseObjectiveId")) {
          Message({
            message: "课程目标有重复，请查验后重新输入",
            type: "info",
            duration: 5 * 1000
          });
        } else {
          console.log(this.currentRuleObjectiveArr);
          if (this.currentRuleObjectiveArr.length==0) {
            this.objecetRules.forEach(item => {
              this.$set(item, "ruleId", this.currentCourseAssessmentRuleIdId);
              saveRuleObject(item)
                .then(result => {
                  Message({
                    message: "保存成功",
                    type: "success",
                    duration: 5 * 1000
                  });
                })
                .catch(err => {});
            });
          } else {
            deleteRuleObject(this.currentRuleObjectiveArr)
              .then(result => {
                this.objecetRules.forEach(item => {
                  this.$set(item, "ruleId", this.currentCourseAssessmentRuleIdId);
                  saveRuleObject(item)
                    .then(result => {
                      Message({
                        message: "保存成功",
                        type: "success",
                        duration: 5 * 1000
                      });
                    })
                    .catch(err => {});
                });
              })
              .catch(err => {});
          }
          this.drawer = false;
        }
      
    }
  }
};
</script>
<style lang="less" scoped>
.courseRules {
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
.courseObjective {
  .el-drawer {
    padding: 30px;
  }
}
.typeObjective {
  .seletct {
    padding: 20px;
  }
}
</style>

