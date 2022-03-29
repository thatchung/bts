<template>
  <section class="login-wrapper">
    <div class="inner">
      <div class="title">
        Partner Tool
      </div>
      <a-form :form="form" class="login-form" @submit="handleSubmit">
        <a-form-item>
          <a-input v-decorator="['username', rules.username]" placeholder="Email" autocomplete="off">
            <a-icon class="a-icon" slot="prefix" type="user" />
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-input v-decorator="['password', rules.password]" type="password" placeholder="Password" autocomplete="off">
            <a-icon class="a-icon" slot="prefix" type="lock" />
          </a-input>
        </a-form-item>
        <a-button type="primary" html-type="submit" class="login-form-button" block>
          Đăng nhập
        </a-button>
      </a-form>
    </div>
  </section>
</template>
<script>
import { login, getme } from '@/api/auth'
import { mapMutations } from 'vuex'
import { setToken } from '@/utils/token'

export default {
  name: 'Login',
  data () {
    return {
      form: this.$form.createForm(this),
      rules: {
        username: { rules: [{ required: true, message: 'Email không được để trống!' }] },
        password: { rules: [{ required: true, message: 'Password không được để trống!' }] }
      }
    }
  },
  methods: {
    ...mapMutations(['setUserInfo']),
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (err) return false

        login({
          identifier: values.username,
          password: values.password
        }).then(res => {
          if (!res.jwt) {
            this.$message.warning('Đăng nhập không thành công')
            return false
          }
          const me = getme({ id: res.user.id })
          console.log(me)
          this.setUserInfo(res.user)
          localStorage.setItem('user', JSON.stringify(res.user))
          setToken(res.jwt)
          if (res.user.type === 'admin') {
            this.$router.push('dashboard')
          } else {
            this.$router.push('dashboard')
          }
        })
      })
    }
  }
}
</script>
<style lang='less' scoped>
.login-wrapper {
  width: 100%;
  height: 100%;
  background: url('~@/assets/image/login/login-bj.jpg') no-repeat center center;
  background-size: auto;
  .inner {
    position: relative;
    left: 50%;
    top: 45%;
    transform: translate(-50%, -50%);
    max-width: 380px;
    background-color: #fff;
    border-radius: 10px;
    overflow: hidden;
  }
  .title {
    font-size: 22px;
    color: #2d8cf0;
    text-align: center;
    line-height: 52px;
    background-color: #eee;
  }
  .login-form {
    padding: 20px;
  }
}
.a-icon {
  color: rgba(0, 0, 0, 0.25);
}
</style>
