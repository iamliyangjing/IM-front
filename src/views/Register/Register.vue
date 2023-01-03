<template>
  <div>
    <el-card class="box-card">
      <div style="width: 400px; margin: 100px auto" >
        <el-steps :active="active" finish-status="success">
          <el-step title="验证邮箱"></el-step>
          <el-step title="填写账号"></el-step>
          <el-step title="注册成功"></el-step>
        </el-steps>
        <div id="title">注册你的即时账号</div>
          <span style="font-family: 'Helvetica Neue';">已有账号？</span>
          <el-link type="primary" @click="toLogin">前往登录 >></el-link>
        <el-form ref="form" :model="registerUserInfo" size="normal" label-width="80px" :rules="rules" v-if="active==0">
          <el-form-item prop="email" label="邮箱">
            <el-input prefix-icon="el-icon-message" v-model="registerUserInfo.email" placeholder="输入邮箱"></el-input>
          </el-form-item>
          <el-form-item prop="vertifycode" label="验证码" placeholder="输入验证码" >
            <el-input prefix-icon="el-icon-lock" v-model="registerUserInfo.vertifyCode" :disabled="inputDisabled" style="width: 120px"></el-input>
            <el-button type="primary" plain style="margin-left: 50px" @click="send" :disabled="Disabled">{{vertify}}</el-button>
          </el-form-item>
          <el-form-item>
            <el-button style="width: 100%" type="primary" @click="next1"  v-if="active==0 || active==1">下一步</el-button>
          </el-form-item>
        </el-form>

        <el-form :model="userInfoFrom" status-icon :rules="userInfoFromRules" ref="userInfoFromRules" label-width="100px" class="userInfo-ruleForm" v-if="active==1">
          <el-form-item label="姓名" prop="age">
            <el-input v-model.number="userInfoFrom.age"></el-input>
          </el-form-item>
          <el-form-item label="身份证号" prop="identityCard">
            <el-input v-model.number="userInfoFrom.identityCard"></el-input>
          </el-form-item>
          <el-form-item label="地址" prop="address">
            <el-input v-model.number="userInfoFrom.address"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="userInfoFrom.pass" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="checkPassword">
            <el-input type="password" v-model="userInfoFrom.checkPass" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button style="width: 100%" type="primary" @click="next2"  v-if="active==0 || active==1">下一步</el-button>
          </el-form-item>
        </el-form>

        <div v-if="active==2">
          <span>恭喜你注册成功！您的账号为?????（未写）</span>
        </div>
        <el-button style="width: 100%" type="primary" @click="last"  v-if="active==1">上一步</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Register",
  data(){
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.userInfoFrom.checkPass !== '') {
          this.$refs.userInfoFromRules.validateField('checkPass');
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.userInfoFrom.pass) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return{
      //步骤条
      active:0,
      registerUserInfo:{},
      vertify:'发送验证码',
      Disabled:false,
      inputDisabled:true,
      time:60,
      timer:'',
      codeFrom:true,
      userInfoFrom:{
        checkPass:"",
        identityCard:"",
        name:"",
        address:"",
        pass:""
      },
      rules:{
        email: [
          {required:true,
            validator: (rule, value, callback) => {
              if (value === "") {
                this.$message.error("邮件地址不能为空");
                return;
              }
              if (
                  !/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(
                      value
                  )
              ) {
                this.$message.error("邮箱格式不正确");
                return;
              }
              callback();
            },
            trigger: "click",
          }
        ],
      },
      userInfoFromRules:{
        password: [
          { validator: validatePass, trigger: 'blur' }
        ],
        checkPassword: [
          { validator: validatePass2, trigger: 'blur' }
        ],
      }
    }
  },
  methods:{
    send(){
      this.$refs['form'].validate((valid) =>{
        if(valid){
          this.Disabled=true
          this.time=60
          this.inputDisabled=false
          this.timer = setInterval(this.subtime, 1000)
          this.$axios.post("/mail",this.form).then(res =>{
            this.$message({
              message: res.data.data,
              type: 'success'
            });
          })
        }
      })
    },
    subtime(){
      this.vertify= this.time+'秒后重新获取'
      this.time=this.time-1
      if(this.time===0){
        this.Disabled=false
        this.inputDisabled=true
        this.vertify='发送验证码'
        this.form.vertifyCode=''
        clearInterval(this.timer)
      }
    },
    toLogin(){
      this.$router.push('/login')
    },
    next1() {
      //校验验证码是否正确
      if (this.active++ > 2) this.active = 0;
    },
    next2() {
      //提交个人信息
      if (this.active++ > 2) this.active = 0;
    },
    last(){
      if (this.active-- < 0) this.active = 0;
    }
  }
}
</script>

<style scoped>
.box-card {
  width: 600px;
}
#title{
  font-family: SourceHanSansCN_Bold;
  font-size:30px;
  line-height: 2.857rem;
  text-align: center;
  padding: 30px 0
}
</style>
