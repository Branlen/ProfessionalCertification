
<template>
  <div class="add">
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="教师编号" prop="number">
        <el-input v-model="form.number"></el-input>
      </el-form-item>
      <el-form-item label="教师名" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password"></el-input>
      </el-form-item>
      <el-form-item label="角色" prop="roles">
        <el-checkbox-group v-model="form.roleIds" type="number">
          <el-checkbox label=1  name="type">超级管理员</el-checkbox>
          <el-checkbox label=2 name="type">课程负责人</el-checkbox>
          <el-checkbox label=3 name="type">课程建设者</el-checkbox>
          <el-checkbox label=4 name="type">普通教工</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="状态" prop="state">
        <el-radio-group v-model="form.state">
          <el-radio label="1" type="number">在职</el-radio>
          <el-radio label="2" type="number">离职</el-radio>
        </el-radio-group>
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
import { saveTeacher, updateTeacher ,updateTeacherRole,saveTeacherRole} from "@/api/teacher.js";
export default {
  data() {
    return {
      form: {
        name: "",
        password: "",
        state: "",
        number: "",
        roleIds: []
      },
      rules: {
        name: [{ required: true, message: "教师名不能为空", trigger: "blur" }],
        number: [
          { required: true, message: "教师编号不能为空", trigger: "blur" }
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" }
        ],
        state: [{ required: true, message: "状态不能为空", trigger: "blur" }],
        roles: [{ required: true, message: "角色不能为空", trigger: "blur" }]
      }
    };
  },
  props: {
    modifyData: null
  },
  mounted() {
    if (this.modifyData != null) {
      this.form = this.modifyData;
      this.$set(this.form,"roleIds",[])
      this.form.state = this.form.state.toString()
      this.form.roleEntityList.forEach(item=>{
        this.form.roleIds.push(item.roleId.toString())})
      var but = document.getElementById("but");
      but.innerText = "立即修改";
    }
  },

  methods: {
    onSubmit() {
      this.form.roleIds.forEach(item=> item = parseInt(item))
      if (
        this.form == null ||
        this.form.number == "" ||
        this.form.name == "" ||
        this.form.password == "" ||
        this.form.state == "" ||
        this.form.roleIds == ""
      ) {
        Message({
          message: "信息未填完整",
          type: "info",
          duration: 5 * 1000
        });
      } else if (this.modifyData != null) {
        updateTeacher(this.form)
          .then(result => {
            this.$emit("isEdit", false);
            Message({
              message: "修改成功",
              type: "success",
              duration: 5 * 1000
            });
          })
          .catch(err => {});
          
          this.form.roleIds.forEach(item=>{
            console.log(item);
             updateTeacherRole({
               teacherId:this.form.teacherId,
               roleId:item
             }).then((result) => {
            
          }).catch((err) => {
            
          });
          })
         
      } else {
        saveTeacher(this.form)
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
    },
    comeBack() {
      if (this.modifyData != null) {
        this.$emit("isEdit", false);
      }
      this.$emit("isAdd", false);
    }
    //增删改查操作
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