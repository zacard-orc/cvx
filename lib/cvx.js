/*
 * @authror : Leiyin.lin
 * @Date : 2020-12-01
 * @Project : cvx
 * @CorpChn : 上海珺程网络科技有限公司
 * @CorpEng : JadeProgram.Shanghai,Ltd.Co
 * @CorpBu : R&D
 * @WebSite : http://shjson.top
 * @WeChat : llysonylin2012
 * @DescriptionMain : xxx,xxx
 * @Description : ...
 */

/**
 * @param {object} evnt dom原生事件
 * @param {object} vm 组件实例
 * @param {object} opt 选项
 * @param {string} opt.FS 使用什么分割符号切割每一行字段，默认使用\\$，防止内容内出现逗号
 * @param {number} opt.tmout 解析超时
 * @param {boolean} opt.tree 是否树形目录
 */
const XLSX = require('xlsx');

const cvx = (evnt, vm, {
  FS = '\\$',
  tmout = 3000,
  tree = false,
}) => {
  const waitPr = new Promise((resolve, reject) => {
    setTimeout(() => {
      // eslint-disable-next-line prefer-promise-reject-errors
      reject(new Error('parse raw file error'));
    }, tmout);
  });

  const evPr = new Promise((resolve, reject) => {
    try {
      const { files } = evnt.target;
      // eslint-disable-next-line no-undef
      const fileReader = new FileReader();

      fileReader.onload = (ev) => {
        const data = ev.target.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const csvData = XLSX.utils.sheet_to_csv(workbook.Sheets.Sheet1, {
          FS,
        }).split('\n');

        const tableData = [];
        const nodeMap = {};
        const headArr = csvData.shift().split(FS);
        const head = {};
        // eslint-disable-next-line no-return-assign
        headArr.forEach((el) => head[el] = el);

        // eslint-disable-next-line array-callback-return
        csvData.reduce((prev, vRow) => {
          if (vRow) {
            const vCols = vRow.split(FS);

            if (vCols.length === 0) {
              reject(new Error('not enough fields'));
            }

            const item = {};
            vCols.forEach((val, cIndex) => {
              const column = headArr[cIndex];
              item[column] = val;
            });

            if (!tree) {
              tableData.push(item);
              return;
            }

            const colId = vCols[0].replace(/^[\D ]+/, '');
            const colIdSep = colId.split('.');

            item.seqId = colId;
            nodeMap[colId] = item;

            if (colIdSep.length > 1) {
              if (colIdSep.length > prev.tid.length) {
                /* deep 3.1
                /* deep 3.1.1
                 *
                 */

                // eslint-disable-next-line no-unused-expressions
                nodeMap[prev.tidShort].children
                  ? nodeMap[prev.tidShort].children.push(item)
                  : nodeMap[prev.tidShort].children = [item];
              } else {
                /* brother & float
                 * brother 3.1
                 *         3.2
                 *         3.3
                 *         3.4
                 *
                 * float 3.1.1
                 * float 3.1.1.1
                 * float 3.1.1.2
                 * float 3.1.1.3
                 * float 3.1.2
                 *
                 * float 3.0
                 * float 3.1
                 * float 3.1.1
                 * float 3.1.1.1
                 * float 3.1.1.2
                 * float 3.1.1.3
                 * float 3.2
                 *
                 */

                const bro = [];
                Object.assign(bro, colIdSep);
                bro.pop();
                // eslint-disable-next-line no-unused-expressions
                nodeMap[bro.join('.')].children
                  ? nodeMap[bro.join('.')].children.push(item)
                  : nodeMap[bro.join('.')].children = [item];
              }
            } else {
              tableData.push(item);
            }

            // eslint-disable-next-line consistent-return
            return {
              ...item,
              tid: colIdSep,
              tidShort: colId,
            };
          }
        }, {});

        // eslint-disable-next-line no-param-reassign
        evnt.target.value = '';
        resolve({
          headMap: head,
          headArr,
          tableData,
        });
      };
      fileReader.readAsBinaryString(files[0]);
    } catch (e) {
      reject(e);
    }
  });

  return Promise.race([evPr, waitPr]);
};

module.exports = {
  cvx,
};
