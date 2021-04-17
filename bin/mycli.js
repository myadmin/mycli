#!/usr/bin/env node
'use strict';
const program = require('commander');
const inquirer = require('inquirer');
const { green, red } = require('../utils');
const create = require('../src/create');
const question = require('../src/question');

program.version(require('../package.json').version);

/* mycli create 创建项目 */
program
  .command('create')
  .description('create a project')
  .action(function () {
    green(`👽 👽 👽 欢迎使用mycli, 轻松构建umi.js项目～🎉🎉🎉`);
    inquirer.prompt(question.create).then((answer) => {
      if (answer.conf) {
        /* 创建文件 */
        create(answer);
      }
    });
  });

/* mycli start 运行项目 */
program
  .command('start')
  .description('start a project')
  .action(function () {
    green('-------------运行项目-------------');
  });

/* mycli build 打包项目 */
program
  .command('build')
  .description('build a project')
  .action(function () {
    green('-------------构建项目-------------');
  });

program.parse(process.argv);

// 参考文档：https://juejin.cn/post/6919308174151385096
// 在线demo：https://github.com/GoodLuckAlien/rux-cli
