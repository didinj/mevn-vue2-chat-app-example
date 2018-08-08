import Vue from 'vue'
import Router from 'vue-router'
import RoomList from '@/components/RoomList'
import AddRoom from '@/components/AddRoom'
import JoinRoom from '@/components/JoinRoom'
import ChatRoom from '@/components/ChatRoom'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'RoomList',
      component: RoomList
    },
    {
      path: '/add-room',
      name: 'AddRoom',
      component: AddRoom
    },
    {
      path: '/join-room/:id',
      name: 'JoinRoom',
      component: JoinRoom
    },
    {
      path: '/chat-room/:id/:nickname',
      name: 'ChatRoom',
      component: ChatRoom
    }
  ]
})
