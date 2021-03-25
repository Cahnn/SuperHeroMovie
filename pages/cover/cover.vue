<template>
	<view class="black">
		<!-- widthFix 宽度不变，高度自适应变化 -->
		<image 
			:src="cover" 
			mode="widthFix" 
			@longpress="operator"
			class="cover"></image>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				cover:''
			}
		},
		onLoad(params) {
			this.cover = params.cover
		},
		methods: {
			operator(){
				uni.showActionSheet({
					itemList:["保存图片到本地"],
					success: (res) => {
						// 判断下标,下标为0则下载
						if(res.tapIndex == 0){
							uni.showLoading({
								title:"图片保存中..."
							})
							// h5不支持，涉及跨域问题
							uni.downloadFile({
								url:this.cover,
								success: (result) => {
									var tempFilePath =  result.tempFilePath
									uni.saveImageToPhotosAlbum({
										filePath:tempFilePath,
										success: () => {
											uni.showToast({
												title:"保存成功",
												duration:2000
											})
										},
										complete:function() {
											uni.hideLoading()
										}
									})
								}
							})
						}
					}
				})
			}
		}
	}
</script>

<style>
.black{
	background-color: #000000;
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	position: fixed;
}
.cover{
	align-self: center;
}
</style>
