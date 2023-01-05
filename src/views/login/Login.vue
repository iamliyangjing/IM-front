<template>
  <div>
    <Verify
        @success="success"
        :mode="this.pop"
        :captchaType="this.clickWord"
        :imgSize="{ width: '330px', height: '155px' }"
        ref="verify">
    </Verify>
    <div class="loginBox">
      <h3 class="loginTitle"> 欢迎登录 </h3>
      <el-form :model="ruleForm" status-icon :rules="rules"
              ref="ruleForm" class="demo-ruleForm">
        <el-form-item label="账号" prop="text" class="input-box">
          <el-input type="input" v-model="ruleForm.text" autocomplete="off" ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" class="input-box">
          <el-input type="password" v-model="ruleForm.password" autocomplete="off" ></el-input>
        </el-form-item>
        <el-form-item class="button-group">
          <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
      <div class="to-register-box">
        <el-link type="success" @click="toRegister" id="register">前往注册</el-link>
      </div>
      
    </div>
  </div>
</template>

<script>
//引入组件
import Verify from "../../components/verifition/Verify";
import {login} from "@/api/user";


export default {
  name: 'app',
  data() {
    return {
      clickWord: "blockPuzzle",
      pop:"pop",
      ruleForm: {
        text: '',
        password: '',
      },
      rules: {
        text: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 9, max: 15, message: '长度在 9到 15 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'change' }
        ]
      }
    }
  },
  components: {
    Verify
  },
  methods:{
    // eslint-disable-next-line no-unused-vars
    success(params){
      // params 返回的二次验证参数, 和登录参数一起回传给登录接口，方便后台进行二次验证
      // 登录
      login({userId: this.ruleForm.text.trim(),password:
        this.ruleForm.password,captchaVerification: params.captchaVerification}).then(response=>{
          console.log(response)
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          //调用验证码框
          this.$refs.verify.show()
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    toRegister(){
      this.$router.push("/register")
    }
  }
}
</script>

<style lang="less">
.loginBox {
  position: absolute;
  left: 0;
  top: 15%;
  bottom: 0;
  right: 0;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 400px;
  height: 450px;
  border: 1px solid #ccc;
  border-radius: 25px;
  box-shadow: 1px 1px 1px rgb(231, 231, 231);
  .input-box{
    display: flex;
    width: 350px;
    margin-top: 30px;
    margin-bottom: 30px;
    .el-input__inner{
    }
  }
  .loginTitle{

  }
  .button-group{
  display: flex;
  justify-content: space-around;
  .el-button{
    margin-right: 15px;
  }
 }
  .demo-ruleForm{
    width: 300px;
  }
  .to-register-box{
    margin-left: 160px;
  }
}
</style>
