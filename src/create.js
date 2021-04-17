const fs = require('fs');
const color = require('../utils');
const npm = require('./install');

let fileCount = 0; // 文件数量
let dirCount = 0; // 文件夹数量
let flat = 0; // readir数量
let isInstall = false;

module.exports = (res) => {
  // 创建文件
  color.green('---------开始创建---------');
  // 找到template文件夹下的模板项目
  const sourcePath = __dirname.slice(0, -3) + 'template';
  color.blue('当前路径:' + process.cwd());
  // 修改package.json
  revisePackageJson(res, sourcePath).then(() => {
    copy(sourcePath, process.cwd(), npm());
  });
};

function revisePackageJson(res, sourcePath) {
  return new Promise((resolve) => {
    // 读取文件
    fs.readFile(sourcePath + '/package.json', (err, data) => {
      if (err) throw err;
      const { name } = res;
      let json = data.toString();
      // 替换模板
      json = json.replace(/demoName/g, name.trim());
      const path = process.cwd() + '/package.json';
      // 写入文件
      fs.writeFile(path, Buffer.from(json), () => {
        color.green('创建文件：' + path);
        resolve();
      });
    });
  });
}

/**
 * @param {*} sourcePath    template资源路径
 * @param {*} currentPath   当前项目路径
 * @param {*} cb            项目复制完成回调函数
 */
function copy(sourcePath, currentPath, cb) {
  flat++;
  // 读取文件夹下面的文件
  fs.readdir(sourcePath, (err, paths) => {
    flat--;
    if (err) {
      throw err;
    }
    paths.forEach((path) => {
      if (path !== '.git' && path !== 'package.json' && path !== '.DS_Store') {
        fileCount++;
      }
      const newSourcePath = sourcePath + '/' + path;
      const newCurrentPath = currentPath + '/' + path;
      // 判断文件信息
      fs.stat(newSourcePath, (err, stat) => {
        if (err) {
          throw err;
        }
        // 判断是文件，且不是package.json
        if (stat.isFile() && path !== 'package.json' && path !== '.DS_Store') {
          // 创建读写流
          const readSteam = fs.createReadStream(newSourcePath);
          const writeSteam = fs.createWriteStream(newCurrentPath);
          readSteam.pipe(writeSteam);
          color.green('创建文件：' + newCurrentPath);
          fileCount--;
          completeControl(cb);
        } else {
          // 判断是文件夹，对文件夹单独进行 dirExist 操作
          if (
            path !== '.git' &&
            path !== 'package.json' &&
            path !== '.DS_Store'
          ) {
            dirCount++;
            dirExist(newSourcePath, newCurrentPath, copy, cb);
          }
        }
      });
    });
  });
}

/**
 * @param {*} sourcePath    template资源路径
 * @param {*} currentPath   当前项目路径
 * @param {*} copyCallback  上面的 copy 函数
 * @param {*} cb            项目复制完成后的回调函数
 */
function dirExist(sourcePath, currentPath, copyCallback, cb) {
  fs.exists(currentPath, (ext) => {
    if (ext) {
      // 递归调用copy函数
      copyCallback(sourcePath, currentPath, cb);
    } else {
      fs.mkdir(currentPath, () => {
        fileCount--;
        dirCount--;
        copyCallback(sourcePath, currentPath, cb);
        color.yellow('创建文件夹：' + currentPath);
        completeControl(cb);
      });
    }
  });
}

/**
 * @param {*} cb        项目复制完成后的回调函数
 */
function completeControl(cb) {
  // 当最上面的三个变量均为0时，异步I/O执行完毕
  if (fileCount === 0 && dirCount === 0 && flat === 0) {
    color.green('-----------构建成功-----------');
    if (cb && !isInstall) {
      isInstall = true;
      color.blue('-----------开始install-----------');
      cb(() => {
        color.blue('-----------完成install-----------');
        // 判断是否存在webpack
        runProject();
      });
    }
  }
}

function runProject() {
  try {
    // 继续调用 npm 执行 npm start 命令
    const start = npm(['start']);
    start();
  } catch (e) {
    color.red('自动启动失败，请手动 npm start 启动项目');
  }
}
