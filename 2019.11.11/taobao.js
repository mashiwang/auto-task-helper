auto();
device.keepScreenDim();

const appName = "手机淘宝";
const _findOne = (selector, timeout, message) => {
  const isExit = !!message;
  timeout = timeout || 10000;
  message = "脚本异常 " + (message || "已停止执行，请重新执行");
  const ret = selector.findOne(timeout);
  if (!ret) {
    console.log("L12: ", selector, message);
    toastLog(message);
    isExit && exit();
  }
  return ret;
};

launchApp(appName);
toastLog("开启app后如不在首页请手动返回首页。");

const btn = _findOne(desc("捉猫猫"), 5000, "请手动进入活动界面");
if (btn) {
  btn.click();
}

const getCatCoin = className("android.view.View")
  .clickable(true)
  .depth(18)
  .indexInParent(5);

const catCoin = _findOne(getCatCoin, 10000, "请手动点击领猫币");
if (catCoin) {
  catCoin.click();
}
const WAIT_TIME = dialogs.input("请输入任务等待时长", 23000);

const getTask = text => () => {
  const taskBtn = textContains(text);
  const x = device.width / 2;
  const y = device.height / 2;

  // taskBtn.waitFor();
  taskBtn.click();
  sleep(2000);
  gesture(1000, [x, y], [x, 0]);
  sleep(WAIT_TIME);
  back();
  sleep(1000);
};

const loopWorker = taskName => {
  const task = getTask(taskName);
  let count = 1;
  textContains(taskName).findOne(5000);
  while (textContains(taskName).exists()) {
    toastLog("开始执行第" + count + '个"' + taskName + '"任务');
    task();
    toastLog("已完成第" + count + '个"' + taskName + '"任务');
    count = count + 1;
  }
};

//text('签到').findOne().click();
// 逛20个店铺
loopWorker("去进店");

// 除了逛店铺外的几个任务
loopWorker("去浏览");

toastLog("已执行完全部任务，请检查。");
device.cancelKeepingAwake();
