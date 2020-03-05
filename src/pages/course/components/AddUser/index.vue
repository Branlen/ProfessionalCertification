
<template>
  <div class="add">
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="课程编号">
        <el-input v-model="form.number"></el-input>
      </el-form-item>
      <el-form-item label="课程名">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="理论学时">
        <el-input v-model="form.period"></el-input>
      </el-form-item>
      <el-form-item label="实验学时">
        <el-input v-model="form.experimentPeriod"></el-input>
      </el-form-item>
      <el-form-item label="学分">
        <el-input v-model="form.credit"></el-input>
      </el-form-item>
      <el-form-item label="课程性质">
        <el-input v-model="form.curriculum"></el-input>
      </el-form-item>
      <el-form-item label="课程类别">
        <el-input v-model="form.category"></el-input>
      </el-form-item>
      <el-form-item label="版本号">
        <el-input v-model="form.version"></el-input>
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
import { updateCourse,saveCourse } from "@/api/course";
export default {
  data() {
    return {
      form: {
          number: "",
          name: "",
          period: "",
          experimentPeriod: "",
          credit: "",
          curriculum: "",
          category: "",
          version: 2017,
          teacherId:'5'
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
       if(this.form==null||this.form.number==""||this.form.name==""||this.form.period==""||this.form.experimentPeriod==""
       ||this.form.credit==""||this.form.number==""||this.form.curriculum==""||this.form.category==""||this.form.version==""){
        Message({
              message: "信息未填完整",
              type: "info",
              duration: 5 * 1000
            }) 
      }else if(this.modifyData!=null){
        updateCourse(this.form).then((result) => {
          this.$emit("isEdit",false)
          Message({
              message: "修改成功",
              type: "success",
              duration: 5 * 1000
            })       
        }).catch((err) => {
          
        });
      }else{
          saveCourse(this.form).then((result) => {
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
    }
  }
};
</script>
<style lang="less" scoped>
.add {
  width: 40%;
  margin: 0 auto;
  border: 1px solid #e6dede;
  padding: 30px 20px;
  border-radius: 5px;
}
</style>