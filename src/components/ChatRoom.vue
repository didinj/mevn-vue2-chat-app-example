<template>
  <b-row>
    <b-col cols="12">
      <h2>
        Chat Room - <b-btn size="sm" @click.stop="logout()">Logout</b-btn>
      </h2>
      <b-list-group class="panel-body" v-chat-scroll>
        <b-list-group-item v-for="(item, index) in chats" class="chat">
          <div class="left clearfix" v-if="item.nickname === nickname">
            <b-img left src="http://placehold.it/50/55C1E7/fff&text=ME" rounded="circle" width="75" height="75" alt="img" class="m-1" />
            <div class="chat-body clearfix">
              <div class="header">
                <strong class="primary-font">{{ item.nickname }}</strong> <small class="pull-right text-muted">
                <span class="glyphicon glyphicon-time"></span>{{ item.created_date }}</small>
              </div>
              <p>{{ item.message }}</p>
            </div>
          </div>
          <div class="right clearfix" v-else>
            <b-img right src="http://placehold.it/50/55C1E7/fff&text=U" rounded="circle" width="75" height="75" alt="img" class="m-1" />
            <div class="chat-body clearfix">
              <div class="header">
                <strong class="primary-font">{{ item.nickname }}</strong> <small class="pull-right text-muted">
                <span class="glyphicon glyphicon-time"></span>{{ item.created_date }}</small>
              </div>
              <p>{{ item.message }}</p>
            </div>
          </div>
        </b-list-group-item>
      </b-list-group>
      <ul v-if="errors && errors.length">
        <li v-for="error of errors">
          {{error.message}}
        </li>
      </ul>
      <b-form @submit="onSubmit" class="chat-form">
        <b-input-group prepend="Message">
          <b-form-input id="message" :state="state" v-model.trim="chat.message"></b-form-input>
          <b-input-group-append>
            <b-btn type="submit" variant="info">Send</b-btn>
          </b-input-group-append>
        </b-input-group>
      </b-form>
    </b-col>
  </b-row>
</template>

<script>

import Vue from 'vue'
import axios from 'axios'
import * as io from 'socket.io-client'
import VueChatScroll from 'vue-chat-scroll'
Vue.use(VueChatScroll)

export default {
  name: 'ChatRoom',
  data () {
    return {
      chats: [],
      errors: [],
      nickname: this.$route.params.nickname,
      chat: {},
      socket: io('http://localhost:4000')
    }
  },
  created () {
    axios.get(`http://localhost:3000/api/chat/` + this.$route.params.id)
    .then(response => {
      this.chats = response.data
    })
    .catch(e => {
      this.errors.push(e)
    })

    this.socket.on('new-message', function (data) {
      if(data.message.room === this.$route.params.id) {
        this.chats.push(data.message)
      }
    }.bind(this))
  },
  methods: {
    logout () {
      this.socket.emit('save-message', { room: this.chat.room, nickname: this.chat.nickname, message: this.chat.nickname + ' left this room', created_date: new Date() });
      this.$router.push({
        name: 'RoomList'
      })
    },
    onSubmit (evt) {
      evt.preventDefault()
      this.chat.room = this.$route.params.id
      this.chat.nickname = this.$route.params.nickname
      axios.post(`http://localhost:3000/api/chat`, this.chat)
      .then(response => {
        this.socket.emit('save-message', response.data)
        this.chat.message = ''
      })
      .catch(e => {
        this.errors.push(e)
      })
    }
  }
}
</script>

<style>
  .chat .left .chat-body {
    text-align: left;
    margin-left: 100px;
  }

  .chat .right .chat-body {
    text-align: right;
    margin-right: 100px;
  }

  .chat .chat-body p {
    margin: 0;
    color: #777777;
  }

  .panel-body {
    overflow-y: scroll;
    height: 350px;
  }

  .chat-form {
    margin: 20px auto;
    width: 80%;
  }
</style>
