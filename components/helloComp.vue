<template name="helloComp">  <!-- 定义组件的名称 -->
	<view>
		{{my}}
		<input type="text" :value="myval" class="txt" />
	</view>
</template>

<script>
	export default {
		name:"helloComp",
		data() {
			return {
				
			};
		},
		props:{
			// 自定义变量 接受父组件传入的参数值
			my:String,
			myval:{
				type:String
			}
		}
	}
</script>

<style>
	.txt{
		color: red;
	}
</style>
