
<template>
  <div class="add">
    <el-form ref="form" :model="form"  label-width="80px">
      <!-- <el-form-item label="课程名" prop="courseName">
        <el-input v-model="form.courseName" placeholder="请填入课程名"></el-input>
      </el-form-item>
      <el-form-item label="考核方式" prop="pattern">
        <el-input v-model.number="form.pattern" placeholder="请填入考核方式"></el-input>
      </el-form-item>-->
      <!-- 增加课程细则方式 -->
      <div v-for="(course, index) in form.contentIndicator" :key="course.key">
        <el-form-item :label="'指标点' + index">
          <el-input v-model="course.number" placeholder="请填入指标点"></el-input>
        </el-form-item>
        <el-form-item :label="'指标内容'+ index" class="weightInput">
          <el-input v-model="course.content" placeholder="请输入指标内容" style="width:240px"></el-input>
        </el-form-item>
        <el-button class="dangerBut" type="danger" @click.prevent="removeCourseAndWeight(course)">删除</el-button>
      </div>

      <el-form-item>
        <el-button type="primary" @click="onSubmit" id="but">立即创建</el-button>
        <el-button @click="addCourseAndWeight">新增细则</el-button>
        <el-button @click="comeBack">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template> 
<script>
import { MessageBox, Message } from "element-ui";
import { updateIndicator, saveIndicator } from "@/api/indicator";
import { currentRoles } from "@/utils/auth";
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
        contentIndicator: [
          {
            number: "",
            content: "",
            requirementId: "0"
          }
        ]
      }
    };
  },
  props: {
    requirementId: "",
    modifyData: null
  },
  mounted() {
    console.log("tag", this.modifyData);
    if (this.modifyData != null) {
      this.form.contentIndicator.pop();
      this.form.contentIndicator.push(this.modifyData);
      var but = document.getElementById("but");
      but.innerText = "立即修改";
    }
  },
  methods: {
    onSubmit() {
      console.log("submit!");
      this.form.contentIndicator.forEach(item => {
        item.requirementId = this.requirementId;
        if (
          item== null ||
          item.content == "" ||
          item.number == ""
        ) {
          Message({
            message: "信息未填完整",
            type: "info",
            duration: 5 * 1000
          });
        } else if(this.modifyData!=null){
          delete item.graduationRequirementEntity
        updateIndicator(item).then((result) => {
          this.$emit("isEdit",false)
          Message({
              message: "修改成功",
              type: "success",
              duration: 5 * 1000
            })       
        }).catch((err) => {
          
        });
      }else{
          saveIndicator(item).then((result) => {
            console.log("新增成功")
            Message({
              message: "新增成功",
              type: "success",
              duration: 5 * 1000
            })
            this.$emit("isAdd",false)
          }).catch((err) => {
          });
      }
          
        
      });
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