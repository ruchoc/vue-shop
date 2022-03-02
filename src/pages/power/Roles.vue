<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addDialogVisible = true"
            >添加角色</el-button
          >
        </el-col>
      </el-row>

      <!-- 角色表格 -->
      <el-table :data="roleList">
        <!-- 展开 -->
        <el-table-column type="expand" label="展开">
          <template slot-scope="scope">
            <el-row
              :class="[
                'border-bottom',
                i1 == 0 ? 'border-top' : '',
                'vertical-center',
              ]"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag
                  closable
                  @close="removeRightById(scope.row, item1.id)"
                  >{{ item1.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>

              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <!-- 渲染二级权限 -->
                <el-row
                  :class="[i2 == 0 ? '' : 'border-top', 'vertical-center']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 渲染三级权限 -->
                  <el-col :span="18">
                    <el-tag
                      closable
                      @close="removeRightById(scope.row, item3.id)"
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>

        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="showEditDialog(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="removeRoleById(scope.row.id)"
              >删除</el-button
            >
            <el-button
              @click="showSettingRightDialog(scope.row)"
              size="mini"
              type="warning"
              icon="el-icon-setting"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加角色对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <!-- 添加表单 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="70px"
      >
        <el-form-item label="角色名" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>

      <!-- 按钮 -->
      <span slot="footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑角色对话框 -->
    <el-dialog
      title="编辑角色"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <!-- 编辑表单 -->
      <el-form
        :model="editForm"
        :rules="addFormRules"
        ref="editFormRef"
        label-width="70px"
      >
        <el-form-item label="角色名" prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>

      <!-- 按钮 -->
      <span slot="footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 设置权限对话框 -->
    <el-dialog
      title="权限设置"
      :visible.sync="setRightDialogVisible"
      width="50%"
    >
      <!-- 树形结构 -->
      <el-tree ref="treeRef" :data="rightList" :props="treeProps" show-checkbox node-key="id" default-expand-all :default-checked-keys="defKey"></el-tree>

      <span slot="footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRight"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Roles",
  data() {
    return {
			roleId:'',
      roleList: [],
      rightList: {},
      addDialogVisible: false,
      editDialogVisible: false,
      setRightDialogVisible: false,
      treeProps: {
        children: "children",
        label: "authName",
      },
			// 默认节点选中ID
			defKey:[],
      addForm: {
        roleName: "",
        roleDesc: "",
      },
      editForm: {
        roleId: "",
        roleName: "",
        roleDesc: "",
      },
      addFormRules: {
        roleName: [
          { required: true, message: "请输入角色名", trigger: "blur" },
          {
            min: 1,
            max: 10,
            message: "请输入角色名在1~10位之间",
            trigger: "blur",
          },
        ],
        roleDesc: [
          {
            min: 0,
            max: 20,
            message: "角色描述不可超过20位",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    async getRoleList() {
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status != 200)
        return this.$message.error("获取角色列表失败");
      this.roleList = res.data;
    },
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    addRole() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post("roles", this.addForm);
        if (res.meta.status != 201) return this.$message.error("添加角色失败");
        this.addDialogVisible = false;
        this.getRoleList();
        this.$message.success("添加角色成功");
      });
    },
    editRole() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.put(
          "roles/" + this.editForm.roleId,
          this.editForm
        );
        if (res.meta.status != 200) return this.$message.error("编辑角色失败");
        this.editDialogVisible = false;
        this.getRoleList();
        this.$message.success("编辑角色成功");
      });
    },
    async showEditDialog(id) {
      const { data: res } = await this.$http.get("roles/" + id);
      if (res.meta.status != 200)
        return this.$message.error("获取角色列表失败");
      this.editForm = res.data;
      this.editDialogVisible = true;
    },
    async removeRoleById(id) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该角色, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmResult != "confirm") return this.$message.info("已取消删除");
      const { data: res } = await this.$http.delete("roles/" + id);
      if (res.meta.status != 200) return this.$message.error("删除角色失败");
      this.getRoleList();
      this.$message.success("删除角色成功");
    },
    async removeRightById(role, rightId) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该权限, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmResult != "confirm") return this.$message.info("已取消删除");

      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      );
      if (res.meta.status != 200) return this.$message.error("删除权限失败");
      role.children = res.data;
    },
    async showSettingRightDialog(role) {
			this.roleId=role.id
      const { data: res } = await this.$http.get("rights/tree");
      if (res.meta.status != 200)
        return this.$message.error("获取权限列表失败");
      this.rightList = res.data;
			this.defKey=[]
			this.getLeafKeys(role,this.defKey)
      this.setRightDialogVisible = true;
    },
		// 通过递归获取三级权限的id到defKey数组下
		getLeafKeys(node,arr){
			if(!node.children){
				return arr.push(node.id)
			}
			node.children.forEach(item=>this.getLeafKeys(item,arr))
		},
		async setRight(){
			const rids=[...this.$refs.treeRef.getCheckedKeys(),
			...this.$refs.treeRef.getHalfCheckedKeys()].join(',')
			const {data:res}=await this.$http.post(`roles/${this.roleId}/rights`,{rids:rids})
			if(res.meta.status!=200) return this.$message.error('设置权限失败')
			this.setRightDialogVisible=false
			this.getRoleList()
			this.$message.success('设置权限成功')
		}
  },
  created() {
    this.getRoleList();
  },
};
</script>

<style lang="less" scoped>
.vertical-center {
  display: flex;
  align-items: center;
}
</style>
