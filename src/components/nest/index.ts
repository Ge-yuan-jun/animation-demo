import Vue from 'Vue'
import { Component } from 'vue-property-decorator'
import { init as circleInit } from './modules/init'

/**
 * 知乎登录页面背景 canvas，现在貌似已下线了
 */
@Component({})
export default class Nest extends Vue {
  mounted () {
    circleInit()
  }
}
