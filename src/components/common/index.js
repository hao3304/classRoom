export const tranObj = model => {
  return () => {
    let newModel = {};
    Object.keys(model).forEach(key => {
      if (typeof model[key] == "object") {
        newModel[key] = model[key].defaults;
      } else {
        newModel[key] = null;
      }
    });
    return newModel;
  };
};
export const getModel = model => {
  let newModel = {};
  Object.keys(model).forEach(key => {
    if (typeof model[key] == "object") {
      newModel[key] = model[key].name;
    } else {
      newModel[key] = model[key];
    }
  });
  return newModel;
};
export const mouseEvent = {
  wheel(opt) {
    console.log(opt);
    if (!opt.target) {
      console.log("什么都没有，还让我帮忙！");
      return;
    }
    let callback = opt.callback || function() {};
    let target = opt.target;

    //获取兼容事件
    let mouseWheel = /Firefox/i.test(navigator.userAgent)
      ? "DOMMouseScroll"
      : "mousewheel";

    //IE
    if (document.attachEvent) {
      document.attachEvent("on" + mouseWheel, function(e) {
        if (e.target.parentElement == target) {
          callback(e, e.wheelDelta);
        }
      });
    }

    //FF、Chrome、Opera、safari
    else {
      document.addEventListener(mouseWheel, function(e) {
        e = e || window.event;
        if ($(e.target).parents("." + target.className)[0] == target) {
          if (e.detail) {
            //FF
            callback(e, e.detail * 40);
          } else {
            callback(e, e.wheelDelta);
          }
        }
      });
    }
  }
};
