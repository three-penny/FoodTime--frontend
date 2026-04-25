export const CANTEENS = [
  {
    id: 'xueyuan',
    name: '学苑餐厅',
    shortName: '学苑',
    image:
      'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1400&q=80',
    rating: 4.8,
    location: '思源东楼一层',
    openHours: '06:30 - 21:30',
    summary:
      '主打家常菜与地方风味窗口，出餐快、选择多，是午晚高峰最受欢迎的食堂之一。',
    features: ['高峰出餐快', '窗口品类多', '支持自选套餐'],
    introBlocks: [
      {
        title: '就餐体验',
        content:
          '动线清晰，排队区与取餐区分离。高峰期建议避开 11:45 - 12:10，体验更好。',
      },
      {
        title: '人气窗口',
        content: '红烧牛肉面、铁板黑椒鸡腿饭、番茄肥牛盖饭，稳定高分。',
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
    location: '思源西楼二层',
    openHours: '07:00 - 20:30',
    summary: '偏轻食和营养搭配，口味更均衡，适合想吃得清爽又不失饱腹感的同学。',
    features: ['轻食友好', '营养配比', '低油少盐可选'],
    introBlocks: [
      {
        title: '口味偏好',
        content: '整体偏清淡，适合长期吃食堂的同学，午餐套餐更新频率高。',
      },
      {
        title: '推荐时段',
        content: '12:30 后排队明显减少，13:00 前多数热门菜仍有库存。',
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
    location: '学活北侧一层',
    openHours: '06:30 - 22:00',
    summary: '夜宵友好型食堂，热汤面和小碗菜口碑好，适合晚课后补给。',
    features: ['夜宵时段长', '汤面口碑好', '小碗菜灵活搭配'],
    introBlocks: [
      {
        title: '夜间友好',
        content: '21:30 后仍有稳定供应，适合自习结束后快速补餐。',
      },
      {
        title: '热门档口',
        content: '麻辣香锅、小锅米线、藤椒鸡丝拌面，重口味选择集中。',
      },
    ],
  },
  {
    id: 'siyuan',
    name: '思源餐厅',
    shortName: '思源',
    image:
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1400&q=80',
    rating: 4.5,
    location: '思源楼地下一层',
    openHours: '07:00 - 21:00',
    summary:
      '兼顾大众口味与特色档口，价格区间友好，适合追求性价比与稳定口感。',
    features: ['价格友好', '口味稳定', '窗口轮换频率高'],
    introBlocks: [
      {
        title: '性价比',
        content: '基础套餐价格友好，搭配灵活，适合日常高频就餐。',
      },
      {
        title: '风味推荐',
        content: '宫保鸡丁盖饭、香菇滑鸡饭、番茄鸡蛋面稳定出品。',
      },
    ],
  },
];

export const HOME_RANKINGS = [
  {
    rank: 1,
    dishId: 'braised-beef-noodle',
    canteenId: 'xueyuan',
    dishName: '红烧牛肉面',
    score: 4.9,
  },
  {
    rank: 2,
    dishId: 'black-pepper-chicken',
    canteenId: 'xueyuan',
    dishName: '黑椒鸡腿饭',
    score: 4.8,
  },
  {
    rank: 3,
    dishId: 'tomato-beef-rice',
    canteenId: 'jiaogong',
    dishName: '番茄肥牛饭',
    score: 4.8,
  },
  {
    rank: 4,
    dishId: 'sour-soup-rice-noodle',
    canteenId: 'qinghe',
    dishName: '酸汤米线',
    score: 4.7,
  },
  {
    rank: 5,
    dishId: 'kungpao-chicken-rice',
    canteenId: 'siyuan',
    dishName: '宫保鸡丁盖饭',
    score: 4.7,
  },
];
