<template>
  <div>
    <Verify
        @success="success"
        :mode="this.pop"
        :captchaType="this.clickWord"
        :imgSize="{ width: '330px', height: '155px' }"
        ref="verify">
    </Verify>
    <el-card class="box-card">
    <el-form :model="ruleForm" status-icon :rules="rules"
             ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="账号" prop="text" >
        <el-input type="input" v-model="ruleForm.text" autocomplete="off" style="width: 500px;"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="ruleForm.password" autocomplete="off" style="width: 500px;"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
    </el-card>
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
    }
  }
}
</script>

<style>
.demo-ruleForm{
  margin-right: auto;
  margin-left: auto;
  text-align: center;
}
.box-card {
  width: 480px;
}
</style>
