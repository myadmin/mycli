const inquirer = require('inquirer');
const question = require('./question');

// inquirer
//   .prompt([
//     /* 把你的问题传过来 */
//   ])
//   .then((answer) => {
//     /* 反馈用户内容 */
//   })
//   .catch((error) => {
//     /* 出现错误 */
//   });

function create() {
  return new Promise((resolve) => {
    inquirer.prompt(question.create).then((res) => {
      resolve(res);
    });
  });
}

module.exports = {
  create,
};
