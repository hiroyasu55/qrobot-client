<template>
  <v-main>
    <div class="authenticator__wrapper d-flex justify-center">
      <amplify-authenticator :auth-config="authConfig"></amplify-authenticator>
    </div>
    <!--
      <amplify-sign-in></amplify-sign-in>
        <amplify-sign-up :sign-up-config="signUpConfig"></amplify-sign-up>
      -->
  </v-main>
</template>

<style lang="scss">
$border-radius: 4px;
$box-shadow: 0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%),
  0px 1px 5px 0px rgb(0 0 0 / 12%);

.authenticator__wrapper {
  div[class^='Form__formSection'] {
    // width: 360px;
    min-width: 360px;
    color: rgba(0, 0, 0, 0.87);
    border-radius: $border-radius;
    box-shadow: $box-shadow;
    button[class^='Button__button'] {
      background-color: var(--v-primary-base);
      border-radius: $border-radius;
      box-shadow: $box-shadow;
      height: 36px;
      min-width: 64px;
      padding: 0 16px;
    }

    div[class^='Section__sectionFooter'] {
      .error {
        margin-top: 4px;
        padding: 2px;
      }
    }

    .error {
      color: white;
      margin-top: 8px;
      padding: 4px;
    }
  }
}
</style>

<script>
export default {
  name: 'auth.login',
  data() {
    return {
      authConfig: {
        signInConfig: {
          isSignUpDisplayed: false,
        },
        signUpConfig: {
          hideAllDefaults: true,
          signUpFields: [
            {
              key: 'username',
              type: 'username',
              label: 'ユーザー名',
              placeholder: '英数字6文字以上',
              required: true,
              displayOrder: 1,
            },
            {
              key: 'password',
              type: 'password',
              label: 'パスワード',
              placeholder: 'パスワード',
              required: true,
              displayOrder: 2,
            },
            {
              key: 'nickname',
              type: 'nickname',
              label: '表示名',
              placeholder: 'お好きな名前',
              required: true,
              displayOrder: 4,
            },
            {
              key: 'email',
              type: 'email',
              label: 'メールアドレス',
              placeholder: 'xxx@xxx.xxx',
              required: true,
              displayOrder: 5,
            },
          ],
          // handleSubmit() {
          //   throw new Error('handleSubmit')
          // },
        },
      },
    }
  },
  methods: {},
}
</script>
