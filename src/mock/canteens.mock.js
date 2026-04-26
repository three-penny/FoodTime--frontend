export const CANTEENS = [
  {
    id: 'xueyuan',
    name: '学苑餐厅',
    shortName: '学苑',
    image:
      'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1400&q=80',
    rating: 4.8,
    stamp: '必吃',
    location: '思源东楼一层',
    openHours: '06:30 - 21:30',
    avgPrice: '人均 ¥16 - ¥24',
    peakQueue: '11:45 - 12:10（排队最长）',
    bestTime: '11:20 前、12:30 后',
    summary:
      '窗口多、节奏快，适合课间冲刺。高峰虽然人多，但出餐效率在四家里最稳。',
    rant: '阿姨手抖看脸，今天多打一勺全看你表情。',
    features: ['高峰出餐快', '窗口品类多', '面食稳定', '盖饭不踩雷'],
    signatureDishes: ['红烧牛肉面', '黑椒鸡腿饭', '铁板小炒'],
    studentNotes: [
      '周三红烧肉窗口常提前售罄。',
      '排队时观察前两位点单速度，选快窗口更关键。',
      '遇到新手打饭阿姨，份量波动会更大。',
    ],
    introBlocks: [
      {
        title: '高峰建议',
        content:
          '11:45 - 12:10 是排队峰值。想十分钟内吃上饭，建议提前 15 分钟到。',
      },
      {
        title: '口味稳定度',
        content:
          '这家属于“保底型”食堂，调味中规中矩，不容易翻车，适合连续打卡。',
      },
      {
        title: '预算表现',
        content:
          '人均 20 左右能吃到比较完整的一餐，面食窗口是性价比上限。',
      },
    ],
  },
  {
    id: 'jiaogong',
    name: '教工餐厅',
    shortName: '教工',
    image:
      'https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=1400&q=80',
    rating: 4.6,
    stamp: '再来',
    location: '思源西楼二层',
    openHours: '07:00 - 20:30',
    avgPrice: '人均 ¥15 - ¥23',
    peakQueue: '12:00 - 12:20',
    bestTime: '12:35 后',
    summary:
      '口味偏轻，适合长期吃食堂。比起重口刺激，更强调“每天都能吃”。',
    rant: '看着清淡，番茄肥牛却经常把人香迷糊。',
    features: ['轻食友好', '低油少盐', '套餐更新快', '下午人少'],
    signatureDishes: ['番茄肥牛饭', '香菇滑鸡饭', '鸡胸沙拉碗'],
    studentNotes: [
      '重口同学记得主动加辣，不然会觉得淡。',
      '12:30 以后窗口切换更快，体验比高峰好很多。',
      '适合和健身搭子拼单。',
    ],
    introBlocks: [
      {
        title: '口味特点',
        content:
          '调味克制，油感轻。更适合平日高频吃，不会出现“吃完昏沉”的情况。',
      },
      {
        title: '排队体验',
        content:
          '午高峰比学苑略短，但窗口人手较少，建议挑队伍“短且快”的档口。',
      },
      {
        title: '营养组合',
        content:
          '主食+蛋白+蔬菜搭配容易凑齐，对作息不稳定的同学很友好。',
      },
    ],
  },
  {
    id: 'qinghe',
    name: '清河餐厅',
    shortName: '清河',
    image:
      'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1400&q=80',
    rating: 4.7,
    stamp: '必吃',
    location: '学活北侧一层',
    openHours: '06:30 - 22:00',
    avgPrice: '人均 ¥14 - ¥24',
    peakQueue: '18:10 - 18:40',
    bestTime: '20:30 后（夜宵友好）',
    summary:
      '夜宵时段最能打，汤面和小碗菜稳定，晚课后“续命指数”拉满。',
    rant: '晚十点还有热汤，熬夜党把这里当食堂避风港。',
    features: ['夜宵时段长', '汤面稳', '重口味友好', '小碗菜灵活'],
    signatureDishes: ['酸汤米线', '藤椒拌面', '牛肉煲仔饭'],
    studentNotes: [
      '考试周 21:00 后人会突然变多。',
      '想要锅气就盯现炒窗口，别走预制快线。',
      '夜间档口更看师傅手感，稳定性有波动。',
    ],
    introBlocks: [
      {
        title: '夜间优势',
        content:
          '21:30 后仍有稳定供应，是“晚课+自习”人群的补给点。',
      },
      {
        title: '风味标签',
        content:
          '酸辣、麻香、锅气是这家的关键词，重口党满意度很高。',
      },
      {
        title: '预算建议',
        content:
          '16-20 元区间选择最多，想吃得更扎实可加主食或小碗菜。',
      },
    ],
  },
  {
    id: 'siyuan',
    name: '思源餐厅',
    shortName: '思源',
    image:
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1400&q=80',
    rating: 4.4,
    stamp: '踩雷',
    location: '思源楼地下一层',
    openHours: '07:00 - 21:00',
    avgPrice: '人均 ¥12 - ¥20',
    peakQueue: '11:55 - 12:15',
    bestTime: '17:20 - 17:50',
    summary:
      '价格友好但出品波动较大，属于“看窗口吃饭”的食堂，熟客优势明显。',
    rant: '周三红烧肉别错过，其它天就看缘分了。',
    features: ['价格友好', '菜量足', '窗口波动大', '熟客优势明显'],
    signatureDishes: ['宫保鸡丁盖饭', '番茄鸡蛋面', '香酥鱼排饭'],
    studentNotes: [
      '同一道菜不同窗口差异明显。',
      '预算紧张时很顶，但别盲点新窗口。',
      '高峰期换菜快，最好先看前人餐盘再下单。',
    ],
    introBlocks: [
      {
        title: '省钱策略',
        content:
          '基础套餐覆盖面广，预算紧张时能稳定解决一餐。',
      },
      {
        title: '避坑方式',
        content:
          '优先点熟悉窗口，首次尝试建议跟“高频回头客”同款。',
      },
      {
        title: '评价分歧',
        content:
          '这家两极分化明显：有人每天来，也有人一周踩两次雷。',
      },
    ],
  },
];

export const HOME_CANTEEN_SPOTS = [
  {
    id: 'xueyuan-lunch-rush',
    canteenId: 'xueyuan',
    name: '学苑 · 午高峰速战位',
    image:
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1400&q=80',
    rating: 4.8,
    price: 20,
    valueNote: '快且稳',
    stamp: '必吃',
    comment: '想 20 分钟吃完返教室，这个点最稳。',
    recommendVotes: 126,
    avoidVotes: 19,
  },
  {
    id: 'xueyuan-noodle-night',
    canteenId: 'xueyuan',
    name: '学苑 · 面食夜补位',
    image:
      'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?auto=format&fit=crop&w=1400&q=80',
    rating: 4.7,
    price: 18,
    valueNote: '热汤顶饿',
    stamp: '再来',
    comment: '晚课后冲一碗，精神状态立刻回线。',
    recommendVotes: 98,
    avoidVotes: 14,
  },
  {
    id: 'jiaogong-light-lunch',
    canteenId: 'jiaogong',
    name: '教工 · 轻食午餐位',
    image:
      'https://images.unsplash.com/photo-1543353071-10c8ba85a904?auto=format&fit=crop&w=1400&q=80',
    rating: 4.6,
    price: 19,
    valueNote: '控油友好',
    stamp: '再来',
    comment: '下午还有课的时候，这里吃完不会犯困。',
    recommendVotes: 84,
    avoidVotes: 17,
  },
  {
    id: 'jiaogong-tomato-hit',
    canteenId: 'jiaogong',
    name: '教工 · 番茄肥牛档',
    image:
      'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=1400&q=80',
    rating: 4.8,
    price: 23,
    valueNote: '酸甜稳妥',
    stamp: '必吃',
    comment: '挑不出毛病的一道，连吃三次都不腻。',
    recommendVotes: 139,
    avoidVotes: 22,
  },
  {
    id: 'qinghe-midnight-noodle',
    canteenId: 'qinghe',
    name: '清河 · 夜宵米线位',
    image:
      'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1400&q=80',
    rating: 4.7,
    price: 17,
    valueNote: '夜宵首选',
    stamp: '必吃',
    comment: '图书馆闭馆后，几乎都在这儿偶遇熟人。',
    recommendVotes: 152,
    avoidVotes: 11,
  },
  {
    id: 'qinghe-spicy-line',
    canteenId: 'qinghe',
    name: '清河 · 重口进攻位',
    image:
      'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=1400&q=80',
    rating: 4.6,
    price: 21,
    valueNote: '辣得痛快',
    stamp: '再来',
    comment: '压力大时吃这一口，心态会变好。',
    recommendVotes: 90,
    avoidVotes: 26,
  },
  {
    id: 'siyuan-budget-save',
    canteenId: 'siyuan',
    name: '思源 · 预算守护位',
    image:
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1400&q=80',
    rating: 4.4,
    price: 16,
    valueNote: '便宜管饱',
    stamp: '再来',
    comment: '月底钱包告急时，靠它撑住体面。',
    recommendVotes: 76,
    avoidVotes: 31,
  },
  {
    id: 'siyuan-risk-window',
    canteenId: 'siyuan',
    name: '思源 · 看脸窗口位',
    image:
      'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=1400&q=80',
    rating: 4.2,
    price: 15,
    valueNote: '波动很大',
    stamp: '踩雷',
    comment: '同一菜不同天像两家店，赌运气成分太高。',
    recommendVotes: 43,
    avoidVotes: 79,
  },
  {
    id: 'xueyuan-iron-plate',
    canteenId: 'xueyuan',
    name: '学苑 · 铁板爆香位',
    image:
      'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=1400&q=80',
    rating: 4.7,
    price: 22,
    valueNote: '锅气拉满',
    stamp: '必吃',
    comment: '听到铁板声就知道这顿饭稳了。',
    recommendVotes: 117,
    avoidVotes: 16,
  },
  {
    id: 'qinghe-claypot-line',
    canteenId: 'qinghe',
    name: '清河 · 煲仔慢吃位',
    image:
      'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1400&q=80',
    rating: 4.6,
    price: 24,
    valueNote: '香但略贵',
    stamp: '再来',
    comment: '赶时间不建议，慢慢吃才有味道。',
    recommendVotes: 68,
    avoidVotes: 24,
  },
];

export const HOME_RANKINGS = [
  {
    rank: 1,
    dishId: 'braised-beef-noodle',
    canteenId: 'xueyuan',
    dishName: '红烧牛肉面',
    score: 4.9,
    stamp: '必吃',
    recommendVotes: 188,
    avoidVotes: 9,
  },
  {
    rank: 2,
    dishId: 'black-pepper-chicken',
    canteenId: 'xueyuan',
    dishName: '黑椒鸡腿饭',
    score: 4.8,
    stamp: '必吃',
    recommendVotes: 170,
    avoidVotes: 13,
  },
  {
    rank: 3,
    dishId: 'tomato-beef-rice',
    canteenId: 'jiaogong',
    dishName: '番茄肥牛饭',
    score: 4.8,
    stamp: '必吃',
    recommendVotes: 165,
    avoidVotes: 15,
  },
  {
    rank: 4,
    dishId: 'sour-soup-rice-noodle',
    canteenId: 'qinghe',
    dishName: '酸汤米线',
    score: 4.7,
    stamp: '再来',
    recommendVotes: 142,
    avoidVotes: 18,
  },
  {
    rank: 5,
    dishId: 'beef-claypot-rice',
    canteenId: 'qinghe',
    dishName: '牛肉煲仔饭',
    score: 4.7,
    stamp: '再来',
    recommendVotes: 130,
    avoidVotes: 22,
  },
  {
    rank: 6,
    dishId: 'spicy-hot-pot',
    canteenId: 'xueyuan',
    dishName: '麻辣香锅',
    score: 4.6,
    stamp: '再来',
    recommendVotes: 124,
    avoidVotes: 33,
  },
  {
    rank: 7,
    dishId: 'mushroom-chicken-rice',
    canteenId: 'jiaogong',
    dishName: '香菇滑鸡饭',
    score: 4.6,
    stamp: '再来',
    recommendVotes: 113,
    avoidVotes: 24,
  },
  {
    rank: 8,
    dishId: 'vine-pepper-noodle',
    canteenId: 'qinghe',
    dishName: '藤椒鸡丝拌面',
    score: 4.6,
    stamp: '再来',
    recommendVotes: 108,
    avoidVotes: 28,
  },
  {
    rank: 9,
    dishId: 'kungpao-chicken-rice',
    canteenId: 'siyuan',
    dishName: '宫保鸡丁盖饭',
    score: 4.5,
    stamp: '再来',
    recommendVotes: 95,
    avoidVotes: 39,
  },
  {
    rank: 10,
    dishId: 'chicken-salad-bowl',
    canteenId: 'jiaogong',
    dishName: '轻盈鸡胸沙拉碗',
    score: 4.5,
    stamp: '再来',
    recommendVotes: 86,
    avoidVotes: 34,
  },
];
