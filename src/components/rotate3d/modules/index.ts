/*
 * @Author: Ge.Yuanjun
 * @Date: 2018-03-21 11:47:54
 * @Last Modified by: Ge.Yuanjun
 * @Last Modified time: 2018-03-22 14:59:44
 */
import $SECTION_REDPACK from './redpack'
import $SECTION_STAGE from './stage'

/**
 * 创建 背景、烟雾、以及人物，组件舞台
 * @param  THREE.scene $scene -- three.js 场景
 */
function stage ($scene) {
  $SECTION_STAGE($scene)
  $SECTION_REDPACK($scene)
}

export default stage
