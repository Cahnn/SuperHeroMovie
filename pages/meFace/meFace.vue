<template>
	<view class="page page-fill">
		
		<view class="pending-wapper">
			<image id="face" :src="tempFace" class="pending-face" mode="scaleToFill"></image>
		</view>
		
		<view class="notice">
			<view class="notice-words">
				* 请从相册中选择等比宽高的图片噢~
			</view>
		</view>
		
		<view class="footer-opertor">
			<view class="opertor-words" @click="changePendingFace">
				重新选择
			</view>
			<view class="opertor-words" @click="upload">
				确认上传
			</view>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tempFace:""
			}
		},
		onLoad(params) {
			this.tempFace = params.tempFilePath
		},
		methods: {
			changePendingFace(){
				var me = this
				uni.chooseImage({
					count: 1,
					// 压缩图
					sizeType: ["compressed"],
					// 图片来源：album 相册
					sourceType: ["album"],
					success(res) {
						// res获得临时路径
						var tempFilePath = res.tempFilePaths[0];
						me.tempFace = tempFilePath
					}
				})
			},
			upload(){
				// 获得全局用户头像
				var globalUser = this.getGlobalUser("globalUser")
				
				uni.showLoading({
					// 是否显示透明蒙层，防止触摸穿透
					mask:true,
					title:"上传中，请稍后"
				})
				// 上传图片
				uni.uploadFile({
					url: this.server_url+"/user/uploadFace?qq=3195931798&userId=" + globalUser.id,
					// 上传文件所在地址
					filePath:this.tempFace,
					header:{
						"headerUserId":globalUser.id,
						"headerUserToken":globalUser.userUniqueToken
					},
					name:"file",
					success(res){
						var resDataStr = res.data
						var resData = JSON.parse(resDataStr)
						
						if(resData.status == 200){
							// 获得最新的用户数据
							var userInfo = resData.data
							uni.setStorageSync("globalUser",userInfo)
							uni.navigateBack({
								// 返回的页面数，如果 delta 大于现有页面数，则返回到首页。
								delta:1
							})
						}else if(resData.status == 502 || resData.status == 500){
							uni.showToast({
								title:res.data.msg,
								icon:"none",
								duration:2000
							}) 
						}
					},
					complete(){
						uni.hideLoading()
					}
				})
			}
		}
	}
</script>

<style>
/* 页面铺满屏幕 */
.page-fill {
	width:100%;
	height: 100%;
	position: absolute;
	background: black;
}

.pending-wapper {
	display: flex;
	flex-direction: row;
	justify-content: center;
	
	margin-top: 40upx;
}
.pending-face {
	width: 600upx;
	height: 600upx;
}

.notice {
	display: flex;
	flex-direction: row;
	justify-content: flex-end;
}

.notice-words {
	color: gray;
	font-size: 13px;
	margin-top: 30upx;
	width: 600upx;
}

/* 底部操作 start */
.footer-opertor {
	position: fixed;
	bottom: 0;
	
	border-top: #515050 solid 1px;
	width: 100%;
	
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	
	padding: 30upx;
}
.opertor-words {
	color: #e8e5e5;
	font-size: 16px;
	width: 200upx;
}
/* 底部操作 end */
</style>
