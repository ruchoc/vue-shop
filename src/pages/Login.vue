<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="head" />
      </div>

      <!-- 表单 -->
      <el-form
        label-width="0px"
        class="login_form"
        :model="loginForm"
        :rules="loginFormRules"
				ref="loginFormRef"
      >
        <!-- 账号 -->
        <el-form-item prop="username">
          <el-input
            prefix-icon="iconfont icon-yonghu"
            v-model="loginForm.username"
          ></el-input>
        </el-form-item>

        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            type="password"
            prefix-icon="iconfont icon-mima"
            v-model="loginForm.password"
          ></el-input>
        </el-form-item>

        <!-- 按钮 -->
        <el-form-item class="login_buts">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
			// 绑定表单账户密码
      loginForm: {
        username: "admin",
        password: "123456",
      },

			// 验证规则
      loginFormRules: {
        username: [
          { required: true, message: "请输入用户名称", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入用户密码", trigger: "blur" },
          { min: 6, max: 15, message: "长度在 6 到 15 个字符", trigger: "blur" },
        ],
      },
    };
  },
	methods:{
		resetForm(){
			this.$refs.loginFormRef.resetFields()
		},
		login(){
			this.$refs.loginFormRef.validate(async valid=>{
				if(!valid) return;
				const {data:res}=await this.$http({
					url:'login',
					method:'post',
					data:this.loginForm
				})
				// const {data:res}=await this.$http.post('login',this.loginForm)
				if(res.meta.status!==200) this.$message.error('登录失败！')
				else this.$message.success('登录成功')

				window.sessionStorage.setItem('token',res.data.token)
				this.$router.push('/home')
			})
		}
	}
};
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}

.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }

  .login_form {
    position: absolute;
    bottom: 0%;
    width: 100%;
    padding: 20px;
    box-sizing: border-box;

    .login_buts {
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>
