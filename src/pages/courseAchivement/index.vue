<template>
  <div class="admin">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="课程总体达成度管理" name="first">
        <div class="courseAchivement">
          <el-form :inline="true" :model="queryForm" class="demo-form-inline">
            <el-form-item label="课程">
              <el-select v-model="queryForm.courseId" placeholder="请输入课程 " class="seletct">
                <div v-for="course in courseArr" :key="course.courseId">
                  <el-option :label="course.name+course.version" :value="course.courseId"></el-option>
                </div>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="getCourseAchivements">更新</el-button>
            </el-form-item>
          </el-form>
          <el-table
            highlight-current-row
            v-loading="listLoading1"
            :data="courseAchivementContent"
            stripe
            style="width: 100%"
            height="450px"
          >
            <el-table-column prop="courseObjectiveEntity.objective" label="教学目标" width="380">
              <template slot-scope="scope">
                <span>{{scope.row.courseObjectiveEntity.number}}{{ scope.row.courseObjectiveEntity.objective }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="examScore" label="考试实际得分" width="180"></el-table-column>
            <el-table-column prop="experimentScore" label="实验实际得分"></el-table-column>
            <el-table-column prop="homeworkScore" label="作业实际得分"></el-table-column>
            <el-table-column prop="totalScore" label="实际总分"></el-table-column>
            <el-table-column prop="objectiveScore" label="目标总分"></el-table-column>
            <el-table-column prop="achievementScale" label="达成度"></el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
      <el-tab-pane label="课程个体达成度管理" name="second">
        <div class="individualAchivement">
          <el-form :inline="true" :model="individualForm" class="demo-form-inline">
            <el-form-item label="课程">
              <el-select v-model="individualForm.courseId" placeholder="请输入课程 " class="seletct">
                <div v-for="course in courseArr" :key="course.courseId">
                  <el-option :label="course.name+course.version" :value="course.courseId"></el-option>
                </div>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="getIndividualAchivements">更新</el-button>
            </el-form-item>
          </el-form>

          <el-table
            v-loading="listLoading2"
            highlight-current-row
            :data="individualAchivementContent"
            stripe
            style="width: 100%"
          >
            <el-table-column label="教学目标" width="380">
              <template slot-scope="scope">
                <span>{{scope.row.objective.number}}{{ scope.row.objective.objective }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="targetScore" label="目标总分" width="180"></el-table-column>
            <el-table-column prop="targetThreshold" label="目标阙值"></el-table-column>
            <el-table-column prop="completeNumber" label="达成人数"></el-table-column>
            <el-table-column prop="isComplete" label="是否达成" :formatter="formatter"></el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { getCourseInfo } from "@/api/course";
import { currentRoles } from "@/utils/auth";
import {
  getCourseAchivement,
  getIndividualAchivement,
  getRequirementAchivement,
  getTotalAchivement,
  postCoursetCalculate,
  postIndividualCalculate
} from "@/api/achivement";
import { Message } from "element-ui";
export default {
  data() {
    return {
      courseArr: [],
      queryForm: {
        courseId: ""
      },
      courseAchivementContent: [],
      individualForm: {
        courseId: ""
      },
      requirementForm: {
        courseId: ""
      },
      individualAchivementContent: [],
      requirementAchivementContent: [],
      totalAchivementContent: [],

      listLoading1: false,
      listLoading2: false,
      listLoading3: false,
      listLoading4: false,
      activeName: "first",
      tableHead: [
        {
          column_name: "achievementScore",
          column_comment: "目标"
        }
      ],
      tableHead2: [
        {
          column_name: "achievementScore",
          column_comment: "目标"
        }
      ]
    };
  },
  created() {
    var role = currentRoles();
    if (role != "admin" && role != "courseLeader") {
      Message({
        message: "你没有访问的权限",
        type: "success",
        duration: 5 * 1000
      });
      this.$router.push("/");
    } else {
      this.getCourseTeacher();
      this.getCourseAchivements(1);
      this.getIndividualAchivements(1);
    }
  },
  methods: {
    formatter(row, column) {
      let str = "";
      if (row.isComplete == 1) {
        str = "是";
      } else {
        str = "否";
      }
      return str;
    },

    handleClick(tab, event) {
      console.log(tab, event);
    },
    getCourseTeacher() {
      getCourseInfo({ pageNum: 1, pageSize: 200 })
        .then(result => {
          this.courseArr = result.data.data.list;
        })
        .catch(err => {});
    },
    getCourseAchivements(id) {
      if (id == 1) {
        this.listLoading1 = true;
        getCourseAchivement(id)
          .then(result => {
            this.courseAchivementContent = result.data.data;
            this.listLoading1 = false;
          })
          .catch(err => {
            this.listLoading1 = false;
          });
      } else {
        if (this.queryForm.courseId == "") {
          Message({
            type: "danger",
            message: "请输入课程",
            duration: 5 * 1000
          });
        } else {
          this.listLoading1 = true;
          console.log(this.queryForm.courseId);
          postCoursetCalculate(this.queryForm.courseId)
            .then(result => {
              getCourseAchivement(this.queryForm.courseId)
                .then(result => {
                  Message({
                    type: "success",
                    message: "更新成功",
                    duration: 5 * 1000
                  });
                  this.courseAchivementContent = result.data.data;
                  this.listLoading1 = false;
                })
                .catch(err => {
                  this.listLoading1 = false;
                });
            })
            .catch(err => {});
        }
      }
    },
    getIndividualAchivements(id) {
      if (id == 1) {
        this.listLoading2 = true;
        getIndividualAchivement(id)
          .then(result => {
            this.individualAchivementContent = result.data.data;
            this.listLoading2 = false;
          })
          .catch(err => {
            this.listLoading2 = false;
          });
      } else {
        if (this.individualForm.courseId == "") {
          Message({
            type: "danger",
            message: "请输入课程",
            duration: 5 * 1000
          });
        } else {
          this.listLoading2 = true;
          getIndividualAchivement(this.individualForm.courseId)
            .then(result => {
              getIndividualAchivement(this.individualForm.courseId)
                .then(result => {
                  Message({
                    type: "success",
                    message: "更新成功",
                    duration: 5 * 1000
                  });
                  this.individualAchivementContent = result.data.data;
                  this.listLoading2 = false;
                })
                .catch(err => {
                  this.listLoading2 = false;
                });
            })
            .catch(err => {});
        }
      }
    },
    getRequirementAchivements(id) {
      if (id == 1) {
        this.listLoading3 = true;
        getRequirementAchivement(id)
          .then(result => {
            this.requirementAchivementContent = result.data.data;

            this.listLoading3 = false;
            this.tableHead = [  {
          column_name: "achievementScore",
          column_comment: "目标"
        }]
            this.autoColumn();
          })
          .catch(err => {
            this.listLoading3 = false;
          });
      } else {
        if (this.requirementForm.courseId == "") {
          Message({
            type: "danger",
            message: "请输入课程",
            duration: 5 * 1000
          });
        } else {
          this.listLoading3 = true;
          getRequirementAchivement(this.requirementForm.courseId)
            .then(result => {
              this.requirementAchivementContent = result.data.data;
              this.listLoading3 = false;
              this.tableHead=[  {
          column_name: "achievementScore",
          column_comment: "目标"
        }];
              this.autoColumn();
            })
            .catch(err => {
              this.listLoading3 = false;
            });
        }
      }
    },
    getTotalAchivements() {
      this.listLoading4 = true;
      getTotalAchivement(1, 200)
        .then(result => {
          this.totalAchivementContent = result.data.data;
          this.tableHead2 = [{
          column_name: "achievementScore",
          column_comment: "目标"
        }];
          this.autoTotalColume();
          this.listLoading4 = false;
        })
        .catch(err => {
          this.listLoading4 = false;
        });
    },
    //动态生成全体的达成度的列
    autoTotalColume() {
      this.tableHead2.pop();
      this.totalAchivementContent[0].courseAchievementVOS.forEach(
        (item, index) => {
          this.tableHead2.push({
            column_name: `courseAchievementVOS[${index}].achievementValue`,
            column_comment: item.courseName
          });
        }
      );
    },
    //动态生成列
    autoColumn() {
      //生成动态列tableheader
      this.tableHead.pop();
      this.requirementAchivementContent[0].indicatorObjectiveVOs.forEach(
        (item, index) => {
          this.tableHead.push({
            column_name: `indicatorObjectiveVOs[${index}].courseObjectiveEntity.number`,
            column_comment: "目标"
          });
          this.tableHead.push({
            column_name: `indicatorObjectiveVOs[${index}].supportLevel`,
            column_comment: "支撑度"
          });
        }
      );
    }
  }
};
</script>

<style lang="less" scoped>
.admin {
  background-color: #f5f7fa;
}
</style>>
