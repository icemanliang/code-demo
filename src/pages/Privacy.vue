<template>
  <div class="search">
    <label >username: </label><input v-model="username"/><br/><br/>
    <label >password: </label><input v-model="password"/><br/><br/>
    <label >email: </label><input v-model="email"/><br/><br/>
    <label >avatar: </label><input v-model="avatar"><br/><br/>
    <button @click="register">点击注册</button>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
const authModule = namespace('auth');

@Component
export default class Privacy extends Vue {
  @authModule.Action('registerRequest')
  private registerRequest!: ({username,password,email,avatar}: {username: string;password: string;email: string;avatar: string}) => void;

  private username = '';
  private password = '';
  private email = '';
  private avatar = '';

  async register(): Promise<void> {
    try {
      await this.registerRequest({
        username: this.username,
        password: this.password,
        email: this.email,
        avatar: this.avatar
      });
      // console.log('注册成功');
    } catch (e) {
      console.error(e);
    }
  }
}
</script>
<style lang="scss" scoped>
.search {
  width: 100%;
  margin:50px;
  text-align: left;

  label {
    min-width: 100px;
  }
  button {
    width: 100px;
    height: 30px;
  }
}
</style>
