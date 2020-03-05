
<template>
  <div class="add">
    <el-form ref="form" :model="form" :rules="rules"  label-width="100px">
      <el-form-item label="指标点" prop="indicator">
        <el-input v-model="form.indicator" placeholder="请填入指标点的内容"></el-input>
      </el-form-item>
      <el-form-item label="版本号" prop="version">
        <el-input v-model.number="form.version" placeholder="请填入版本号"></el-input>
      </el-form-item>

      <div v-for="(course, index) in form.courseAndWeight" :key="course.key">
        <el-form-item
          :label="'课程号' + index"
          prop="number"
        >
          <el-input v-model="course.number" placeholder="请填入课程编号"></el-input>
        </el-form-item>
        <el-form-item
          :label="'课程版本号' + index"
          prop="courseVersion"
        >
          <el-input v-model="course.version" placeholder="请填入课程版本号"></el-input>
        </el-form-item>
        <el-form-item :label="'权重'+ index" prop="weight" class="weightInput">
          <el-input v-model="course.weight" placeholder="权重值，课程权重之和不能超过1" style="width:220px"></el-input>
        </el-form-item>
        <el-button class="dangerBut" type="danger" @click.prevent="removeCourseAndWeight(course)">删除</el-button>
      </div>

      <el-form-item>
        <el-button type="primary" @click="onSubmit" id="but">立即创建</el-button>
        <el-button @click="addCourseAndWeight">新增课程及权重</el-button>
        <el-button @click="comeBack">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template> 
<script>
import { MessageBox, Message } from "element-ui";
export default {
  data() {
    var checkNumber = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('值不能为空'));
        }
        console.log(Number.isInteger(value));
        setTimeout(() => {
          if (!Number.isInteger((value+0))) {
            callback(new Error('请输入数字值'));
          } else {
            if (value < 2000||value>2050) {
              callback(new Error('输入必须为年份'));
            } else {
              callback();
            }
          }
        }, 800);
      };
    return {
      form: {
        indicator: "",
        version:"",
        courseAndWeight: [
          {
            number: "",
            version:"",
            weight: ""
          },
          {
            number: "",
            version:"",
            weight: ""
          }
        ]
      },
      rules:{
        indicator:[{required: true, message: '内容不能为空', trigger: 'blur' },],
        version:[    { validator: checkNumber, required:true, trigger: 'blur' },],
        number:[ {required: true, message: '课程编号不能为空', trigger: 'blur' },],
        courseVersion:[ {required: true, message: '课程编号不能为空', trigger: 'blur' }],
        weight:[
          {required: true, message: '权重不能为空', trigger: 'blur' }
        ]
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
    },
    comeBack() {
      if (this.modifyData != null) {
        this.$emit("isEdit", false);
      }
      this.$emit("isAdd", false);
    },
    removeCourseAndWeight(item) {
      var index = this.form.courseAndWeight.indexOf(item);
      if (index !== -1) {
        this.form.courseAndWeight.splice(index, 1);
      }
    },
    addCourseAndWeight() {
      this.form.courseAndWeight.push({
        courseName: "",
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