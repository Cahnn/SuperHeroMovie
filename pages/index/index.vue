<template>
	<view class="page">
		<!-- 滑块视图属性 uswiper双击出现代码块 -->
		<swiper :indicator-dots="true" :autoplay="true" :interval="2000" class="carousel">
			<swiper-item v-for="(carousel,index) in carouselList" :key="index">
				<navigator open-type="navigate" :url="'../movie/movie?trailerId='+carousel.movieId">
					<image :src="carousel.image" class="carouselItem"></image>
				</navigator>
			</swiper-item>
		</swiper>
		
		<!-- 热门超英 -->
		<view class="page-block super-hot">
			<view class="hot-title-wapper">
				<image src="../../static/icon/hot.png" class="hot-ico"></image>
				<view class="hot-title">
					热门超英
				</view>
			</view>
		</view>
		<scroll-view scroll-x="true" class="page-block hot" show-scrollbar="false">
			<view class="single-poster" v-for="(superhero,index) in hotSuperHeroList" :key="index">
				<view class="poster-wapper">
					<navigator open-type="navigate" :url="'../movie/movie?trailerId='+superhero.id">
						<image :src="superhero.cover" class="poster"></image>
					</navigator>
					<view class="movie-name">
						{{superhero.name}}
					</view>
					<trailer-stars :innerScore="superhero.score" showNum="1"></trailer-stars>
				</view>
			</view>
		</scroll-view>
		
		<!-- 热门预告 -->
		<view class="page-block super-hot">
			<view class="hot-title-wapper">
				<image src="../../static/icon/trailer.png" class="hot-ico"></image>
				<view class="hot-title">
					热门预告
				</view>
			</view>
		</view>
		
		<view class="hot-movies page-block">
			<video 
				:id="trailer.id"
				:data-palyingtIndex = "trailer.id"
				@play="meIsPlaying"
				v-for="trailer in hotTrailerList" 
				:src="trailer.trailer" 
				:poster="trailer.poster"
				:duration="60"
				class="hot-movie-single"
				controls></video>
		</view>
		
		<!-- 猜你喜欢 -->
		<view class="page-block super-hot">
			<view class="hot-title-wapper">
				<image src="../../static/icon/like.png" class="hot-ico"></image>
				<view class="hot-title">
					猜你喜欢
				</view>
			</view>
		</view>
		
		<view class="page-block guess-u-like">
			<view class="single-like-movie" v-for="(uLike,gIndex) in guessULikeList">
				<navigator open-type="navigate" :url="'../movie/movie?trailerId='+uLike.id">
					<image :src="uLike.cover" class="like-movie"></image>
				</navigator>
				<view class="movie-desc">		
					<view class="movie-title">		
						{{uLike.name}}
					</view>					
					<trailer-stars innerScore="9" showNum="0"></trailer-stars>
					<view class="movie-info">
						{{uLike.basicInfo}}
					</view>
					<view class="movie-info">
						{{uLike.releaseDate}}
					</view>
				</view>				
				<!-- :data-gIndex自定义一个值 -->
				<view class="movie-oper" :data-gIndex="gIndex" @click="praiseMe">	
					<image src="../../static/icon/good.png" class="praise-ico"></image>
					<view class="praise-me">
						点赞
					</view>
					<view :animation="animationDataArr[gIndex]" class="praise-me animation-opacity">
						+1
					</view>
				</view>
			</view>			
		</view>
	</view> 
</template>

<script>
	// import common from "../../common/common.js"
	
	// 导入自定义组件
	import trailerStars from "../../components/trailerStars.vue"
	
	export default {
		data() {
			return {
				title: 'Hello',
				carouselList:[],
				hotSuperHeroList:[],
				hotTrailerList:[],
				guessULikeList:[],
				animationData:{},
				// 点赞数组
				animationDataArr:[
					{}, {}, {}, {}, {}
				]
			}
		},
		onUnload() {
			// 页面卸载时清除动画数据
			this.animationData = {}
			this.animationDataArr = [
				{}, {}, {}, {}, {}
			]
		},
		onLoad() {
			// 请求轮播图数据
			this.getcarouselList()
			// 请求热门预告列表
			this.gethotSuperHeroList()
			
			this.gethotTrailerList()
			
			this.getGuessULikeList()
			
			// 创建一个临时对象动画
			this.animation = uni.createAnimation()
		},
		// 监听用户下拉刷新动作
		onPullDownRefresh() {
			// 更新猜你喜欢列表
			this.getGuessULikeList()
		},
		// 页面隐藏时暂停播放视频
		onHide() {
			if(this.videoContext){
				this.videoContext.pause()
			}
		},
		methods: {
			// 播放一个视频时暂停其他播放视频
			meIsPlaying(e){
				var trailerId = ''
				if(e){
					trailerId = e.currentTarget.dataset.palyingtIndex;
					this.videoContext = uni.createVideoContext(trailerId)
				}
				var hotTrailerList = this.hotTrailerList
				for(var i = 0;i< hotTrailerList.length;i++){
					var tempId = hotTrailerList[i].id
					if(tempId != trailerId) {
						uni.createVideoContext(tempId).pause();
					}
				}
			},
				// 请求轮播图数据
			async getcarouselList(){
				// var me = this
				
				// 获取common.js中的服务器地址
				// var server_url = common.server_url
				uni.request({
					url:this.server_url+'/index/carousel/list?qq=3195931798',
					method:"POST",
					// success:function(){}与success:(res)=>{}的区别涉及作用域的问题:this的指向
					//使用function定义的函数，this的指向随着调用环境的变化而变化的，而箭头函数中的this指向是固定不变的，一直指向的是定义函数的环境。
					success: (res) => {
						// 获取真实数据之前判断状态码是否为200
						if(res.data.status === 200){
							this.carouselList = res.data.data
						}
					}
					// success:function(){
					// 	if(res.data.status === 200){
					// 		var carouselList = res.data.data
					// 		me.carouselList = carouselList
					// 	}
					// }
				})
			},
			// 请求热门预告列表
			async gethotSuperHeroList(){
				uni.request({
					url:this.server_url+'/index/movie/hot?type=superhero&qq=3195931798',
					method:"POST",
					success: (res) => {
						if(res.data.status === 200) {
							this.hotSuperHeroList = res.data.data
						}
					}
				})
			},
			// 请求热门预告视频列表
			async gethotTrailerList(){
				uni.request({
					url:this.server_url+'/index/movie/hot?type=trailer&qq=3195931798',
					method:"POST",
					success: (res) => {
						if(res.data.status === 200) {
							this.hotTrailerList = res.data.data
						}
					}
				})
			},
			// 请求猜你喜欢数据
			async getGuessULikeList(){
				
				uni.showLoading({
					// 显示蒙层，防止触摸渗透
					mask:true
				})
				// 导航栏显示加载
				uni.showNavigationBarLoading()
				
				uni.request({
					url:this.server_url+'/index/guessULike?qq=3195931798',
					method:"POST",
					success: (res) => {
						console.log(res.data)
						if(res.data.status === 200) {
							this.guessULikeList = res.data.data
						}
					},
					complete: () => {
						uni.hideNavigationBarLoading()
						uni.hideLoading()
						uni.stopPullDownRefresh()
					}
				})
			},
			// 实现点赞动画效果
			praiseMe(e){
				// 课程中提到dataset下面的值都是小写，经测试表明dataset下面的值要与绑定的值一致
				var gIndex = e.currentTarget.dataset.gIndex;
				// console.log(e.currentTarget.dataset)
				// console.log(gIndex)
				// 此动画向上偏移60px 透明度调整为1 step() 表示一组动画的完成
				this.animation.translateY(-60).opacity(1).step({
					duration:400
				})
				// 导出动画数据  实现组件的动画效果
				this.animationData = this.animation;
				// this.animationDataArr[gIndex] = this.animationData.export();
				// H5不支持此动画,用$set()的方式
				this.$set(this.animationDataArr, gIndex, this.animationData.export())
				
				// 还原动画
				setTimeout(function(){
					this.animation.translateY(0).opacity(0).step({
						duration:0
					})
					this.animationData = this.animation;
					// this.animationDataArr[gIndex] = this.animationData.export();
					this.$set(this.animationDataArr, gIndex, this.animationData.export())
				}.bind(this),500)
			}
		},
		components:{
			trailerStars
		}
	}
</script>

<style>
	// 导入外部样式
	@import url("index");
</style>
