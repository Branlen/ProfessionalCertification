
<template>
  <div class="add">
    <el-form ref="form" :model="form"  label-width="80px">
      <!-- <el-form-item label="课程名" prop="courseName">
        <el-input v-model="form.courseName" placeholder="请填入课程名"></el-input>
      </el-form-item>
      <el-form-item label="考核方式" prop="pattern">
        <el-input v-model.number="form.pattern" placeholder="请填入考核方式"></el-input>
      </el-form-item> -->
      <!-- 增加课程细则方式 -->
      <div v-for="(course, index) in form.courseRules" :key="course.courseAssessmentRuleId">
        <el-form-item :label="'细则' + index" >
          <el-input v-model="course.detail" placeholder="请填入细则内容"></el-input>
        </el-form-item>
        <el-form-item :label="'权重'+ index"  class="weightInput">
          <el-input v-model="course.weight" placeholder="权重值，课程权重之和不能超过1" style="width:240px"></el-input>
        </el-form-item>
        <el-button class="dangerBut" type="danger" @click.prevent="removeCourseAndWeight(course)">删除</el-button>
      </div>

      <el-form-item>
        <el-button type="primary" @click="onSubmit" id="but">立即保存</el-button>
        <el-button @click="addCourseAndWeight">新增细则</el-button>
        <el-button @click="comeBack">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template> 
<script>
import { MessageBox, Message } from "element-ui";
import { adjustWeight, isRepeat } from "@/utils/validate";
import {deleteCourseAssessmentRule,saveCourseAssessmentRule} from "@/api/courseAssessmentRules"
export default {
  data() {
    var checkNumber = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("值不能为空"));
      }
      console.log(Number.isInteger(value));
      setTimeout(() => {
        if (!Number.isInteger(value + 0)) {
          callback(new Error("请输入数字值"));
        } else {
          if (value < 2000 || value > 2050) {
            callback(new Error("输入必须为年份"));
          } else {
            callback();
          }
        }
      }, 800);
    };
    return {
      form: {
        // courseName: "",
        // pattern: "",
        courseRules: [
          {
            detail: "",
            weight: ""
          },
        ]
      },
      currentCourseAssessmentRuleArr:[]
    };
  },
  props: {
    modifyData: null,
    rulesContent:{},
  },
  created() {
    this.form.courseRules = this.rulesContent; 
    this.rulesContent.forEach(item=>{
      this.currentCourseAssessmentRuleArr.push(item.courseAssessmentRuleId);
    })
  },
  methods: {
    onSubmit() {
      console.log("submit!");
      //判断权重是否加起来为1
      //判断权重是否为1，课程是否重复
      if (adjustWeight(this.form.courseRules, "weight")) {
        if (isRepeat(this.form.courseRules, "detail")) {
          Message({
            message: "课程细则内容有重复，请查验后重新输入",
            type: "info",
            duration: 5 * 1000
          });
        } else {
          if (!this.currentCourseAssessmentRuleArr) {
            this.form.courseRules.forEach(item => {
              this.$set(item, "courseAssessmentId", this.rulesContent[0].courseAssessmentId);
              saveCourseAssessmentRule(item)
                .then(result => {
                  Message({
                    message: "保存成功",
                    type: "success",
                    duration: 5 * 1000
                  });
                  this.$emit("isAdd",false)
                })
                .catch(err => {});
            });
          } else {
            deleteCourseAssessmentRule(this.currentCourseAssessmentRuleArr)
              .then(result => {
                this.form.courseRules.forEach(item => {
                  this.$set(item, "courseAssessmentId", this.rulesContent[0].courseAssessmentId);
                  saveCourseAssessmentRule(item)
                    .then(result => {
                      Message({
                        message: "保存成功",
                        type: "success",
                        duration: 5 * 1000
                      });
                      this.$emit("isAdd",false)
                    })
                    .catch(err => {});
                });
              })
              .catch(err => {});
          }
          
        }
      } else {
        Message({
          message: "权重之和不为1，请查验后重新输入",
          type: "info",
          duration: 5 * 1000
        });
      }
    
    },
    comeBack() {
      if (this.modifyData != null) {
        this.$emit("isEdit", false);
      }
      this.$emit("isAdd", false);
    },
    removeCourseAndWeight(item) {
      var index = this.form.courseRules.indexOf(item);
      if (index !== -1) {
        this.form.courseRules.splice(index, 1);
      }
    },
    addCourseAndWeight() {
      this.form.courseRules.push({
        detail: "",
        weight: "",
        key: Date.now()
      });
    }
  }
};
</script>
<style lang="less" scoped>
.add {
  width: 50%;
  margin: 0 auto;
  border: 1px solid #e6dede;
  padding: 30px 20px;
  border-radius: 5px;
}
.weightInput {
  display: inline-block;
}
.dangerBut {
  float: right;
}
</style>