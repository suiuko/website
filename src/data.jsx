// ——— Shared data ———

const NOTES = [
  {
    id: 'diffusion-intuition',
    date: '2026-04-12',
    title: 'Diffusion 模型的一个小直觉',
    excerpt: '把去噪过程理解成「雕刻」而不是「生成」——大理石里已经有了那个雕塑，你只是在去掉不属于它的噪声。',
    tags: ['research', 'ml', 'thinking'],
    mood: '🧠', loc: 'Cambridge', cover: true, public: true,
    kind: 'default',
    body: `# Diffusion 模型的一个小直觉

最近在改一个小 baseline，突然发现一个让我看 diffusion loss 的眼光都变了的角度。

## 生成 vs. 雕刻

我们常常把 forward + reverse 描述为 "先加噪声，再学习去掉它"。技术上没错，但心理图像是误导的——它暗示你在**构造**一个东西。

真正发生的事情更像是 Michelangelo 的那句话——

> Every block of stone has a statue inside it, and it is the task of the sculptor to discover it.

那个 \`x_0\` 并不是从 Gaussian 里"长"出来的。它**本就**被编码在 \`p(x_0 | x_t)\` 的条件分布里；网络做的事，是把每一步的噪声尘屑刷掉一点点。

## 为什么这个视角有用

当我开始这样想，几件事变得很自然：

- **Classifier-free guidance** 就是"你再多刷掉一些不像 cat 的碎屑"
- **Consistency models** 其实是说——你没必要一次刷一点，可以直接估计最终形状
- **Schedule** 的选择，是在回答"先粗后细，还是先细后粗"

\`\`\`python
# 一步去噪的核心，还是这几行
x_prev = (1/sqrt(alpha_t)) * (x_t - (beta_t/sqrt(1-alpha_bar_t)) * eps_pred)
\`\`\`

## 一个 open question

如果每个 \`x_0\` 真的"一直在那里"，那 training distribution 的覆盖意味着什么？我们在训一个**雕塑家**，还是在**教他哪些石头是好的**？

—— 写于 Zoom meeting 后，咖啡已凉。`,
  },
  {
    id: 'xian-ramen',
    date: '2026-04-08',
    title: '西安一碗 Biangbiang 面',
    excerpt: '面条宽得像皮带，辣油浇上去的那一秒会"呲——"地响。老板说，要在泼辣油那一下低头闻一下。',
    tags: ['food', 'travel', '中文'],
    mood: '😋', loc: '西安', public: true,
    kind: 'default',
    body: `# 西安一碗 biangbiang 面

面条宽得像皮带。老板端上来之前，先把葱花、蒜末、辣椒面铺在白白的面上，然后端着一小勺滚烫的菜籽油过来，哗地泼下去。

那一秒的"呲——"声，是这一餐的 signature moment。

## tasting notes

- 面本身有嚼劲，很厚，越嚼越甜
- 辣油不是川辣，是更干、更香的那种
- 醋要自己加，不多不少

next time 想试一下 油泼扯面。`,
  },
  {
    id: 'paper-the-bitter-lesson',
    date: '2026-04-02',
    title: 'Re-reading "The Bitter Lesson"',
    excerpt: "Sutton 十年前写的那篇。每年读一次感受都不太一样。今年的 takeaway: 不是 scale 重要，是 general methods 重要。",
    tags: ['paper', 'ml', 'reading'],
    kind: 'default',
    body: `# Re-reading "The Bitter Lesson"

每年读一遍 Sutton 的那篇短文，感受都不太一样。

## 今年的 takeaway

不是 "scale 重要" —— 这个被误读太多次了。是 **general-purpose methods that leverage computation** 重要。细微差别。

## 我的笔记

1. Clever hacks 在短期是有效的
2. 但它们很少能 compose
3. Learning + Search 才是 compose 的东西

> The two methods that seem to scale arbitrarily in this way are **search** and **learning**.

## 对我 research 的启发

少花时间在"感觉很聪明"的 inductive bias 上。多花时间想：**这个方法的计算量翻十倍之后，它还 work 吗？** 如果答案是 yes，值得做。`,
  },
  {
    id: 'quote-dijkstra',
    date: '2026-03-28',
    kind: 'quote',
    tags: ['quote'],
    title: 'Dijkstra',
    excerpt: '"Simplicity is a great virtue but it requires hard work to achieve it and education to appreciate it. And to make matters worse: complexity sells better."',
    body: '(quote)',
    who: '— E. W. Dijkstra',
  },
  {
    id: 'tmux-tweaks',
    date: '2026-03-22',
    kind: 'code',
    title: '一段我每台新机器都会 copy 的 tmux config',
    excerpt: '四年迭代下来就剩这几行。prefix 换 C-a，vim-style pane 切换，鼠标开着，就够了。',
    tags: ['dotfiles', 'terminal'],
    body: '(code)',
    code: [
      { t: 'c', v: '# ~/.tmux.conf — minimal, 4y of accretion distilled' },
      { t: 'k', v: 'unbind ' }, { t: 'n', v: 'C-b' }, { t: 'n', v: '\n' },
      { t: 'k', v: 'set' }, { t: 'n', v: ' -g prefix ' }, { t: 'n', v: 'C-a' }, { t: 'n', v: '\n' },
      { t: 'k', v: 'bind' }, { t: 'n', v: ' C-a send-prefix' }, { t: 'n', v: '\n\n' },
      { t: 'c', v: '# vim-style pane nav' }, { t: 'n', v: '\n' },
      { t: 'k', v: 'bind' }, { t: 'n', v: ' h select-pane -L' }, { t: 'n', v: '\n' },
      { t: 'k', v: 'bind' }, { t: 'n', v: ' j select-pane -D' }, { t: 'n', v: '\n' },
      { t: 'k', v: 'bind' }, { t: 'n', v: ' k select-pane -U' }, { t: 'n', v: '\n' },
      { t: 'k', v: 'bind' }, { t: 'n', v: ' l select-pane -R' }, { t: 'n', v: '\n\n' },
      { t: 'k', v: 'set' }, { t: 'n', v: ' -g mouse ' }, { t: 's', v: 'on' },
    ],
  },
  {
    id: 'advisor-meeting',
    date: '2026-03-20',
    title: '一次 advisor 会议后的碎碎念',
    excerpt: '被问到 "what is the minimum viable story for this paper" —— 这是我听过最好的 research 提问之一。',
    tags: ['research', 'phd', 'meta'],
    kind: 'accent',
    body: `# MVP for a paper

今天 advisor 问了我一个问题，让我愣了半分钟：

> What is the **minimum viable story** for this paper?

也就是：如果你只能保留一张图、一个 table、一个 claim，它们是哪几个？剩下的都是脚手架。

## 为什么这个问题好

1. 强迫你找 thesis，而不是 defend 所有你做过的事
2. 它其实在问 "你真的相信什么"
3. 它是可 iterate 的——每次聊完都可以重新回答

## 我的答案

today: [scratch]

还没想清。下周继续。`,
  },
  {
    id: 'coffee-ritual',
    date: '2026-03-15',
    title: 'Morning ritual, updated',
    excerpt: '换了一台手冲壶后，早晨 routine 改了。记录一下当前版本。',
    tags: ['life', 'coffee'],
    kind: 'default',
    body: `# morning ritual, v2026

6:45 wake, water, no phone \n\n
7:00 grind 15g, pour 240g @ 92°C \n\n
7:10 reading, 30min \n\n
7:40 走去办公室 (15min) \n\n

这一段现在是一天里最贵的时间。`,
  },
  {
    id: 'paper-rejection',
    date: '2026-03-05',
    kind: 'quote',
    title: 'Reviewer 2 today',
    excerpt: '"The motivation is weak and the method is incremental."\n\n嗯。也许吧。修改，resubmit。',
    tags: ['phd', 'feels'],
    body: '(quote)',
    who: '— anonymous reviewer',
  },
  {
    id: 'obsidian-setup',
    date: '2026-02-28',
    title: '我的 Obsidian 现在长什么样',
    excerpt: 'Daily note + MOC + Zettelkasten 的一个混合。去掉了所有 plugin，只留 5 个。发现限制反而让笔记更流畅。',
    tags: ['pkm', 'tools'],
    kind: 'default',
    body: `# Obsidian, minimal

两年前我的 vault 有 38 个 plugin。今天剩 5 个。

## the 5

- Dataview
- Templater
- Git
- Minimal theme (技术上是 theme)
- Admonition

## 为什么少即是多

... (tbd)`,
  },
  {
    id: 'tokyo-alleys',
    date: '2026-02-20',
    title: '东京小巷',
    excerpt: '下雨的夜里，六本木后面的小巷，灯笼是暖黄的，雨反射着。相机只拍到光，拍不到那种安静。',
    tags: ['travel', 'japan', 'photo'],
    kind: 'default',
    body: `# 东京小巷，下雨夜

相机能捕捉光，但捕捉不了那种安静。`,
  },
  {
    id: 'vim-muscle',
    date: '2026-02-12',
    kind: 'code',
    title: 'vim muscle memory 的最后一步',
    excerpt: '最近开始用 `:g/pattern/d` 和 `:g!/pattern/d` ——多年的 grep+sed 终于可以 inline 完成。',
    tags: ['vim', 'workflow'],
    body: '(code)',
    code: [
      { t: 'c', v: '" delete all lines matching pattern' }, { t: 'n', v: '\n' },
      { t: 'k', v: ':g' }, { t: 'n', v: '/TODO/' }, { t: 'k', v: 'd' }, { t: 'n', v: '\n\n' },
      { t: 'c', v: '" delete all lines NOT matching' }, { t: 'n', v: '\n' },
      { t: 'k', v: ':g!' }, { t: 'n', v: '/^def /' }, { t: 'k', v: 'd' }, { t: 'n', v: '\n\n' },
      { t: 'c', v: '" normal-mode action on each match' }, { t: 'n', v: '\n' },
      { t: 'k', v: ':g' }, { t: 'n', v: '/^class/ ' }, { t: 'k', v: 'normal' }, { t: 'n', v: ' A  # TODO' },
    ],
  },
  {
    id: 'random-thought-1',
    date: '2026-02-01',
    title: '关于 deadlines',
    excerpt: '一个 hypothesis: 好的 research 需要截止日期的压力，好的 writing 需要截止日期之后的时间。',
    tags: ['thinking', 'phd'],
    kind: 'accent',
    body: `# 关于 deadlines

一个 hypothesis，还在验证中：

**好的 research** 需要截止日期的压力。
**好的 writing** 需要截止日期之后的时间。

所以 conference deadline 之后那一周，不是放假，是最贵的修订窗口。`,
  },
];

// Darkroom: 3-level hierarchy — MONTH → CITY → FRAMES
// Each MONTH contains several CITIES (each city is an album with frames inside).
const MONTHS = [
  {
    id: '2026-04', label: 'April 2026', month: '2026.04',
    blurb: '樱花、雨、两个城市。',
    cities: [
      {
        id: 'vienna-2026-04', title: 'Vienna', sub: 'Wien', when: '2026.04',
        country: 'AT', countryName: 'Austria', lat: 48.21, lon: 16.37,
        coverSeed: 11, frameCount: 12,
        story: 'Schönbrunn 下雨，Café Central 暖得不想走。几天的咖啡量比一年都多。',
        frames: [
          { cap: 'Schönbrunn', date: '04.12', meta: 'FUJI X100V · f/2' },
          { cap: 'café central', date: '04.13', meta: 'PORTRA 400' },
          { cap: 'tram 71', date: '04.14', meta: 'iPhone' },
          { cap: 'Belvedere', date: '04.15', meta: 'FUJI · 23mm' },
          { cap: 'sachertorte', date: '04.15', meta: 'iPhone' },
        ],
      },
      {
        id: 'london-2026-04', title: 'London', sub: '伦敦', when: '2026.04',
        country: 'GB', countryName: 'United Kingdom', lat: 51.51, lon: -0.13,
        coverSeed: 12, frameCount: 8,
        story: '去看老朋友。Hyde Park 走了很久，在 Borough Market 吃了一个贵得离谱的 oyster。',
        frames: [
          { cap: 'Hyde Park', date: '04.22', meta: 'FUJI X100V' },
          { cap: 'Borough', date: '04.23', meta: 'PORTRA 400' },
          { cap: 'Tate Modern', date: '04.24', meta: 'iPhone' },
          { cap: 'Soho 2am', date: '04.25', meta: 'CINESTILL 800T' },
        ],
      },
    ],
  },
  {
    id: '2026-03', label: 'March 2026', month: '2026.03',
    blurb: '回国看爸妈，顺路西安。',
    cities: [
      {
        id: 'xian-2026-03', title: 'Xi\'an', sub: '西安', when: '2026.03',
        country: 'CN', countryName: 'China', lat: 34.34, lon: 108.94,
        coverSeed: 5, frameCount: 9,
        story: '城墙骑行，biangbiang 面吃了四顿。钟楼晚上亮灯的时候从南大街看过去，很像小时候的年。',
        frames: [
          { cap: '城墙日落', date: '03.14', meta: 'FUJI X100V' },
          { cap: 'biangbiang', date: '03.15', meta: 'iPhone' },
          { cap: '回民街', date: '03.16', meta: 'PORTRA 400' },
          { cap: '钟楼', date: '03.17', meta: 'CINESTILL 800T' },
        ],
      },
    ],
  },
  {
    id: '2025-10', label: 'October 2025', month: '2025.10',
    blurb: '伊比利亚半岛的秋天。',
    cities: [
      {
        id: 'lisbon-2025-10', title: 'Lisbon', sub: 'Lisboa', when: '2025.10',
        country: 'PT', countryName: 'Portugal', lat: 38.72, lon: -9.14,
        coverSeed: 7, frameCount: 8,
        story: '28 路电车从头坐到尾。丁香鱼罐头 + Vinho Verde 是晚餐标配。',
        frames: [
          { cap: '28 tram', date: '10.11', meta: 'PORTRA 400' },
          { cap: 'sardinha', date: '10.12', meta: 'iPhone' },
          { cap: 'azulejos', date: '10.13', meta: 'FUJI' },
        ],
      },
    ],
  },
  {
    id: '2025-08', label: 'August 2025', month: '2025.08',
    blurb: 'Midnight sun, 北大西洋。',
    cities: [
      {
        id: 'reykjavik-2025-08', title: 'Reykjavik', sub: 'Ísland', when: '2025.08',
        country: 'IS', countryName: 'Iceland', lat: 64.15, lon: -21.94,
        coverSeed: 9, frameCount: 14,
        story: 'Midnight sun 没带眼罩。开一辆小车绕了半个岛，一路上没有人。',
        frames: [
          { cap: 'midnight road', date: '08.02', meta: 'FUJI X100V' },
          { cap: 'black sand', date: '08.04', meta: 'PORTRA 400' },
          { cap: 'horses', date: '08.05', meta: 'iPhone' },
        ],
      },
    ],
  },
];

// Use MONTHS as source of truth; flatten to ALBUMS for legacy consumers (map/home/album-detail)
const ALBUMS = MONTHS.flatMap(m => m.cities.map(c => ({ ...c, monthId: m.id, monthLabel: m.label })));

// Flattened photos feed (for home page preview)
const PHOTOS = ALBUMS.flatMap((a, ai) =>
  a.frames.slice(0, 3).map((f, fi) => ({
    id: ai * 100 + fi + 1,
    caption: f.cap, date: a.when + '.' + (f.date.split('.')[1] || '01'), loc: a.title,
    label: f.meta, albumId: a.id, seed: ai * 10 + fi,
  }))
);

const PROJECTS = [
  { idx: '01', name: 'sparse-attn-bench', desc: 'a benchmark suite for sparse attention kernels @ scale', tags: ['ml', 'systems', 'oss'], year: '2026—', status: 'ongoing', github: 'github.com/gaojing/sparse-attn-bench', collab: ['S. Wu', 'J. Park'] },
  { idx: '02', name: 'flow-matching-for-rl', desc: 'NeurIPS submission — flow matching as a drop-in policy parameterization', tags: ['paper', 'rl', 'ml'], year: '2025', status: 'published', pdf: '#', github: 'github.com/gaojing/fm-rl', collab: ['M. Lee', 'A. Gupta'], citations: 12 },
  { idx: '03', name: 'diffusion-at-the-edge', desc: 'ICML 2024 — small-model distillation of diffusion policies', tags: ['paper', 'diffusion'], year: '2024', status: 'published', pdf: '#', citations: 47 },
  { idx: '04', name: 'dotfiles', desc: '4-year lineage of my editor + shell + tmux setup', tags: ['dotfiles'], year: '2022—', status: 'ongoing', github: 'github.com/gaojing/dotfiles' },
  { idx: '05', name: 'tiny-physics-sim', desc: 'a weekend WebGL rigid-body sandbox', tags: ['graphics', 'fun'], year: '2025', status: 'archived', github: 'github.com/gaojing/physics' },
  { idx: '06', name: 'photobook · 2024', desc: 'self-published film photo book, 52 photos, 1 year', tags: ['photo', 'print'], year: '2024', status: 'published' },
  { idx: '07', name: 'this site', desc: 'hand-rolled, deployed on a $5 droplet', tags: ['web'], year: '2026', status: 'ongoing', github: 'github.com/gaojing/site' },
];

const DAILY = {
  music: {
    // Netease playlist IDs (user fills in real ones); we render external-player iframes
    playlists: [
      { id: '2829883282', title: '深夜写代码', desc: '凌晨两点的 lab soundtrack', cover: 1, hue: 50 },
      { id: '2829883283', title: '周末咖啡', desc: 'mellow jazz / bossa', cover: 2, hue: 30 },
      { id: '2829883284', title: '跑步 30min', desc: 'upbeat, minimal lyrics', cover: 3, hue: 80 },
      { id: '2829883285', title: '年度循环', desc: '今年听到失重的歌', cover: 4, hue: 15 },
    ],
    albums: [
      { t: 'Blue', a: 'Joni Mitchell', hue: 200 },
      { t: 'A Love Supreme', a: 'Coltrane', hue: 30 },
      { t: 'For Emma', a: 'Bon Iver', hue: 240 },
      { t: 'Kind of Blue', a: 'Miles Davis', hue: 210 },
      { t: '山丘', a: '李宗盛', hue: 50 },
      { t: 'In Rainbows', a: 'Radiohead', hue: 340 },
    ],
  },
  films: {
    watched: [
      { t: 'Past Lives', a: 'C. Song', rating: '★★★★★', when: 'Apr', note: '那种「差一步」的痛。' },
      { t: 'Perfect Days', a: 'W. Wenders', rating: '★★★★★', when: 'Mar' },
      { t: '花样年华', a: 'W. Kar-wai', rating: '★★★★★', when: 'Feb', note: 'rewatch #6' },
      { t: 'Anatomy of a Fall', a: 'J. Triet', rating: '★★★★☆', when: 'Feb' },
      { t: 'La Chimera', a: 'A. Rohrwacher', rating: '★★★★☆', when: 'Jan' },
      { t: 'Evil Does Not Exist', a: 'R. Hamaguchi', rating: '★★★★☆', when: 'Jan' },
    ],
    wishlist: [
      { t: 'The Taste of Things', a: 'T. A. Hung', when: 'soon' },
      { t: 'All of Us Strangers', a: 'A. Haigh', when: 'soon' },
      { t: 'Poor Things', a: 'Y. Lanthimos', when: 'someday' },
    ],
  },
  cooking: [
    { name: '油泼面', cuisine: '中', diff: 2, time: '25min', rating: '★★★★☆', date: '04.10', story: '学了两次才学会那一勺油的温度。', hue: 30 },
    { name: '意式肉酱', cuisine: '西', diff: 3, time: '3h', rating: '★★★★★', date: '04.02', story: '周日下午慢炖，整个公寓都是番茄香。', hue: 20 },
    { name: '麻婆豆腐', cuisine: '中', diff: 2, time: '30min', rating: '★★★★☆', date: '03.28', hue: 15 },
    { name: '味噌拉面', cuisine: '日', diff: 4, time: '4h', rating: '★★★★☆', date: '03.20', story: '从凌晨开始熬汤，值了。', hue: 55 },
    { name: '提拉米苏', cuisine: '甜品', diff: 2, time: '1h + 过夜', rating: '★★★★★', date: '03.10', hue: 40 },
    { name: '番茄牛腩', cuisine: '中', diff: 1, time: '1.5h', rating: '★★★★☆', date: '02.28', hue: 20 },
    { name: 'Carbonara', cuisine: '西', diff: 2, time: '20min', rating: '★★★★☆', date: '02.15', story: 'no cream. guanciale only.', hue: 50 },
    { name: '年夜饭八宝饭', cuisine: '甜品', diff: 3, time: '2h', rating: '★★★★★', date: '01.28', hue: 30 },
  ],
  coffee: [
    { name: 'Ethiopia · Yirgacheffe', note: '柑橘、茉莉、清澈', when: 'Apr' },
    { name: 'Colombia · Geisha', note: '贵但值', when: 'Mar' },
    { name: 'Panama · Hartmann', note: '蜂蜜处理', when: 'Feb' },
  ],
  games: [
    { name: 'Outer Wilds', hours: 28, rating: '★★★★★', note: '只能玩一次，所以慢一点。' },
    { name: 'Disco Elysium', hours: 55, rating: '★★★★★' },
    { name: 'Hades II', hours: 42, rating: '★★★★☆' },
  ],
};

// Countries visited — for map fog-of-war
const COUNTRIES_VISITED = ['JP', 'CN', 'PT', 'IS', 'GB', 'FR', 'DE', 'IT', 'ES', 'NL', 'US', 'TH', 'KR', 'SG'];

const LOG = {
  books: [
    { t: 'Gödel, Escher, Bach', a: 'Hofstadter', rating: '★★★★★', when: 'Apr', note: '第三次读。每次在不同的层。' },
    { t: 'The Making of a Scientist', a: 'P. Medawar', rating: '★★★★☆', when: 'Mar' },
    { t: '人间词话', a: '王国维', rating: '★★★★★', when: 'Mar', note: '通勤读。' },
    { t: 'Seeing Like a State', a: 'J. Scott', rating: '★★★★☆', when: 'Feb' },
    { t: 'A Pattern Language', a: 'Alexander', rating: '★★★★★', when: 'Feb' },
    { t: 'Chip War', a: 'C. Miller', rating: '★★★☆☆', when: 'Jan' },
  ],
  films: [
    { t: 'Past Lives', a: 'C. Song', rating: '★★★★★', when: 'Apr' },
    { t: 'Perfect Days', a: 'W. Wenders', rating: '★★★★★', when: 'Mar' },
    { t: '花样年华', a: 'W. Kar-wai', rating: '★★★★★', when: 'Feb', note: 'rewatch #6' },
    { t: 'Anatomy of a Fall', a: 'J. Triet', rating: '★★★★☆', when: 'Feb' },
    { t: 'La Chimera', a: 'A. Rohrwacher', rating: '★★★★☆', when: 'Jan' },
    { t: 'Evil Does Not Exist', a: 'R. Hamaguchi', rating: '★★★★☆', when: 'Jan' },
  ],
  music: [
    { t: 'Blue', a: 'Joni Mitchell', rating: '★★★★★', when: 'Apr' },
    { t: 'A Love Supreme', a: 'Coltrane', rating: '★★★★★', when: 'Mar' },
    { t: 'For Emma, Forever Ago', a: 'Bon Iver', rating: '★★★★★', when: 'Mar' },
    { t: 'Kind of Blue', a: 'Miles Davis', rating: '★★★★★', when: 'Feb' },
    { t: '李宗盛 · 山丘', a: 'live', rating: '★★★★★', when: 'Feb' },
    { t: 'In Rainbows', a: 'Radiohead', rating: '★★★★★', when: 'Jan' },
  ],
};

const TRIPS = [
  { loc: 'Tokyo, JP', when: 'Apr 2026', note: '第四次。这次只待六本木和谷中。', x: 845, y: 200 },
  { loc: 'Xi\'an, 中国', when: 'Mar 2026', note: 'biangbiang 和城墙骑行。', x: 730, y: 215 },
  { loc: 'Kyoto, JP', when: 'Apr 2026', note: '哲学之道走了两遍。', x: 838, y: 205 },
  { loc: 'Lisbon, PT', when: 'Oct 2025', note: '28 路电车 + sardines。', x: 430, y: 195 },
  { loc: 'Reykjavik, IS', when: 'Aug 2025', note: 'midnight sun, 没带眼罩。', x: 460, y: 120 },
  { loc: 'Cambridge, UK', when: '2022—', note: 'home for now.', x: 485, y: 165 },
  { loc: 'Shanghai', when: '∞', note: 'home-home.', x: 790, y: 220 },
];

const ABOUT = {
  name: 'Gaojing Zhang',
  cn: '张高靖',
  role: 'PhD Student · Machine Learning',
  where: 'Cambridge, UK',
  email: 'gaojing [at] example [dot] edu',
  github: 'github.com/gaojing',
  scholar: 'scholar.google/…',
  rss: '/feed.xml',
  pgp: 'F2A3 ··· 9E17',
  tz: 'Europe/London · UTC+0',
  status: '👉 writing a NeurIPS submission',
};

// expose
Object.assign(window, { NOTES, PHOTOS, ALBUMS, MONTHS, PROJECTS, DAILY, TRIPS, ABOUT, COUNTRIES_VISITED });
