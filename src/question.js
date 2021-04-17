const create = [
  {
    name: 'conf',
    type: 'confirm',
    message: '是否创建新的项目?',
  },
  {
    name: 'name',
    message: '请输入项目名称',
    when: (res) => Boolean(res.conf),
  },
];

module.exports = {
  create,
};
