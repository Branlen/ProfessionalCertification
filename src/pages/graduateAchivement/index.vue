<template>
  <div class="admin">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="毕业要求达成度管理" name="third">
        <div class="requirementAchivement">
          <el-form :inline="true" :model="requirementForm" class="demo-form-inline">
            <el-form-item label="课程">
              <el-select v-model="requirementForm.courseId" placeholder="请输入课程 " class="seletct">
                <div v-for="course in courseArr" :key="course.courseId">
                  <el-option :label="course.name+course.version" :value="course.courseId"></el-option>
                </div>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="getRequirementAchivements">查询</el-button>
            </el-form-item>
          </el-form>
          <el-table
            v-loading="listLoading3"
            highlight-current-row
            :data="requirementAchivementContent"
            stripe
            style="width: 100%"
          >
            <el-table-column prop="indicatorEntity.number" label="支撑指标点" width="180"></el-table-column>
            <template v-for="(item,index) in tableHead">
              <el-table-column :prop="item.column_name" :label="item.column_comment" :key="index"></el-table-column>
            </template>
            <el-table-column prop="achievementScore" label="毕业要求达成度分值"></el-table-column>
            <el-table-column prop="weight" label="权重"></el-table-column>
            <el-table-column prop="achievementValue" label="毕业要求达成度"></el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
      <el-tab-pane label="总体达成度管理" name="fourth">
        <div class="totalAchivement">
          <el-table
            v-loading="listLoading4"
            highlight-current-row
            :data="totalAchivementContent"
            stripe
            style="width: 100%"
          >
            <el-table-column prop="indicatorEntity.number" label="毕业要求指标点" width="180"></el-table-column>
            <el-table-column prop="indicatorEntity.content" label="毕业要求指标点内容" width="680"></el-table-column>
            <template v-for="(item,index) in tableHead2">
              <el-table-column :prop="item.column_name" :label="item.column_comment" :key="index"></el-table-column>
            </template>
            <el-table-column prop="totalValue" label="达成度"></el-table-column>
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
  postRequirementCalculate
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
      activeName: "third",
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
      this.getCourseTeacher();
      this.getRequirementAchivements(1);
      this.getTotalAchivements();
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

    getRequirementAchivements(id) {
      if (id == 1) {
        this.listLoading3 = true;
        getRequirementAchivement(id)
          .then(result => {
            this.requirementAchivementContent = result.data.data;
            this.tableHead =[{
          column_name: "achievementScore",
          column_comment: "目标"
        }]
            this.listLoading3 = false;
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
          postRequirementCalculate(this.requirementForm.courseId)
            .then(result => {
              getRequirementAchivement(this.requirementForm.courseId)
                .then(result => {
                  Message({
                    type: "success",
                    message: "更新成功",
                    duration: 5 * 1000
                  });
                  this.requirementAchivementContent = result.data.data;
                  this.listLoading3 = false;
                this.tableHead = [{
          column_name: "achievementScore",
          column_comment: "目标"
        }]
                  this.autoColumn();
                })
                .catch(err => {
                  this.listLoading3 = false;
                });
            })
            .catch(err => {});
        }
      }
    },
    getTotalAchivements() {
      this.listLoading4 = true;
      getTotalAchivement(1, 200)
        .then(result => {
          this.totalAchivementContent = result.data.data;
          this.tableHead2=[{
          column_name: "achievementScore",
          column_comment: "目标"
        }]
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
