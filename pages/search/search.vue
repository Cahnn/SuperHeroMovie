<template>
	<view class="page">
		<view class="search-block">
			<view class="search-ico-wapper">
				<image src="../../static/icon/search.png" class="search-ico"></image>
			</view>
			<input 
				placeholder="搜索预告" 
				maxlength="10" 
				class="search-text" 
				confirm-type="search"
				@confirm="searchMe"
				 />
		</view>
		
		<view class="movie-list page-block">
			<view class="movie-wapper" v-for="trailer in trailerList">
				<image 
					:src="trailer.cover" 
					:data-trailerId="trailer.id"
					@tap="showTrailer"
					class="poster"></image>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				trailerList:[],
				keywords:'',   // 搜索关键字
				page:1,    // 当前页
				totalPages:1     // 总页数
			}
		},
		onLoad() {
			this.getTrailerList()
		},
		onReachBottom() {
			var page = this.page+1   // 查询下一页
			var keywords = this.keywords   // 获取当前页面data里的值
			var totalPages = this.totalPages   // 获取总页数
			
			// 如果当前需要分页的分页数和总页数相等，就不分页
			if(page>= totalPages) {
				return
			}
			
			this.pageTrailerList(keywords,page,15)
			
		},
		methods: {
			showTrailer(e){
				var trailerId = e.currentTarget.dataset.trailerid
				// 页面跳转api 
				uni.navigateTo({
					url:"../movie/movie?trailerId="+trailerId
				})
			},
			// 请求猜你喜欢数据
			async getTrailerList(){
				
				uni.showLoading({
					// 显示蒙层，防止触摸渗透
					mask:true,
					title:"请稍后..."
				})
				// 导航栏显示加载
				uni.showNavigationBarLoading()
				
				uni.request({
					url:this.server_url+'/search/list?keywords=&page=&pageSize=&qq=3195931798',
					method:"POST",
					success: (res) => {
						console.log(res.data)
						if(res.data.status === 200) {
							this.trailerList = res.data.data.rows
						}
					},
					complete: () => {
						uni.hideNavigationBarLoading()
						uni.hideLoading()
						uni.stopPullDownRefresh()
					}
				})
			},
			searchMe(e){
				// e 获取文本框里面的内容
				
				// 获取搜索内容
				var value = e.detail.value
				this.keywords = value
				// 清空列表
				this.trailerList = []
				this.pageTrailerList(value,1,15)
			},
			pageTrailerList(keywords,page,pageSize){
				uni.showLoading({
					// 显示蒙层，防止触摸渗透
					mask:true,
					title:"请稍后..."
				})
				// 导航栏显示加载
				uni.showNavigationBarLoading()
				
				uni.request({
					url:this.server_url+'/search/list?keywords='+ keywords
					 +'&page='+ page +'&pageSize='+ 
					 pageSize +'&qq=3195931798',
					method:"POST",
					success: (res) => {
						console.log(res.data)
						if(res.data.status === 200) {
							var tempList = res.data.data.rows
							this.trailerList = this.trailerList.concat(tempList)
							this.totalPages = res.data.data.total;   // 获取总页数
							this.page = page    // 覆盖当前页的page
						}
					},
					complete: () => {
						uni.hideNavigationBarLoading()
						uni.hideLoading()
						uni.stopPullDownRefresh()
					}
				})
			}
		}
	}
</script>

<style>
	@import url("search.css");
</style>
