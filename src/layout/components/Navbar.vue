<template>
  <div class="navbar">
    <hamburger
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <!-- :src="avatar+'?imageView2/1/w/80/h/80'" 暂时修改一下图片-->
          <img src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1570599891341&di=58fb2a3a06ea4cfefe6a1400d9e08526&imgtype=0&src=http%3A%2F%2Fimg.hpoi.net%2Fgk%2Fpic%2Fn%2F2015%2F07%2F307c4a8da33d4f629e02cab7ba309ffc.jpg" class="user-avatar" />
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu>
          <el-dropdown-item>
            <span style="display:block;" @click="logout">个人信息</span>
          </el-dropdown-item>           
          <el-dropdown-item divided>
            <span style="display:block;" @click="logout">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  computed: {
    ...mapGetters(["sidebar", "avatar"])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },
    async logout() {
      this.$router.push('/login')
      await this.$store.dispatch("user/logout").then((result) => {
        this.$notify({
              title:'成功',
              message:"退出成功",
              type:'success'
            })
      }).catch((err) => {
        
      });;
      this.$router.push(`/login?redirect=${this.$route.fullPath}`);
    }
  }
};
</script>
<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
