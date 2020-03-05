
<template>
  <div class="add">
    <el-form ref="form" :model="form" :rules="rules" label-width="110px">
      <el-form-item label="毕业要求点" prop="number">
        <el-input v-model.number="form.number" placeholder="请填入毕业要求点" class=""></el-input>
      </el-form-item>
      <el-form-item label="毕业要求内容" prop="content">
        <el-input v-model="form.content" placeholder="请填入毕业要求内容" type="textarea"></el-input>
      </el-form-item>
      <el-form-item label="版本号" prop="version">
        <el-input v-model.number="form.version" placeholder="请填入版本号"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit" id="but">立即创建</el-button>
        <el-button @click="comeBack">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template> 
<script>
import { MessageBox, Message } from "element-ui";
import {updateGraduateRequirement,saveGraduateRequirement} from "@/api/graduateRequirement"
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
    var checkNumber2 = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("值不能为空"));
      }
      console.log(Number.isInteger(value));
      setTimeout(() => {
        if (!Number.isInteger(value + 0)) {
          callback(new Error("请输入数字值"));
        } else {
          callback();
        }
      }, 800);
    };
    return {
      form: {
        number: "",
        version: "",
        content: ""
      },
      rules: {
        number: [{ validator: checkNumber2, required: true, trigger: "blur" }],
        version: [{ validator: checkNumber, required: true, trigger: "blur" }],
        content: [{ required: true, message: "毕业要求内容不能为空", trigger: "blur" }],
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
      this.form = this.modifyData;
      var but = document.getElementById("but");
      but.innerText = "立即修改";
    }
  },
  methods: {
    onSubmit() {
      if(this.form==null||this.form.number==""||this.form.version==""||this.form.content==""){
        Message({
              message: "信息未填完整",
              type: "info",
              duration: 5 * 1000
            }) 
      }else if(this.modifyData!=null){
        updateGraduateRequirement(this.form).then((result) => {
          this.$emit("isEdit",false)
          Message({
              message: "修改成功",
              type: "success",
              duration: 5 * 1000
            })       
        }).catch((err) => {
          
        });
      }else{
          saveGraduateRequirement(this.form).then((result) => {
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
@keyframes myfirst /* Opera */ {
  from {
    background: red;
  }
  to {
    background: yellow;
  }
}
@keyframes shake {
  to {
    transform: scale(1.01);
  }
  25% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.01);
  }
  75% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.01);
  }
}
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