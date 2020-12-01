<template>
    <div>
        <p class="tip">
            键盘移动高亮行，设置
            <table-api-link prop="keyboard-config"/>
            ={isArrow: true, isEnter: true} 启用方向键功能<br>
            <span class="red">(注：树结构不支持大量数据，如果数据量超过 500 条，请谨慎使用！)</span>
        </p>

        <p>
            <!--      <vxe-button @click="importDataEvent">导入aa</vxe-button>-->
            <!--      <template v-slot:buttons>-->
            <vxe-button>
                <input type="file" @change="importDataEvent" accept=".xls,.xlsx,.csv">
            </vxe-button>

            <!--      </template>-->
            <vxe-button @click="clearData">清空</vxe-button>
            <vxe-button @click="exportDataEvent">导出</vxe-button>
        </p>

        <vxe-grid
                ref="xTable"
                highlight-current-row
                :mouse-config="{selected: true}"
                :keyboard-config="{isArrow: true, isDel: true, isEnter: true, isTab: true, isEdit: true}"
                :edit-config="{trigger: 'dblclick', mode: 'cell'}"
                :checkbox-config="{range: true}"
                :columns="tableColumnDef"
                :data="tableData"
                :tree-config="{children: 'children'}"
        >
            <!--      tree -->
            <!--      <vxe-table-column type="seq" title="编号" width="60"></vxe-table-column>-->
            <!--&lt;!&ndash;      <vxe-table-column type="checkbox" width="60"></vxe-table-column>&ndash;&gt;-->
            <!--      <vxe-table-column field="ljmc" title="零件名称" tree-node></vxe-table-column>-->
            <!--      <vxe-table-column field="cl" title="材料" :edit-render="{name: 'input'}"></vxe-table-column>-->
            <!--      <vxe-table-column field="gy" title="工艺" :edit-render="{name: 'input'}"></vxe-table-column>-->
            <!--      <vxe-table-column field="djzl" title="单件重量" :edit-render="{name: 'input'}"></vxe-table-column>-->
            <!--      <vxe-table-column field="role" title="角色" :edit-render="{name: '$select', options: roleList, props: {clearable: true, multiple: true}, events: {change: roleChangeEvent}}"></vxe-table-column>-->
            <!--      <vxe-table-column field="ddtime" title="日期" :edit-render="{name: '$input', props: {type: 'date'}, events: {change: roleChangeEvent} }"></vxe-table-column>-->

            <!--      <vxe-table-column type="seq" width="60"></vxe-table-column>-->
            <!--      <vxe-table-column field="name" title="Name"></vxe-table-column>-->
            <!--      <vxe-table-column field="sex" title="Sex"></vxe-table-column>-->
            <!--      <vxe-table-column field="age" title="Age" sortable></vxe-table-column>-->
            <!--      <vxe-table-column field="boom" title="Boom" sortable></vxe-table-column>-->
            <!--      <vxe-table-column field="address" title="Address" show-overflow></vxe-table-column>-->
            <!--      <vxe-table-column field="name" title="Name" tree-node></vxe-table-column>-->
            <!--      <vxe-table-column field="size" title="Size"></vxe-table-column>-->
            <!--      <vxe-table-column field="type" title="Type"></vxe-table-column>-->
            <!--      <vxe-table-column field="date" title="Date"></vxe-table-column>-->
        </vxe-grid>

        <pre>
      <code>
        | Arrow Up ↑ | 移动到高亮行的上一行 |
        | Arrow Down ↓ | 移动到高亮行的下一行 |
        | Enter | 展开节点，进入子节点 |
        | Backspace | 关闭节点，返回到父节点 |
      </code>
    </pre>

        <!--    <p class="demo-code">{{ $t('app.body.button.showCode') }}</p>-->

        <!--    <pre>-->
        <!--      <code class="xml">{{ demoCodes[0] }}</code>-->
        <!--      <code class="javascript">{{ demoCodes[1] }}</code>-->
        <!--    </pre>-->
    </div>
</template>

<script>
  // import hljs from 'highlight.js'
  import XEUtils from 'xe-utils'
  import XLSX from 'xlsx'

  // import { cvx } from './cvx'

  import { cvx } from 'zacard-cvx'

  /*
    http://localhost:8080/#/table/tree/highlightImp
     */
  export default {
    data () {
      return {
        tableData: [],
        selectRow: null,
        demoCodes: [],
        tableColumnDef: [
          // 普通
          { field: 'name', title: 'Name' },
          { field: 'sex', title: 'Sex', formatter: this.formatterSex },
          { field: 'age', title: 'Age' },
          { field: 'boom', title: 'Boom', showOverflow: true }

          // 树
          // { field: 'seqId', title: '编号', treeNode: true },
          // { field: '零件名称', title: '零件名称' },
          // { field: '材料', title: '材料' },
          // { field: '工艺', title: '工艺' },
          // { field: '单件重量', title: '单件重量' },
          // { field: '角色', title: '角色' },
          // { field: '日期', title: '日期' }
        ],
        roleList: [
          {
            label: '前端',
            value: '1',
            disabled: false
          },
          {
            label: '后端',
            value: '2',
            disabled: false
          },
          {
            label: '项目经理',
            value: '3',
            disabled: false
          },
          {
            label: '设计师',
            value: '4',
            disabled: false
          },
          {
            label: '运维',
            value: '5',
            disabled: false
          }
        ]
      }
    },
    created () {
      // this.tableData = XEUtils.clone(window.MOCK_TREE_DATA_LIST, true)
      // this.tableData = []
    },
    mounted () {
      // Array.from(this.$el.querySelectorAll('pre code')).forEach((block) => {
      //   hljs.highlightBlock(block)
      // })
    },
    methods: {
      updateRoleList () {
        // 获取表格中的全量数据
        const { fullData } = this.$refs.xTable.getTableData()
        this.roleList.forEach(item => {
          if (item.value) {
            // 如果当前选项已经被选过，则禁用
            item.disabled = fullData.some(row => row.role === item.value)
          }
        })
      },
      roleChangeEvent (e) {
        // this.updateRoleList()
        console.log(e)
      },
      importDataEvent (evnt) {
        cvx(evnt, this, {
          tree: false
        })
          .then(res => {
            console.log(res)
            const {
              tableData
            } = res
            this.tableData = tableData
          })
          .catch(e => {
            console.error(e)
          })
      },
      exportDataEvent () {
        this.$refs.xTable.exportData({
          filename: '2012导出demo',
          sheetName: 'Sheet1',
          type: 'xlsx'
        })
      },
      clearData () {
        this.tableData = []
      }
    }
  }
</script>
