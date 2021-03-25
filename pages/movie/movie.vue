<template>
	<view class="page">
		<view class="player">
			<video controls 
			id="myTrailer"
			:src="trailerInfo.trailer"
			:poster="trailerInfo.poster"
			class="movie"
			></video>
		</view>
		
		<view class="movie-info">
			<navigator :url="'../cover/cover?cover='+trailerInfo.cover">
				<image :src="trailerInfo.cover" class="cover"></image>
			</navigator>
			
			<view class="movie-desc">
				<view class="title">
					{{trailerInfo.name}}
				</view>
				<view class="basic-info">
					{{trailerInfo.basicInfo}}
				</view>
				<view class="basic-info">
					{{trailerInfo.originalName}}
				</view>
				<view class="basic-info">
					{{trailerInfo.totalTime}}
				</view>
				<view class="basic-info">
					{{trailerInfo.releaseDate}}
				</view>
				<view class="score-block">
					<view class="big-score">
						<view class="score-word">
							综合评分：
						</view>
						<view class="movie-score">
							{{trailerInfo.score}}
						</view>
					</view>
					<view class="score-stars">
						<!-- 之前传入的值为空对象里面的值为undefine   做判断可避免传入空对象的值 -->
						<block v-if="trailerInfo.score >= 0">
							<trailer-stars :innerScore="trailerInfo.score" :showNum="0"></trailer-stars>
						</block>
						<view class="prise-counts">
							{{trailerInfo.prisedCounts}}人点赞
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<view class="line-wapper">
			<view class="line">
				
			</view>
		</view>
		
		<view class="plots-block">
			<view class="plots-title">
				剧情介绍
			</view>
			<view class="plots-desc">
				{{trailerInfo.plotDesc}}
			</view>
		</view>
		
		<view class="scroll-block">
			<view class="plots-title">
				演职人员
			</view>
			<scroll-view scroll-x="true" class="scroll-list">
				<view class="actor-wapper" v-for="(director,staffIndex) in directorArr" >
					<image
						:src="director.photo" 
						class="single-director" 
						@tap="lookStaffs"
						:data-staffIndex="staffIndex"
						mode="aspectFill"></image>
						<view class="actor-name">
							{{director.name}}
						</view>
						<view class="actor-role">
							{{director.actName}}
						</view>
				</view>
				
				<view class="actor-wapper" v-for="(actor,actorIndex) in actorArr" >
					<image
						:src="actor.photo" 
						class="single-director" 
						@tap="lookStaffs"
						:data-staffIndex="actorIndex + directorArr.length"
						mode="aspectFill"></image>
						<view class="actor-name">
							{{actor.name}}
						</view>
						<view class="actor-role">
							{{actor.actName}}
						</view>
				</view>
				
			</scroll-view>
		</view>
		
		<view class="scroll-block">
			<view class="plots-title">
				剧照
			</view>
			<scroll-view scroll-x="true" class="scroll-list">
				<image 
					v-for="(img,imgIndex) in plotPicsArr" 
					:src="img" 
					class="plot-image" 
					@tap="lookMe"
					:data-imgIndex="imgIndex"
					mode="aspectFill"></image>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import trailerStars from "../../components/trailerStars.vue"
	
	export default {
		data() {
			return {
				trailerInfo: {},
				plotPicsArr:[],  // 剧照
				directorArr:[],   // 导演
				actorArr:[]   // 演员列表
			}
		},
		// 页面初次渲染完成，创建并返回 video 上下文 videoContext 对象
		onReady() {
			this.videoContext = uni.createVideoContext('myTrailer')
		},
		onHide() {
			// 页面被隐藏时暂停播放
			this.videoContext.pause()
		},
		onShow() {
			// 页面显示时继续播放  判断this.videoContext是否有效
			if(this.videoContext){
				this.videoContext.play()
			}
		},
		onLoad(params) {
			// 通过api修改导航栏的属性
			uni.setNavigationBarColor({
				frontColor:"#FFFFFF",
				backgroundColor:"#000000"
			})
			
			// 获取上一个页面传入的参数
			var trailerId = params.trailerId
			
			// 获取预告片的详细信息
			uni.request({
				url:this.server_url+'/search/trailer/'+trailerId+'?qq=3195931798',
				method:"POST",
				success: (res) => {
					if(res.data.status == 200) {
						this.trailerInfo = res.data.data
						// 把剧照的字符串转换为json array格式
						var plotPicsArr = JSON.parse(this.trailerInfo.plotPics)
						this.plotPicsArr = plotPicsArr
					}
				}
			})
			
			// 获取导演
			uni.request({
				url:this.server_url+'/search/staff/'+trailerId+'/1'+'?qq=3195931798',
				method:"POST",
				success: (res) => {
					if(res.data.status == 200) {
						this.directorArr = res.data.data
					}
				}
			})
			
			// 获取演员
			uni.request({
				url:this.server_url+'/search/staff/'+trailerId+'/2'+'?qq=3195931798',
				method:"POST",
				success: (res) => {
					if(res.data.status == 200) {
						this.actorArr = res.data.data
					}
				}
			})
		},
		// 仅支持小程序端，分享到群或好友，不能分享到朋友圈
		onShareAppMessage(res) {
			return{
				title:this.trailerInfo.name,
				path:'/pages/movie/movie?trailerId='+this.trailerInfo.id
			}
		},
		// 监听导航栏按钮      仅支持小程序平台
		onNavigationBarButtonTap(e) {
			var index = e.index
			console.log(index)
			var trailerInfo = this.trailerInfo
			var trailerId = trailerInfo.id
			var trailerName = trailerInfo.name
			var cover = trailerInfo.cover
			var poster = trailerInfo.poster
			
			
			if(index == 0){
				uni.share({
				    provider: "weixin",
				    scene: "WXSceneSession",
				    type: 0,
				    href: "www.baidu.com",
				    title: "超英预告:《"+ trailerName +"》",
				    summary: "超英预告:《"+ trailerName +"》",
				    imageUrl: cover,
				    success: function (res) {
				        console.log("success:" + JSON.stringify(res));
				    }
				})
			}
		},
		methods: {
			lookMe(e){
				var imgIndex = e.currentTarget.dataset.imgIndex
				uni.previewImage({
					current:this.plotPicsArr[imgIndex],
					urls:this.plotPicsArr
				})
			},
			lookStaffs(e){
				var staffIndex = e.currentTarget.dataset.staffIndex
				
				// 拼接导演和演员的数组，成为新数组
				var newStaffArr=[]
				newStaffArr = newStaffArr.concat(this.directorArr).concat(this.actorArr)
				var urls = [];
				// 抽出数组中的图片
				for(var i = 0;i < newStaffArr.length;i++){
					var tempPhoto = newStaffArr[i].photo
					urls.push(tempPhoto)
				}
				
				uni.previewImage({
					current:urls[staffIndex],
					urls:urls
				})
			}
		},
		components:{
			trailerStars
		}
	}
</script>

<style>
@import url("movie.css");
</style>
