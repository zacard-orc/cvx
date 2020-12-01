# cvx
convert tree xlsx import into vxe-grid metadata


# Install
```text
yarn add cvx
```

# How to use
```javascript

<vxe-button>
   <input type="file" @change="importDataEvent" accept=".xls,.xlsx,.csv">
</vxe-button>

const mockVueMehtods = {
  importDataEvent (evnt) {
      cvx(evnt, this, {
        tree: true
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
  }
}
```

# Reference
```markdown
/**
 * @param {object} evnt dom原生事件
 * @param {object} vm 组件实例
 * @param {object} opt 选项
 * @param {string} opt.FS 使用什么分割符号切割每一行字段，默认使用\\$，防止内容内出现逗号
 * @param {number} opt.tmout 解析超时
 * @param {boolean} opt.tree 是否树形目录
 */
```
