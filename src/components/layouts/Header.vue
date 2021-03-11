<template>
  <div>
    <v-app-bar app absolute dark color="primary" class="mx-2">
      <v-toolbar-title>Q-ROBOT</v-toolbar-title>
      <v-spacer></v-spacer>
      <template v-if="!user">
        <v-btn text to="/login">ログイン</v-btn>
      </template>
      <template v-if="user">
        <v-btn outlined to="#">
          <v-icon>mdi-account</v-icon>{{ user.username }}
        </v-btn>
      </template>
      <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" fixed right temporary color="white">
      <v-list nav dense>
        <v-list-item
          v-for="item in drawerItems"
          :key="item.title"
          :to="item.to"
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item v-if="!user" to="/login">
          <v-list-item-icon>
            <v-icon>mdi-account</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>ログイン</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-if="user" to="/logout">
          <v-list-item-icon>
            <v-icon>mdi-account</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>ログアウト</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
import {mapState, mapActions} from 'vuex'

export default {
  data() {
    return {
      drawer: false,
    }
  },
  computed: {
    ...mapState({
      user: (state) => state.auth.user,
    }),
    drawerItems() {
      return [
        {title: 'ホーム', icon: 'mdi-home', to: '/'},
        {title: '問題', icon: 'mdi-help-box', to: '/questions'},
        {title: '設定', icon: 'mdi-cog', to: '#'},
      ]
    },
  },
  method: {
    dummy() {
      console.log('SSS')
    },
  },
  mounted() {},
}
</script>
