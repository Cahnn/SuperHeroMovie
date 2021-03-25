<template>
	<view class="page page-fill">
		<form @submit="formSubmitBirthday">
			<view class="page-block" style="margin-top: 20upx;">
				<picker mode="date" @change="dataChange">
					<view class="birthday">
						{{birthday}}
					</view>
				</picker>
			</view>
			
			<button type="primary" form-type="submit" class="submitBtn">提交</button>
		</form>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				birthday:'',
				globalUser:{}
			}
		},
		onLoad() {
			var me = this
			var globalUser = me.getGlobalUser("globalUser")
			me.globalUser = globalUser
			me.birthday = globalUser.birthday
		},
		methods: {
			dataChange(e){
				this.birthday = e.detail.value
			},
			formSubmitBirthday(){
				var me = this
				var birthday = me.birthday
				uni.request({
					url:me.server_url+"/user/modifyUserinfo?qq=3195931798",
					method:"POST",
					data:{
						"userId":me.globalUser.id,
						"birthday":birthday
					},
					header:{
						"headerUserId":me.globalUser.id,
						"headerUserToken":me.globalUser.userUniqueToken
					},
					success(res){
						var resData = res.data
						if(resData.status == 200){
							// 获得最新的用户数据
							var userInfo = resData.data
							// 更新本地缓存
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
}

.birth-input {
	background-color: white;
	height: 80upx;
	line-height: 40upx;
	padding-left: 20upx;
}

.birthday {
	background-color: white;
	height: 80upx;
	padding-left: 20upx;
	padding-top: 30upx;
}

.submitBtn {
	width: 95%;
	margin-top: 40upx;
}
</style>
