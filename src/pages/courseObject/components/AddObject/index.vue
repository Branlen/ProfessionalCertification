
<template>
  <div class="add">
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <!-- 增加课程方式 -->
      <div v-for="(course, index) in form.courseObjective" :key="course.key">
        <el-form-item :label="'目标号' + index">
          <el-input v-model="course.number" placeholder="请填入目标号"></el-input>
        </el-form-item>
        <el-form-item :label="'目标内容'+ index" class="weightInput">
          <el-input v-model="course.objective" placeholder="请输入目标内容" style="width:240px"></el-input>
        </el-form-item>
        <el-button class="dangerBut" type="danger" @click.prevent="removeCourseAndWeight(course)">删除</el-button>
      </div>

      <el-form-item>
        <el-button type="primary" @click="onSubmit" id="but">立即创建</el-button>
        <el-button @click="addCourseAndWeight">新增目标</el-button>
        <el-button @click="comeBack">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template> 
<script>
import { MessageBox, Message } from "element-ui";
import {
  saveCourseObjective,
  updateCourseObjective
} from "@/api/courseObjective";
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
        courseObjective: [
          {
            objective: "",
            number: ""
          }
        ]
      },
      //选择哪一门course的主要内容
      rules: {
        numbers: [
          { required: true, message: "目标号不能为空", trigger: "blur" }
        ],
        courseName: [
          { required: true, message: "课程编号不能为空", trigger: "blur" }
        ],
        objective: [
          { required: true, message: "目标内容不能为空", trigger: "blur" }
        ],
        version: [
          { required: true, message: "版本号不能为空", trigger: "blur" }
        ]
      }
    };
  },
  props: {
    courseID: "",
    modifyData: null
  },
  mounted() {
    console.log("tag", this.modifyData);
    if (this.modifyData != null) {
      this.form.courseObjective.pop();
      this.form.courseObjective.push(this.modifyData)
      var but = document.getElementById("but");
      but.innerText = "立即修改";
    }
  },
  methods: {
    onSubmit() {
      console.log("submit!");
      //判断权重是否加起来为1

      if (
        this.form == null ||
        this.form.courseObjective.number == "" ||
        this.form.courseObjective.objective == ""
      ) {
        Message({
          message: "信息未填完整",
          type: "info",
          duration: 5 * 1000
        });
      } else {
        this.form.courseObjective.forEach(
          item => {item["courseId"] = this.courseID}
        );
        var objective = this.form.courseObjective
        console.log("tags",objective);
        for (var i = 0; i < objective.length; i++) {
          var content = objective[0];
          console.log(content);
          if (this.modifyData != null) {
            updateCourseObjective(content)
              .then(result => {
                this.$emit("isEdit", false);
                Message({
                  message: "修改成功",
                  type: "success",
                  duration: 5 * 1000
                });
              })
              .catch(err => {});
          } else {
            saveCourseObjective(content)
              .then(result => {
                console.log("新增成功");
                Message({
                  message: "新增成功",
                  type: "success",
                  duration: 5 * 1000
                });
                this.$emit("isAdd", false);
              })
              .catch(err => {});
          }
        }
      }
    },
    comeBack() {
      if (this.modifyData != null) {
        this.$emit("isEdit", false);
      }
      this.$emit("isAdd", false);
    },
    removeCourseAndWeight(item) {
      var index = this.form.courseObjective.indexOf(item);
      if (index !== -1) {
        this.form.courseObjective.splice(index, 1);
      }
    },
    addCourseAndWeight() {
      this.form.courseObjective.push({
        objective: "",
        number: "",
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