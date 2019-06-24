const palette_config = {
  scene: {
    name: "电力",
    items: [
      { name: "文字", image: "__text__", type: ht.Text },
      { name: "箭头", image: "symbols/电力/arrow.json" },
      { name: "地线", image: "symbols/电力/earthwire.json" },
      { name: "闪烁灯", image: "symbols/电力/light.json" },
      { name: "闪烁灯2", image: "symbols/电力/xLight.json" },
      { name: "红灯", image: "symbols/隧道用图标/交通灯/灯/灯-红.json" },
      { name: "绿灯", image: "symbols/隧道用图标/交通灯/灯/灯-绿.json" },
      { name: "T接线", image: "symbols/电力/T接线.json" },
      { name: "避雷器", image: "symbols/电力/避雷器.json" },
      {
        name: "带单触头高压跌落式熔断器的手车变压",
        image: "symbols/电力/带单触头高压跌落式熔断器的手车变压.json"
      },
      {
        name: "带有载调压俩圈自耦变压器",
        image: "symbols/电力/带有载调压俩圈自耦变压器.json"
      },
      { name: "刀闸", image: "symbols/电力/刀闸.json", type: ht.Switch },
      { name: "电抗", image: "symbols/电力/电抗.json" },
      { name: "电力电感器", image: "symbols/电力/电力电感器.json" },
      { name: "电流互感器", image: "symbols/电力/电流互感器.json" },
      { name: "电容式电压互感器", image: "symbols/电力/电容式电压互感器.json" },
      { name: "电压互感器1", image: "symbols/电力/电压互感器1.json" },
      { name: "电压互感器2", image: "symbols/电力/电压互感器2.json" },
      { name: "电压互感器3", image: "symbols/电力/电压互感器3.json" },
      { name: "电阻", image: "symbols/电力/电阻.json" },
      { name: "放电间隙", image: "symbols/电力/放电间隙.json" },
      { name: "分裂电抗", image: "symbols/电力/分裂电抗.json" },
      { name: "高压熔断器", image: "symbols/电力/高压熔断器.json" },
      { name: "接地", image: "symbols/电力/接地.json" },
      { name: "禁止操作", image: "symbols/电力/禁止操作.json" },
      { name: "禁止分闸", image: "symbols/电力/禁止分闸.json" },
      { name: "禁止合闸", image: "symbols/电力/禁止合闸.json" },
      {
        name: "禁止合闸线路有人工作",
        image: "symbols/电力/禁止合闸线路有人工作.json"
      },
      { name: "禁止合闸有人工作", image: "symbols/电力/禁止合闸有人工作.json" },
      { name: "静止无功补偿器", image: "symbols/电力/静止无功补偿器.json" },
      { name: "开关", image: "symbols/电力/开关.json" },
      { name: "其它遥测", image: "symbols/电力/其它遥测.json" },
      { name: "熔断开关", image: "symbols/电力/熔断开关.json" },
      { name: "设备在检修", image: "symbols/电力/设备在检修.json" },
      { name: "手车刀闸", image: "symbols/电力/手车刀闸.json" },
      { name: "停电", image: "symbols/电力/停电.json" },
      { name: "无功遥测", image: "symbols/电力/无功遥测.json" },
      { name: "消弧线圈", image: "symbols/电力/消弧线圈.json" },
      { name: "已接地", image: "symbols/电力/已接地.json" },
      { name: "有功遥测", image: "symbols/电力/有功遥测.json" },
      { name: "在此工作", image: "symbols/电力/在此工作.json" },
      { name: "站用变", image: "symbols/电力/站用变.json" },
      { name: "阻波器", image: "symbols/电力/阻波器.json" }
    ]
  },
  food: {
    name: "食品加工厂",
    items: [
      {
        name: "间歇式流化床处理器",
        image: "symbols/food/Batch fluid bed processor.json"
      },
      { name: "啤酒瓶", image: "symbols/food/Beer bottle.json" },
      {
        name: "台式均质机",
        image: "symbols/food/Batch fluid bed processor.json"
      },
      { name: "浓缩机", image: "symbols/food/Concentrate dispenser.json" },
      {
        name: "无污染正排量泵",
        image: "symbols/food/Contamination-free positive displacement pump.json"
      },
      { name: "十字带分离器", image: "symbols/food/Cross belt separator.json" },
      { name: "脱水生产线", image: "symbols/food/Dehydration line.json" },
      { name: "脱水", image: "symbols/food/Dehydrator.json" },
      { name: "灌装系统1", image: "symbols/food/Filling system 1.json" },
      { name: "灌装系统2", image: "symbols/food/Filling system 2.json" },
      { name: "过滤系统", image: "symbols/food/Filter system.json" },
      { name: "食品加工", image: "symbols/food/Food processing.json" },
      {
        name: "玻璃瓶 (无瓶盖)",
        image: "symbols/food/Glass bottle (no cap).json"
      },
      { name: "瓶盖玻璃瓶", image: "symbols/food/Glass bottle with cap.json" },
      { name: "谷物筒仓", image: "symbols/food/Grain silo.json" },
      {
        name: "内联搅拌机乳化剂1",
        image: "symbols/food/Inline mixer emulsifier 1.json"
      },
      {
        name: "内联搅拌机乳化剂2",
        image: "symbols/food/Inline mixer emulsifier 2.json"
      },
      { name: "金属探测器", image: "symbols/food/Metal detector.json" },
      { name: "微型流量计", image: "symbols/food/Micro flowmeter.json" },
      { name: "牛奶纸盒", image: "symbols/food/Milk carton.json" },
      { name: "搅拌机", image: "symbols/food/Mixer.json" },
      { name: "搅拌料斗", image: "symbols/food/Mixing hopper.json" },
      { name: "氮气发生器", image: "symbols/food/Nitrogen generator.json" },
      {
        name: "在线水分和成分分析仪",
        image: "symbols/food/Online moisture and constituent analyzer.json"
      },
      { name: "烤箱系统", image: "symbols/food/Oven system.json" },
      { name: "塑料瓶", image: "symbols/food/Plastic bottle.json" },
      {
        name: "动力和液体搅拌机",
        image: "symbols/food/Power and liquid mixer.json"
      },
      {
        name: "卫生内联搅拌机",
        image: "symbols/food/Sanitary inline mixer.json"
      },
      { name: "卫生输送泵", image: "symbols/food/Sanitary transfer pump.json" },
      { name: "屏幕分离器", image: "symbols/food/Screen separator.json" },
      { name: "十字带分离器", image: "symbols/food/Separator 1.json" }
    ]
  },
  pumps: {
    name: "污水处理",
    items: [
      { name: "3维泵", image: "symbols/pumps/3-D Pump.json" },
      { name: "18-惠勒卡车", image: "symbols/pumps/18-wheeler truck 1.json" },
      { name: "好氧沼气池", image: "symbols/pumps/Aerobic digester 1.json" },
      {
        name: "厌氧序批反应器",
        image: "symbols/pumps/Anaerobic sequencing batch reactor.json"
      },
      { name: "模拟仪表", image: "symbols/pumps/Analog gauge.json" },
      { name: "路障1", image: "symbols/pumps/Barricade 1.json" },
      {
        name: "整体泵-电机轴离心泵",
        image:
          "symbols/pumps/Centrifugal pump with integral pump-motor shaft.json"
      },
      { name: "澄清池", image: "symbols/pumps/Clarifier 4.json" },
      {
        name: "隔膜活化剂控制阀",
        image: "symbols/pumps/Control valve with diaphragm activator.json"
      },
      { name: "沼气池", image: "symbols/pumps/Digester 1.json" },
      { name: "烘干系统", image: "symbols/pumps/Drying system.json" },
      {
        name: "转储卡车 (上升)",
        image: "symbols/pumps/Dump truck (raised).json"
      },
      { name: "高水箱", image: "symbols/pumps/Elevated tank 9.json" },
      { name: "流门 (闭合)", image: "symbols/pumps/Flow gate (closed).json" },
      { name: "流门 (开启)", image: "symbols/pumps/Flow gate (open).json" },
      { name: "槽式高水箱", image: "symbols/pumps/Fluted elevated tank.json" },
      { name: "叉车", image: "symbols/pumps/Fork lift 1.json" },
      { name: "手动阀", image: "symbols/pumps/Hand valve 2.json" },
      { name: "手持式仪表", image: "symbols/pumps/Hand-held meter.json" },
      {
        name: "液体真空罐车",
        image: "symbols/pumps/Liquid vacuum tanker.json"
      },
      {
        name: "低型材滚筒秤",
        image: "symbols/pumps/Low profile drum scale.json"
      },
      { name: "油井泵", image: "symbols/pumps/Oil well pump.json" },
      { name: "橙色塔架", image: "symbols/pumps/Orange pylon.json" },
      { name: "氧气发生器", image: "symbols/pumps/Oxygen generator.json" },
      {
        name: "搅拌机加筋罐",
        image: "symbols/pumps/Reinforced tank with mixer.json"
      },
      {
        name: "工业防水铝头 RTD",
        image:
          "symbols/pumps/RTD with industrial weatherproof aluminum head.json"
      },
      { name: "潜水龙头", image: "symbols/pumps/Submersible mixer.json" },
      { name: "水箱泵", image: "symbols/pumps/Sump pump.json" },
      { name: "废水粉碎机", image: "symbols/pumps/Wastewater grinder.json" }
    ]
  }
};

export default {
  base: {
    name: "基础类型",
    items: [{ name: "文字", image: "__text__", type: window.ht.Text }]
  },
  pumps: {
    name: "业务图形",
    items: [
      {
        name: "3维泵",
        image: require("./symbols/pumps/3d_pump.json")
      }
    ]
  }
};
