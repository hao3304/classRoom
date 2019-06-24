var colorObject = {
  func: function(item) {
    return item.selected ? "#1E90FF" : "#000";
  }
};

export const toolbar_config_left = [
  {
    id: "edit",
    unfocusable: true,
    toolTip: "编辑",
    groupId: "bar",
    icon: {
      width: 16,
      height: 16,
      comps: [
        {
          type: "image",
          name: "symbols/toolbarIcon/select.json",
          color: colorObject
        }
      ]
    },
    action: function() {
      g2d.setEditable(true);
    }
  },
  {
    id: "edge",
    unfocusable: true,
    toolTip: "连线",
    groupId: "bar",
    icon: {
      width: 16,
      height: 16,
      comps: [
        {
          type: "image",
          name: "symbols/toolbarIcon/edge.json",
          color: colorObject
        }
      ]
    },
    action: function() {
      g2d.setInteractors([edgeInteractor]);
      g2d.sm().cs();
    }
  },
  {
    id: "rightAngle",
    unfocusable: true,
    toolTip: "直角连线",
    groupId: "bar",
    icon: {
      width: 16,
      height: 16,
      comps: [
        {
          type: "image",
          name: "symbols/toolbarIcon/right-angle.json",
          color: colorObject
        }
      ]
    },
    action: function() {
      g2d.setInteractors([rightAngleInteractor]);
      g2d.sm().cs();
    }
  },
  {
    id: "polyline",
    unfocusable: true,
    toolTip: "多边形",
    groupId: "bar",
    icon: {
      width: 16,
      height: 16,
      comps: [
        {
          type: "image",
          name: "symbols/toolbarIcon/polygon.json",
          color: colorObject
        }
      ]
    },
    action: function() {
      g2d.setInteractors([shapeInteractor]);
      g2d.sm().cs();
    }
  }
];

export const toolbar_config_right = [
  {
    id: "rulerframe",
    icon: {
      width: 16,
      height: 16,
      comps: [
        {
          type: "image",
          name: "symbols/toolbarIcon/rulerframe.json",
          color: colorObject
        }
      ]
    },
    toolTip: "刻度尺",
    type: "toggle",
    selected: true,
    action: function() {
      rulerFrame.getTopRulerConfig().visible = this.selected;
      rulerFrame.getLeftRulerConfig().visible = this.selected;
      rulerFrame.validateImpl();
    }
  },
  {
    icon: "symbols/toolbarIcon/zoom-in.json",
    toolTip: "放大",
    action: function() {
      g2d.zoomIn(true);
    }
  },
  {
    icon: "symbols/toolbarIcon/zoom-out.json",
    toolTip: "缩小",
    action: function() {
      g2d.zoomOut(true);
    }
  },
  {
    icon: "symbols/toolbarIcon/export.json",
    toolTip: "序列化场景",
    action: function() {
      showSerializerDialog(dataModel.serialize(2));
    }
  }
];
