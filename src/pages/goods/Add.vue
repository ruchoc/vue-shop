<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片 -->
    <el-card>
      <!-- 提示 -->
      <el-alert
        title="添加商品信息"
        type="info"
        center
        show-icon
        :closable="false"
      >
      </el-alert>

      <!-- 步骤 -->
      <el-steps
        align-center
        :space="300"
        :active="activeIndex - 0"
        finish-status="success"
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          :before-leave="beforeTabLeave"
          tab-position="left"
          @tab-click="tabClicked"
          v-model="activeIndex"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input> </el-form-item
            ><el-form-item label="商品价格" prop="goods_price">
              <el-input
                type="number"
                v-model="addForm.goods_price"
              ></el-input> </el-form-item
            ><el-form-item label="商品重量" prop="goods_weight">
              <el-input
                type="number"
                v-model="addForm.goods_weight"
              ></el-input> </el-form-item
            ><el-form-item label="商品数量" prop="goods_number">
              <el-input type="number" v-model="addForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="cateList"
                :props="{
                  expandTrigger: 'hover',
                  value: 'cat_id',
                  label: 'cat_name',
                  children: 'children',
                }"
                @change="handleChanged"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              :label="item.attr_name"
              v-for="item in manyTableData"
              :key="item.attr_id"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  border
                  v-for="(cb, i) in item.attr_vals"
                  :key="i"
                  :label="cb"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              v-for="item in onlyTableData"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              :action="$http.defaults.baseURL + 'upload'"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headersObj"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <el-button @click="addGoods" class="addButton" type="primary"
              >添加商品</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 图片预览对话框 -->
    <el-dialog title="预览" :visible.sync="previewDialogVisible" width="50%">
      <img :src="previewURL" alt="" class="previewImg" />
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Add",
  data() {
    return {
      activeIndex: 0,
      addForm: {
        goods_name: "",
        goods_price: "0",
        goods_weight: "0",
        goods_number: "0",
        goods_cat: [],
        pics: [],
        goods_introduce: "",
        attrs: [],
      },
      addFormRules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" },
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" },
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" },
        ],
        goods_cat: [
          { required: true, message: "请输入商品分类", trigger: "blur" },
        ],
      },
      cateList: [],
      manyTableData: [],
      onlyTableData: [],
      headersObj: {
        Authorization: window.sessionStorage.getItem("token"),
      },
      previewURL: "",
      previewDialogVisible: false,
    };
  },
  computed: {
    cateId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2];
      } else return null;
    },
  },
  methods: {
    addGoods() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return this.$message.error("请填写必填项");
        const form = JSON.parse(JSON.stringify(this.addForm));
        form.goods_cat = form.goods_cat.join(",");
        this.manyTableData.forEach((item) => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_vals: item.attr_vals.join(","),
          };
          this.addForm.attrs.push(newInfo);
        });
        this.onlyTableData.forEach((item) => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_vals: item.attr_vals,
          };
          this.addForm.attrs.push(newInfo);
        });
        form.attrs = this.addForm.attrs;
        const { data: res } = await this.$http.post("goods", form);
        if (res.meta.status != 201) return this.$message.error("添加商品失败");
        this.$message.success("添加商品成功");
        this.$router.push("/goods");
      });
    },
    handleSuccess(res) {
      const picObj = { pic: res.data.tmp_path };
      this.addForm.pics.push(picObj);
    },
    handlePreview(file) {
      // console.log(file);
      this.previewURL = file.response.data.url;
      this.previewDialogVisible = true;
    },
    handleRemove(file) {
      // console.log(file);
      const tmp_path = file.response.data.tmp_path;
      const i = this.addForm.pics.findIndex((x) => x.pic === tmp_path);
      this.addForm.pics.splice(i, 1);
    },
    async tabClicked() {
      if (this.activeIndex === "1") {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          { params: { sel: "many" } }
        );
        if (res.meta.status != 200) return this.$message.error("获取参数失败");
        res.data.forEach((item) => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(",");
        });
        this.manyTableData = res.data;
      } else if (this.activeIndex === "2") {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          { params: { sel: "only" } }
        );
        if (res.meta.status != 200) return this.$message.error("获取属性失败");
        this.onlyTableData = res.data;
      }
    },
    beforeTabLeave(avtiveName, oldActiveName) {
      if (oldActiveName === "0" && this.addForm.goods_cat.length !== 3) {
        this.$message.error("请先选择商品分类！");
        return false;
      }
    },
    async getCateList() {
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status != 200) return this.$message.error("获取分类失败");
      this.cateList = res.data;
    },
    handleChanged() {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = [];
      }
    },
  },
  created() {
    this.getCateList();
  },
};
</script>

<style lang="less" scoped>
.el-checkbox {
  margin: 0 10px 0 0 !important;
}

.previewImg {
  width: 100%;
}

.addButton {
  margin-top: 15px;
}
</style>
