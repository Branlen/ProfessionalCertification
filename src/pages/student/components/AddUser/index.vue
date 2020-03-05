
<template>
  <div class="add">
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="学生号">
        <el-input v-model="form.number"></el-input>
      </el-form-item>
       <el-form-item label="学生名">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
       <el-form-item label="专业">
        <el-input v-model="form.major"></el-input>
      </el-form-item>
      <el-form-item label="届别">
        <el-input v-model="form.grade"></el-input>
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
import {saveStuedent,updateStuedent} from "@/api/student"
export default {
  data() {
    return {
      form: {
        name: "",
        number: "",
        major: "",
        grade: "",
       
      }
    };
  },
  props:{
    modifyData:null
  },
  mounted(){
     
    console.log("tag",this.modifyData);
    if(this.modifyData!=null){
      this.form = this.modifyData
      var but = document.getElementById("but")
      but.innerText = "立即修改"
    }
  },
  methods: {
    onSubmit() {
      if(this.form==null||this.form.number==""||this.form.name==""||this.form.major==""||this.form.grade==""){
        Message({
              message: "信息未填完整",
              type: "info",
              duration: 5 * 1000
            }) 
      }else if(this.modifyData!=null){
        updateStuedent(this.form).then((result) => {
          this.$emit("isEdit",false)
          Message({
              message: "修改成功",
              type: "success",
              duration: 5 * 1000
            })       
        }).catch((err) => {
          
        });
      }else{
          saveStuedent(this.form).then((result) => {
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
    comeBack(){
      if(this.modifyData!=null){
        this.$emit("isEdit",false)
      }
      this.$emit("isAdd",false)
    }
  }
};
</script>
<style lang="less" scoped>
  .add{
    width: 40%;
    margin: 0 auto;
    border: 1px solid #e6dede;
    padding: 30px 20px;
    border-radius: 5px;
  }
</style>