
<template>
  <div class="add">
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="学生">
        <el-select v-model="form.studentId" placeholder="请选择学生" aria-label="学生" class="seletct">
          <div v-for="course in studentArr" :key="course.studentId">
            <el-option :label="course.name" :value="course.studentId"></el-option>
          </div>
        </el-select>
      </el-form-item>
      <el-form-item label="课程">
        <el-select v-model="form.courseId" placeholder="请选择课程" aria-label="课程" class="seletct">
          <div v-for="course in courseArr" :key="course.courseId">
            <el-option :label="course.name +course.version" :value="course.courseId"></el-option>
          </div>
        </el-select>
      </el-form-item>
      <el-form-item label="教师">
        <el-select v-model="form.teacherId" placeholder="请选择教师" aria-label="课程" class="seletct">
          <div v-for="teacher in teacherArr" :key="teacher.teacherId">
            <el-option :label="teacher.name" :value="teacher.teacherId"></el-option>
          </div>
        </el-select>
      </el-form-item>
      <el-form-item label="学期">
        <el-select v-model="form.semester" placeholder="请选择学期时间">
          <el-option label="2016~2017第二学期" value="2016~2017第二学期"></el-option>
          <el-option label="2016~2017第一学期" value="2016~2017第一学期"></el-option>
          <el-option label="2017~2018第一学期" value="2017~2018第一学期"></el-option>
          <el-option label="2017~2018第二学期" value="2017~2018第二学期"></el-option>
          <el-option label="2018~2019第一学期" value="2018~2019第一学期"></el-option>
          <el-option label="2018~2019第二学期" value="2018~2019第二学期"></el-option>
          <el-option label="2019~2020第一学期" value="2019~2020第一学期"></el-option>
          <el-option label="2019~2020第二学期" value="2019~2020第二学期"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="课程负责人" label-width="90px">
        <el-radio-group v-model="form.isLeader">
          <el-radio label="1">是</el-radio>
          <el-radio label="0">否</el-radio>
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
import { saveClassSchedule, updateClassSchedule } from "@/api/courseSchedule";
import { getCourseInfo } from "@/api/course";
import { getTeacherInfo } from "@/api/teacher";
import { getStuedentInfo } from "@/api/student";
export default {
  data() {
    return {
      form: {
        studentId: "",
        courseId: "",
        teacherId: "",
        semester: "",
        isLeader: ""
      },
      courseArr: [],
      studentArr: [],
      teacherArr: []
    };
  },
  props: {
    modifyData: null
  },
  created() {
    this.getCourseTeacherClass();
  },
  mounted() {
    console.log("tag", this.modifyData);
    if (this.modifyData != null) {
      this.form = this.modifyData;
      this.$set(this.form,"studentId",this.form.studentInfoEntity.studentId);
      this.$set(this.form,"studentName",this.form.studentInfoEntity.name);
      this.$set(this.form,"courseId",this.form.courseEntity.courseId);
      this.$set(this.form,"teacherId",this.form.teacherInfoEntity.teacherId);
      this.form.isLeader = this.form.isLeader.toString();
      var but = document.getElementById("but");
      but.innerText = "立即修改";
    }
  },
  methods: {
    getCourseTeacherClass() {
      getCourseInfo({ pageNum: 1, pageSize: 200 })
        .then(result => {
          this.courseArr = result.data.data.list;
        })
        .catch(err => {});
      getTeacherInfo({ pageNum: 1, pageSize: 200 })
        .then(result => {
          this.teacherArr = result.data.data.list;
        })
        .catch(err => {});
      getStuedentInfo({ pageNum: 1, pageSize: 200 })
        .then(result => {
          this.studentArr = result.data.data.list;
        })
        .catch(err => {});
    },
    onSubmit() {
      console.log("submit!");
      if (
        this.form == null ||
        this.form.studentName == "" ||
        this.form.courseName == "" ||
        this.form.teacherName == "" ||
        this.form.semester == "" ||
        this.form.is_leader == ""
      ) {
        Message({
          message: "信息未填完整",
          type: "info",
          duration: 5 * 1000
        });
      } else if (this.modifyData != null) {
        updateClassSchedule(this.form)
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
        saveClassSchedule(this.form)
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
  }
};
</script>
<style lang="less" scoped>
.add {
  width: 30%;
  margin: 0 auto;
  border: 1px solid #e6dede;
  padding: 30px 70px;
  border-radius: 5px;
}
</style>