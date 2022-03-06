<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片 -->
    <el-card>
      <div id="main" style="width: 750px; height: 400px"></div>
    </el-card>
  </div>
</template>

<script>
import * as echarts from "echarts";
export default {
  name: "Report",
  data() {
    return {
      options: {
        title: {
          text: "用户来源",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#E9EEF3",
            },
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            boundaryGap: false,
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
      },
    };
  },
  async mounted() {
    const { data: res } = await this.$http.get("reports/type/1");
    if (res.meta.status != 200) return this.$message.error("获取报表失败");

		const result=Object.assign(this.options,res.data)
    var myChart = echarts.init(document.getElementById("main"));
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(result);
  },
};
</script>

<style lang="less" scoped></style>
