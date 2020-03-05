
<template>
  <div class="add">
    <el-form ref="form" :model="form" :rules="rules" label-width="90px">
      <el-form-item label="课程编号" prop="courseNum">
        <el-input v-model="form.courseNum" placeholder="请填入课程编号"></el-input>
      </el-form-item>
      <el-form-item label="版本号" prop="courseVersion">
        <el-input v-model.number="form.courseVersion" placeholder="请填入课程版本号"></el-input>
      </el-form-item>

      <div v-for="(course, index) in form.coursePattern" :key="course.key">
        <el-form-item :label="'考核方式' + index" label-width="90px">
          <el-input v-model="course.pattern" placeholder="请填入细则方式"></el-input>
        </el-form-item>
        <el-form-item :label="'权重'+ index" class="weightInput" label-width="90px">
          <el-input v-model="course.weight" placeholder="权重值，课程权重之和不能超过1" style="width:240px"></el-input>
        </el-form-item>
        <el-button class="dangerBut" type="danger" @click.prevent="removeCourseAndWeight(course)">删除</el-button>
      </div>
      <el-form-item label="版本号" prop="version">
        <el-input v-model.number="form.version" placeholder="请填入版本号"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit" id="but">立即创建</el-button>
        <el-button @click="addCourseAndWeight">新增考核方式</el-button>
        <el-button @click="comeBack">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template> 
<script>
import { MessageBox, Message } from "element-ui";
import { adjustWeight } from "@/utils/validate";
import $ from "jquery";
import {
  saveCourseAssessment,
  updateCourseAssessment
} from "@/api/courseAssessment";
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
        courseNum: "",
        version: "",
        courseVersion: "",
        coursePattern: [
          {
            pattern: "",
            weight: ""
          },
          {
            pattern: "",
            weight: ""
          }
        ]
      },
      rules: {
        pattern: [
          { required: true, message: "考核方式不能为空", trigger: "blur" }
        ],
        version: [{ validator: checkNumber, required: true, trigger: "blur" }],
        courseVersion: [
          { validator: checkNumber, required: true, trigger: "blur" }
        ],
        courseNum: [
          { required: true, message: "课程名不能为空", trigger: "blur" }
        ],
        weight: [{ required: true, message: "权重不能为空", trigger: "blur" }]
      }
    };
  },
  props: {
    modifyData: null
  },
  mounted() {
    console.log("tag", this.modifyData);
    if (this.modifyData != null) {
      var but = document.getElementById("but");
      but.innerText = "立即修改";
    }
  },
  methods: {
    onSubmit() {
      console.log("submit!");
      //判断权重是否加起来为1
      if (adjustWeight(this.form.coursePattern,"weight")) {
        //获得一个对象且内容'
        var len = this.form.coursePattern.length;
        var coursePattern = this.form.coursePattern;
        delete this.form.coursePattern;
        //生成多个form表单
        var formArr = [];
        for (var i = 0; i < len; i++) {
          var form = this.form;
          console.log("tag", i);
          form["pattern"] = coursePattern[i].pattern;
          form["weight"] = coursePattern[i].weight;
          var tempForm = $.extend(true, {}, form);
          formArr.push(tempForm);
        }

        //多次上传form表单
        formArr.forEach(item => {
          if (
            item == null ||
            item.number == "" ||
            item.version == "" ||
            item.content == "" ||
            item.courseNum == "" ||
            item.courseVersion == ""
          ) {
            Message({
              message: "信息未填完整",
              type: "info",
              duration: 5 * 1000
            });
          } else if (this.modifyData != null) {
            updateCourseAssessment(item)
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
            saveCourseAssessment(item)
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
        });
      } else {
        Message({
          type: "danger",
          message: "权重之和不为1",
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
      var index = this.form.coursePattern.indexOf(item);
      if (index !== -1) {
        this.form.coursePattern.splice(index, 1);
      }
    },
    addCourseAndWeight() {
      this.form.coursePattern.push({
        pattern: "",
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