<template>
  <div class="graduateIndicator">
    <div class="addUser" v-if="isAdd">
      <AddRules @isAdd="changeStatus" :requirementId="requirementId"></AddRules>
    </div>
    <div class="editUser" v-else-if="isEdit">
      <AddRules @isEdit="changeStatus" :modifyData="modifyData"></AddRules>
    </div>
    <div class="checkUser" v-else>
      <div class="admin_button">
        <el-button type="info" size="small" @click="backAssessment">返回</el-button>
        <el-button type="primary" size="small" @click="addUser">新增指标点</el-button>
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
              <el-form-item label="毕业要求内容">
                <span>{{ props.row.requirementContent }}</span>
              </el-form-item>
              <el-form-item label="要求指标点">
                <span>{{ props.row.number }}</span>
              </el-form-item>
              <el-form-item label="要求指标内容">
                <span>{{ props.row.content }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="毕业要求内容" prop="username" width="180">
          <template slot-scope="scope">
            <span class="adminName">{{ scope.row.requirementContent }}</span>
          </template>
        </el-table-column>
        <el-table-column label="要求指标点" width="180" prop="number">
          <template slot-scope="scope">
            <span class="adminName">{{ scope.row.number }}</span>
          </template>
        </el-table-column>
        <el-table-column label="要求指标内容">
          <template slot-scope="scope">
            <span class="adminName">{{ scope.row.content }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="编辑" width="550">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="modify(scope.row)">修改</el-button>
            <el-button size="mini" type="danger" @click="deleteIndicator(scope.row.indicatorId)">删除</el-button>
            <el-button
              type="primary"
              size="small"
              @click="manageCourseIndicator(scope.row.indicatorId)"
            >管理指标点与课程的关系</el-button>
            <el-button
              type="primary"
              size="small"
              @click="manageObjectiveIndicator(scope.row.indicatorId)"
            >管理指标点与目标的关系</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination layout="prev, pager, next,->" :total="50"></el-pagination>
      </div>
    </div>
    <!-- 选择指标对应的课程及权重 -->
    <el-drawer
      title="指标对应课程选择及权重"
      :visible.sync="drawerCourse"
      direction="rtl"
      :before-close="handleClose"
      class="courseObjective"
    >
      <el-form ref="form" :model="coureseIndicatorForm" label-width="80px">
        <div
          v-for="(courseWeight, index) in coureseIndicatorForm.courseWeight"
          :key="courseWeight.key"
        >
          <el-form-item :label="'课程' + index">
            <el-select
              v-model="courseWeight.courseId"
              placeholder="请选择课程"
              aria-label="课程"
              class="seletct"
            >
              <div v-for="course in courses" :key="course.id">
                <el-option :label="course.name +course.version" :value="course.courseId"></el-option>
              </div>
            </el-select>
          </el-form-item>
          <el-form-item :label="'权重'+ index" class="weightInput">
            <el-input
              v-model="courseWeight.weight"
              placeholder="权重值，课程权重之和不能超过1"
              style="width:140px"
            ></el-input>
          </el-form-item>
          <el-button
            class="dangerBut"
            type="danger"
            @click.prevent="removeCourseAndWeight(courseWeight)"
          >删除</el-button>
        </div>

        <el-form-item>
          <el-button type="primary" @click="submitCourseWeight" id="but">立即保存</el-button>
          <el-button @click="addCourseAndWeight">新增课程</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
    <!-- 选择指标点对应的课程目标 -->
    <el-drawer
      title="指标点课程目标选择"
      :visible.sync="drawerObject"
      direction="rtl"
      :before-close="handleClose"
      class="courseObjective"
    >
      <el-form ref="form" :model="objectiveIndicatorForm" label-width="80px">
        <div
          v-for="(course, index) in  objectiveIndicatorForm.objecetIndicator"
          :key="course.courseObjectiveId"
        >
          <el-form-item :label="'课程目标' + index">
            <el-select
              v-model="course.courseObjectiveId "
              placeholder="请选择课程目标"
              aria-label="课程目标"
              class="seletct"
            >
              <div v-for="objective in objectives" :key="objective.courseObjectiveId">
                <el-option
                  :label="objective.objective"
                  :value="objective.courseObjectiveId"
                  style="width:500px"
                ></el-option>
              </div>
            </el-select>
          </el-form-item>
          <el-form-item :label="'支撑度'+ index" class="weightInput">
            <el-input v-model="course.supportLevel" placeholder="支撑度之和不能超过1" style="width:140px"></el-input>
          </el-form-item>
          <el-button
            class="dangerBut"
            type="danger"
            @click.prevent="removeObjectAndWeight(course)"
          >删除</el-button>
        </div>

        <el-form-item>
          <el-button type="primary" @click="submitObjective" id="but">立即保存</el-button>
          <el-button @click="addObjectAndWeight">新增课程目标</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
  </div>
</template>
<script>
import {
  getIndicator,
  deleteIndicator,
  getIndicatorCourseByIndicatorId,
  deleteIndicatorCourse,
  saveIndicatorCourse,
  getCourseIndicatorObjectiveByIndicatorId,
  deleteCourseIndicatorObjective,
  saveCourseIndicatorObjective
} from "@/api/indicator";
import { getGraduateRequirementID } from "@/api/graduateRequirement";
import { getCourseInfo } from "@/api/course";
import { getCourseObjective } from "@/api/courseObjective";
import Pagination from "@/components/Pagination";
import AddRules from "./components/AddGraduateIndicator/index";
import { MessageBox, Message } from "element-ui";
import { adjustWeight, isRepeat } from "@/utils/validate";
import { currentRoles } from "@/utils/auth";
export default {
  components: { Pagination, AddRules },
  data() {
    return {
      userList: [
        {
          id: 1,
          content: "hanye",
          number: "dsa",
          requirementContent: "!!!"
        },
        {
          id: 1,
          content: "hanye",
          number: "dsa",
          requirementContent: "!!!"
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
      modifyData: {},
      drawerCourse: false,
      drawerObject: false,
      //选择的课程目标id
      courseObjectiveId: "",
      objectives: [],
      objectiveIndicatorForm: {
        objecetIndicator: [
          { indicatorId: 0, courseObjectiveId: 0, supportLevel: 0 }
        ]
      },
      coureseIndicatorForm: {
        courseWeight: [{ courseId: "", indicatorId: "", weight: "" }]
      },
      courses: [],
      //当前的指标id；
      currentIndicatorId: "",
      //当前从数据库获得的课程与指标关联的指标点和课程id
      currentIndicatorCourseArr: [],
      //当前从数据库获得的课程目标与指标的关联的指标点和课程目标id
      currentIndicatorObjectArr: [],
      //获得课程与指标关联的课程id
      courseIdArr: []
    };
  },
  props: {
    AssessmentId: "",
    courseId: "",
    requirementId: ""
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
    addUser() {
      this.isAdd = true;
    },
    modify(data) {
      this.modifyData = data;
      this.isAdd = false;
      this.isEdit = true;
    },
    backAssessment() {
      this.$emit("isRequirmentManager", false);
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },

    //提交课程及权重与目标的关系
    manageCourseIndicator(id) {
      this.drawerCourse = true;
      this.currentIndicatorId = id;
      this.currentIndicatorCourseArr = [];
      getIndicatorCourseByIndicatorId(id)
        .then(result => {
          this.coureseIndicatorForm.courseWeight = result.data.data;
          console.log(this.coureseIndicatorForm.courseWeight);
          this.coureseIndicatorForm.courseWeight.forEach(item => {
            this.$set(item, "courseId", item.courseEntity.courseId);
            this.$set(item, "indicatorId", id);
            delete item.courseEntity;
            this.currentIndicatorCourseArr.push(item.indicatorCourseId);
            delete item.indicatorCourseId;
            delete item.indicatorEntity;
          });

          console.log(this.coureseIndicatorForm.courseWeight);
        })
        .catch(err => {});

      getCourseInfo({ pageNum: 1, pageSize: 200 })
        .then(result => {
          this.courses = result.data.data.list;
        })
        .catch(err => {});
    },
    submitCourseWeight(id) {
      //判断权重是否为1，课程是否重复
      if (adjustWeight(this.coureseIndicatorForm.courseWeight, "weight")) {
        if (isRepeat(this.coureseIndicatorForm.courseWeight, "courseId")) {
          Message({
            message: "课程有重复，请查验后重新输入",
            type: "info",
            duration: 5 * 1000
          });
        } else {
          if (this.currentIndicatorCourseArr.length == 0) {
            this.coureseIndicatorForm.courseWeight.forEach(item => {
              this.$set(item, "indicatorId", this.currentIndicatorId);
              saveIndicatorCourse(item)
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
            deleteIndicatorCourse(this.currentIndicatorCourseArr)
              .then(result => {
                this.coureseIndicatorForm.courseWeight.forEach(item => {
                  this.$set(item, "indicatorId", this.currentIndicatorId);
                  saveIndicatorCourse(item)
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
          this.drawerCourse = false;
        }
      } else {
        Message({
          message: "权重之和不为1，请查验后重新输入",
          type: "info",
          duration: 5 * 1000
        });
      }
    },
    //提交目标与指标的关系
    manageObjectiveIndicator(id) {
      this.drawerObject = true;
      this.currentIndicatorId = id;
      this.currentIndicatorObjectArr = [];
      getCourseIndicatorObjectiveByIndicatorId(id)
        .then(result => {
          console.log(result);
          this.objectiveIndicatorForm.objecetIndicator = result.data.data;
          this.objectiveIndicatorForm.objecetIndicator.forEach(item => {
            this.$set(
              item,
              "courseObjectiveId",
              item.courseObjectiveEntity.courseObjectiveId
            );
            this.$set(item, "indicatorId", id);
            delete item.courseObjectiveEntity;
            this.currentIndicatorObjectArr.push(item.indicatorObjectiveId);
            delete item.indicatorObjectiveId;
            delete item.indicatorEntity;
          });

          console.log(this.coureseIndicatorForm.courseWeight);
        })
        .catch(err => {});
      //找出指标所关联的课程id 并找出所有的课程目标
      this.courseIdArr = [];
      getIndicatorCourseByIndicatorId(id)
        .then(result => {
          var form = result.data.data;
          form.forEach(item => {
            this.courseIdArr.push(item.courseEntity.courseId);
          });
          //遍历得到所有的课程目标
          this.objectives = []; //初始化课程目标的内容
          for (var i = 0; i < this.courseIdArr.length; i++) {
            getCourseObjective(1, 200, this.courseIdArr[i])
              .then(result => {
                console.log("sd", result);
                this.objectives = this.objectives.concat(result.data.data.list);
                console.log(this.objectives);
              })
              .catch(err => {});
          }
        })
        .catch(err => {});
    },
    submitObjective(id) {
      //判断权重是否为1，课程是否重复
      if (
        adjustWeight(
          this.objectiveIndicatorForm.objecetIndicator,
          "supportLevel"
        )
      ) {
        if (
          isRepeat(this.objectiveIndicatorForm.objecetIndicator, "courseObjectiveId")
        ) {
          Message({
            message: "课程有重复，请查验后重新输入",
            type: "info",
            duration: 5 * 1000
          });
        } else {
          if (this.currentIndicatorObjectArr.length == 0) {
            this.objectiveIndicatorForm.objecetIndicator.forEach(item => {
              this.$set(item, "indicatorId", this.currentIndicatorId);
              saveCourseIndicatorObjective(item)
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
            deleteCourseIndicatorObjective(this.currentIndicatorObjectArr)
              .then(result => {
                this.objectiveIndicatorForm.objecetIndicator.forEach(item => {
                  this.$set(item, "indicatorId", this.currentIndicatorId);
                  saveCourseIndicatorObjective(item)
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
          this.drawerObject = false;
        }
      } else {
        Message({
          message: "权重之和不为1，请查验后重新输入",
          type: "info",
          duration: 5 * 1000
        });
      }
    },

    removeCourseAndWeight(item) {
      var index = this.coureseIndicatorForm.courseWeight.indexOf(item);
      if (index !== -1) {
        this.coureseIndicatorForm.courseWeight.splice(index, 1);
      }
    },
    addCourseAndWeight() {
      this.coureseIndicatorForm.courseWeight.push({
        courseId: "",
        indicatorId: "",
        weight: "",
        key: Date.now()
      });
    },
    removeObjectAndWeight(item) {
      var index = this.objectiveIndicatorForm.objecetIndicator.indexOf(item);
      if (index !== -1) {
        this.objectiveIndicatorForm.objecetIndicator.splice(index, 1);
      }
    },
    addObjectAndWeight() {
      this.objectiveIndicatorForm.objecetIndicator.push({
        objectiveId: "",
        supportLevel: "",
        key: Date.now()
      });
    },
    //增删改查操作
    getUserList() {
      this.listLoading = true;
      console.log("执行");
      //获得的当前毕业要求内容
      var content = "";
      getGraduateRequirementID(this.requirementId)
        .then(result => {
          content = result.data.data.content;
        })
        .catch(err => {});
      getIndicator(1, 10, this.requirementId).then(res => {
        this.userList = res.data.data.list;
        this.userList.forEach(item => {
          item["requirementContent"] = content;
        });
        // this.userList.forEach(value);
        this.total = res.data.data.totalCount;
        this.listLoading = false;
      });
    },
    deleteIndicator(id) {
      MessageBox.confirm("你确定要删除", "确定注销", {
        confirmButtonText: "确定删除",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        deleteIndicator([id])
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
.graduateIndicator {
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
.weightInput {
  display: inline-block;
}
.dangerBut {
  float: right;
}
.courseObjective {
  form {
    padding: 15px;
  }
}
</style>

