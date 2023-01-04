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
          <span style="font-family: 'Helvetica Neue';" v-if="havaUserId==1">已有账号？</span>
          <el-link type="primary" @click="toLogin">前往登录 >></el-link>

        <!--        first-->
        <el-form ref="form" :model="registerUserInfo" size="normal" label-width="80px" :rules="rules" v-if="active==0">
          <el-form-item prop="email" label="邮箱">
            <el-input prefix-icon="el-icon-message" v-model="registerUserInfo.email" placeholder="输入邮箱"></el-input>
          </el-form-item>
          <el-form-item prop="vertifyCode" label="验证码" placeholder="输入验证码" >
            <el-input ref="vertifyCode" prefix-icon="el-icon-lock" v-model="registerUserInfo.vertifyCode" :disabled="inputDisabled" style="width: 120px"></el-input>
            <el-button type="primary" plain style="margin-left: 50px" @click="send" :disabled="Disabled">{{vertify}}</el-button>
          </el-form-item>
          <el-form-item>
            <el-button style="width: 100%" type="primary" @click="next1"  v-if="active==0 || active==1">下一步</el-button>
          </el-form-item>
        </el-form>


        <!--        second -->
        <el-form :model="userInfoFrom" status-icon :rules="userInfoFromRules" ref="userInfoFrom" label-width="100px" class="userInfo-ruleForm" v-if="active==1">
          <el-form-item label="姓名" prop="username">
            <el-input v-model.number="userInfoFrom.username"></el-input>
          </el-form-item>
          <el-form-item label="身份证号" prop="identityCard">
            <el-input v-model.number="userInfoFrom.identityCard"></el-input>
          </el-form-item>
          <el-form-item label="地址" prop="address">
            <el-input v-model.number="userInfoFrom.address"></el-input>
          </el-form-item>
          <el-form-item label="电话" prop="phone">
            <el-input v-model.number="userInfoFrom.phone"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="userInfoFrom.password" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="checkPassword">
            <el-input type="password" v-model="userInfoFrom.checkPassword" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button style="width: 100%" type="primary" @click="next2"  v-if="active==0 || active==1">下一步</el-button>
          </el-form-item>
        </el-form>

        <!--        third  -->
        <div v-if="active==2">
          <span>恭喜你注册成功！您的登录账号为:</span>
          <span id="res">{{this.userId}}</span>
        </div>
        <el-button style="width: 100%" type="primary" @click="last"  v-if="active==1">上一步</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import {sendEmail,TestEmailCode,register} from '@/api/user'


export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Register",
  data(){
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.userInfoFrom.checkPassword !== '') {
          this.$refs.userInfoFrom.validateField('checkPass');
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.userInfoFrom.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };

    var validateidentityCard = (rule, value, callback) => {
      if (!value) {
        this.$message.error("身份证号不能为空");
        return;
      }
      if (
          /( ^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/.test(
              value
          )
      ) {
        this.$message.error("身份证号不正确");
        return;
      }
      callback();
    }
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
      userId:"",
      havaUserId:1,
      userInfoFrom:{
        checkPassword:"",
        identityCard:"",
        username:"",
        address:"",
        password:"",
        phone:""
      },
      rules:{
        email: [
          {required:true,
            validator: (rule, value, callback) => {
              if (!value) {
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
            trigger: "click"
          }
        ]
      },
      userInfoFromRules:{
        password: [
          { validator: validatePass, trigger: 'blur' }
        ],
        checkPassword: [
          { validator: validatePass2, trigger: 'blur' }
        ],
        username: [
          {required: true, message: '用户名为空', trigger: 'blur'},
          { min: 3, max: 15, message: '长度在 3 到 15 个字符'}
        ],
        address: [
        {required: true, message: '地址为空', trigger: 'blur'},
        { min: 3, max: 15, message: '长度在 3 到 15 个字符'}
      ],
        identityCard:[
          { validator: validateidentityCard, trigger: 'blur' }
        ],
        phone: [
          {required: true, message: '地址为空', trigger: 'blur'},
        ],
      }
    }
  },
  methods:{
    //发送验证码
    send(){
      this.$refs['form'].validate((valid) =>{
        if(valid){
          this.Disabled=true
          this.time=60
          this.inputDisabled=false
          this.timer = setInterval(this.subtime, 1000)
          sendEmail(this.registerUserInfo.email).then(res=>{
            this.$message({
              message: res.message,
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
        this.registerUserInfo.vertifyCode=''
        clearInterval(this.timer)
      }
    },
    toLogin(){
      this.$router.push('/login')
    },
    // 第一步 验证码验证码
    next1() {
      // 1. 校验验证码是否正确
      this.$refs['form'].validate((valid) =>{
        if(valid){
            if(!this.registerUserInfo.vertifyCode){
              this.$message.error({
                message: "验证码为空"
              });
              return;
            }
          if(this.registerUserInfo.vertifyCode.length!=6){
            this.$message.error({
              message: "验证码长度不正确"
            });
            return;
          }

          // 2.通过email Adress 验证
          TestEmailCode(this.registerUserInfo.email,this.registerUserInfo.vertifyCode).then(res=>{
            this.$message({
              message: "填写个人信息",
              type: 'success'
            });
            //跳转下一步
            if (this.active++ > 2) this.active = 0;
          })

        }
      })
    },
    //随机生成姓名
    // 第一个参数为你想生成的固定的文字开头比如: 微信用户xxxxx
    // 第二个为你想生成出固定开头文字外的随机长度
    createName(prefix,randomLength){
      // 兼容更低版本的默认值写法
      prefix === undefined ? prefix = "" : prefix;
      randomLength === undefined ? randomLength = 8 : randomLength;

      // 设置随机用户名
      // 用户名随机词典数组
      let nameArr = [
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 0],
        ["a", "b", "c", "d", "e", "f", "g", "h", "i", "g", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]
      ]
      // 随机名字字符串
      let name = prefix;
      // 循环遍历从用户词典中随机抽出一个
      for (var i = 0; i < randomLength; i++) {
        // 随机生成index
        let index = Math.floor(Math.random() * 2);
        let zm = nameArr[index][Math.floor(Math.random() * nameArr[index].length)];
        // 如果随机出的是英文字母
        if (index === 1) {
          // 则百分之50的概率变为大写
          if (Math.floor(Math.random() * 2) === 1) {
            zm = zm.toUpperCase();
          }
        }
        // 拼接进名字变量中
        name += zm;
      }
      // 将随机生成的名字返回
      return name;
    },
    next2() {
      //提交个人信息
      this.$refs['userInfoFrom'].validate((valid)=>{
        if (valid){
          //发送请求
          register({
            code: this.registerUserInfo.vertifyCode,
            name: this.userInfoFrom.username,
            identitycard:this.userInfoFrom.identityCard,
            phone: this.userInfoFrom.phone,
            email: this.registerUserInfo.email,
            address: this.userInfoFrom.address,
            age: 0,
            sex: 0,
            userNickName: this.createName("用户",16),
            userPassword: this.userInfoFrom.password
          }).then(res=>{
            this.havaUserId=2,
            this.userId=res.obj
            this.$message({
              message: res.message,
              type: 'success'
            });
          })
          if (this.active++ > 2) this.active = 0;
        }
      })
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
#res{
  font-weight: bold;
  color: dodgerblue;
}
</style>
