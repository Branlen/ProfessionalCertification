<template>
  <div class="admin">
    <div class="downloadScoreTemplate">
      <el-form :inline="true" :model="queryForm" class="demo-form-inline">
        <el-form-item label="课程">
          <el-select v-model="queryForm.courseId" placeholder="请输入课程 " class="seletct">
            <div v-for="course in courseArr" :key="course.courseId">
              <el-option :label="course.name+course.version" :value="course.courseId"></el-option>
            </div>
          </el-select>
        </el-form-item>
        <el-form-item label="教工">
          <el-select v-model="queryForm.teacherId" placeholder="请输入教工号 " class="seletct">
            <div v-for="teacher in teacherArr" :key="teacher.teacherId">
              <el-option :label="teacher.name" :value="teacher.teacherId"></el-option>
            </div>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="querySchedule">下载成绩填写模板</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="updateScore">
      <el-form :inline="true" :model="uploadForm" class="demo-form-inline">
        <el-form-item label="课程">
          <el-select v-model="uploadForm.courseId" placeholder="请输入课程 " class="seletct">
            <div v-for="course in courseArr" :key="course.courseId">
              <el-option :label="course.name+course.version" :value="course.courseId"></el-option>
            </div>
          </el-select>
        </el-form-item>
        <el-form-item label="教工">
          <el-select v-model="uploadForm.teacherId" placeholder="请输入教工号 " class="seletct">
            <div v-for="teacher in teacherArr" :key="teacher.teacherId">
              <el-option :label="teacher.name" :value="teacher.teacherId"></el-option>
            </div>
          </el-select>
        </el-form-item>
        <el-form-item>
          <!-- <input type="file" class="filebutton" @change="getFile($event)" /> -->
          <el-upload class="upload-demo" action :auto-upload="false">
            <el-button slot="trigger" type="primary">选取文件</el-button>
            <el-button style="margin-left: 10px;" type="success" @click="submitUpload">上传成绩</el-button>
            <div slot="tip" class="el-upload__tip">只能上传excel文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
        <!-- <el-form-item>
          <el-button style="margin-left: 10px;" type="success" @click="submitUpload($event)">上传成绩</el-button>
        </el-form-item>-->
      </el-form>
    </div>
  </div>
</template>

<script>
import { getCourseInfo } from "@/api/course";
import { getTeacherInfo } from "@/api/teacher";
import { downloadScoreTemp, saveCourseScore } from "@/api/score";
import { Message } from "element-ui";
import { currentRoles } from "@/utils/auth";
export default {
  data() {
    return {
      queryForm: {
        courseId: "",
        teacherId: ""
      },
      uploadForm: {
        courseId: "",
        teacherId: ""
      },
      file: "",
      courseArr: [],
      teacherArr: []
    };
  },
  created() {
    var role = currentRoles();
    console.log(role);
    if (role != "admin"&&role!="teacher") {
      Message({
        message: "你没有访问的权限",
        type: "success",
        duration: 5 * 1000
      });
       this.$router.push("/");
    } else {
      console.log("creadted");
      this.getCourseTeacher();
    }
    
  },
  methods: {
    getCourseTeacher() {
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
    },
    querySchedule() {
      downloadScoreTemp(this.queryForm.teacherId, this.queryForm.courseId)
        .then(result => {
          var blob = new Blob([result.data]);
          //获取文件名
          var filename = decodeURI(
            result.headers["content-disposition"].split(";")[1]
          ).split("=")[1];
          //执行下载操作
          console.log(filename);
          if (window.navigator.msSaveOrOpenBlob) {
            navigator.msSaveBlob(blob, filename);
          } else {
            var a = document.createElement("a");
            a.download = filename;
            a.href = window.URL.createObjectURL(blob);
            a.click();
          }
        })
        .catch(err => {});
    },

    getFile(e) {
      this.file = e.target.files[0];
      console.log(e.target);
    },
    submitUpload(event) {
      var files = document.getElementsByTagName("input");
      console.log(files[files.length - 1].files[0]);
      this.file = files[files.length - 1].files[0];
      event.preventDefault();
      let formData = new FormData();
      formData.append("file", this.file);
      saveCourseScore(5, 1, formData)
        .then(result => {
          Message({
            type: "success",
            message: "上传成功",
            duration: 5 * 1000  
          });
        })
        .catch(err => {});
    }
  }
};
</script>

<style lang="less" scoped>
</style>>