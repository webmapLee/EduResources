<template>
  <div class="container mx-auto px-4 py-8">
    <section class="mb-8 rounded-3xl bg-gradient-to-r from-primary-500 to-primary-700 px-6 py-10 text-white shadow-lg">
      <p class="mb-3 inline-flex rounded-full bg-white/15 px-4 py-1 text-sm">
        视频学习网站推荐
      </p>
      <h1 class="mb-4 text-3xl font-bold md:text-4xl">按学段整理的 B 站视频精品学习入口</h1>
      <p class="max-w-3xl text-sm leading-7 text-white/90 md:text-base">
        小学部分优先整理了你提供的参考资源，初中和高中先放入常用搜索入口与待补充栏目，后续可以继续细化到具体学科和年级。
      </p>
    </section>

    <section class="mb-8">
      <div class="flex flex-wrap justify-center gap-3">
        <button
          v-for="option in filterOptions"
          :key="option.id"
          type="button"
          class="rounded-full px-5 py-2 text-sm font-medium transition-colors"
          :class="selectedLevel === option.id ? 'bg-primary-500 text-white' : 'bg-white text-gray-700 shadow hover:bg-gray-100'"
          @click="selectedLevel = option.id"
        >
          {{ option.label }}
        </button>
      </div>
    </section>

    <section class="space-y-8">
      <div
        v-for="level in filteredLevels"
        :key="level.id"
        class="overflow-hidden rounded-3xl bg-white shadow-md"
      >
        <div class="border-b border-gray-100 px-6 py-5">
          <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 class="text-2xl font-bold text-gray-800">{{ level.name }}</h2>
              <p class="mt-2 text-sm leading-6 text-gray-600">{{ level.description }}</p>
            </div>
            <div class="rounded-full px-4 py-2 text-sm font-medium" :class="level.badgeClass">
              {{ level.summary }}
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-6 p-6 xl:grid-cols-2">
          <article
            v-for="subject in level.subjects"
            :key="subject.id"
            class="rounded-2xl border border-gray-100 bg-secondary-50 p-5"
          >
            <div class="mb-4 flex items-center justify-between">
              <div>
                <h3 class="text-xl font-semibold text-gray-800">{{ subject.name }}</h3>
                <p class="mt-1 text-sm text-gray-500">{{ subject.tip }}</p>
              </div>
              <span class="rounded-full bg-white px-3 py-1 text-xs font-medium text-primary-600">
                {{ subject.resources.length }} 条
              </span>
            </div>

            <div class="space-y-3">
              <div
                v-for="resource in subject.resources"
                :key="resource.title"
                class="rounded-2xl border border-white bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
              >
                <div class="flex items-start justify-between gap-3">
                  <div class="min-w-0 flex-1">
                    <div class="mb-2 flex flex-wrap items-center gap-2">
                      <h4 class="font-semibold text-gray-800">{{ resource.title }}</h4>
                      <span
                        v-if="resource.tag"
                        class="rounded-full bg-primary-50 px-2 py-0.5 text-xs text-primary-600"
                      >
                        {{ resource.tag }}
                      </span>
                    </div>
                    <p class="text-sm leading-6 text-gray-600">{{ resource.description }}</p>
                  </div>

                  <a
                    v-if="resource.url"
                    :href="resource.url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="shrink-0 rounded-full bg-primary-500 px-4 py-2 text-sm font-medium text-white hover:bg-primary-600"
                  >
                    前往
                  </a>
                  <span
                    v-else
                    class="shrink-0 rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-400"
                  >
                    待补充
                  </span>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

interface VideoResource {
  title: string;
  description: string;
  url?: string;
  tag?: string;
}

interface SubjectSection {
  id: string;
  name: string;
  tip: string;
  resources: VideoResource[];
}

interface LevelSection {
  id: string;
  name: string;
  description: string;
  summary: string;
  badgeClass: string;
  subjects: SubjectSection[];
}

const filterOptions = [
  { id: 'all', label: '全部学段' },
  { id: 'primary', label: '小学' },
  { id: 'junior', label: '初中' },
  { id: 'senior', label: '高中' }
];

const selectedLevel = ref('all');

const levelSections: LevelSection[] = [
  {
    id: 'primary',
    name: '小学',
    description: '以兴趣启蒙、知识拓展和学科积累为主，优先整理语文、数学、英语和科学类视频精品。',
    summary: '已整理参考资源',
    badgeClass: 'bg-green-50 text-green-700',
    subjects: [
      {
        id: 'primary-chinese',
        name: '语文',
        tip: '适合积累阅读兴趣、传统文化和表达能力。',
        resources: [
          {
            title: '跟着书本去旅行 第一季',
            description: '把课文、地理和人文故事结合起来，适合低年级拓展视野。',
            url: 'https://www.bilibili.com/bangumi/play/ep3838363?spm_id_from=333.1387.collection.video_card.click',
            tag: '纪录片'
          },
          {
            title: '跟着书本去旅行 第二季',
            description: '延续课本旅行主题，适合作为课外延伸观看。',
            url: 'https://www.bilibili.com/bangumi/play/ep3838567?spm_id_from=333.337.0.0&from_spmid=666.25.episode.0',
            tag: '纪录片'
          },
          {
            title: '跟着书本去旅行 第三季',
            description: '通过场景化讲述增强学生对课文内容的理解。',
            url: 'https://www.bilibili.com/bangumi/play/ss236005?spm_id_from=333.337.0.0',
            tag: '纪录片'
          },
          {
            title: '跟着书本去旅行 第四季',
            description: '继续补充文学与地理的跨学科内容。',
            url: 'https://www.bilibili.com/bangumi/play/ss236004?spm_id_from=333.337.0.0',
            tag: '纪录片'
          },
          {
            title: '论语里的大智慧',
            description: '借助故事化讲解理解经典语句，适合积累传统文化素养。',
            url: 'https://www.bilibili.com/video/BV1km4y1j7xs/?spm_id_from=333.337.search-card.all.click&vd_source=ba12eadeae8ac6f765e8935570bdbfa3',
            tag: '国学'
          },
          {
            title: '小学文言文启蒙',
            description: '适合文言基础入门，帮助理解常见表达和句式。',
            url: 'https://www.bilibili.com/video/BV1haR5BFEGh/?spm_id_from=333.337.search-card.all.click&vd_source=ba12eadeae8ac6f765e8935570bdbfa3',
            tag: '文言文'
          },
          {
            title: '中国通史',
            description: '可作为语文和历史阅读背景材料，帮助建立时间线概念。',
            url: 'https://www.bilibili.com/bangumi/play/ss33585?spm_id_from=333.337.0.0',
            tag: '历史'
          },
          {
            title: '宗师列传·唐宋八大家',
            description: '人物专题短片，适合学习古诗文时搭配观看。',
            url: 'https://www.bilibili.com/video/BV1TWisB6Ezk/?spm_id_from=333.337.search-card.all.click&vd_source=ba12eadeae8ac6f765e8935570bdbfa3',
            tag: '人文'
          },
          {
            title: '定风波·苏轼',
            description: '帮助学生认识苏轼其人其文，增强文学感受力。',
            url: 'https://www.bilibili.com/video/BV1hzqaBiEgs/?spm_id_from=333.337.search-card.all.click&vd_source=ba12eadeae8ac6f765e8935570bdbfa3',
            tag: '古诗文'
          },
          {
            title: '唐之韵',
            description: '诗词、历史与人物结合，适合培养古典文学兴趣。',
            url: 'https://www.bilibili.com/bangumi/play/ss39925?spm_id_from=333.337.0.0',
            tag: '诗词'
          }
        ]
      },
      {
        id: 'primary-math',
        name: '数学',
        tip: '重在培养观察、思考和数学故事兴趣。',
        resources: [
          {
            title: '像乌鸦一样思考',
            description: '通过实验和观察引导思考，适合训练逻辑和探究意识。',
            url: 'https://www.bilibili.com/bangumi/play/ss20032?spm_id_from=333.337.0.0',
            tag: '思维'
          },
          {
            title: '用动画片学奥数',
            description: '动画形式更适合小学阶段接触奥数启蒙。',
            url: 'https://www.bilibili.com/video/BV1NKSKB7Exu/?spm_id_from=333.337.search-card.all.click&vd_source=ba12eadeae8ac6f765e8935570bdbfa3',
            tag: '奥数'
          },
          {
            title: '不一样的数学故事',
            description: '用故事讲数学概念，减轻抽象理解的压力。',
            url: 'https://www.bilibili.com/bangumi/play/ss46887?spm_id_from=333.337.0.0',
            tag: '故事'
          },
          {
            title: '托起人类文明的数学',
            description: '从文明发展角度认识数学，适合拓展兴趣。',
            url: 'https://www.bilibili.com/video/BV1LV411S75T/?spm_id_from=333.337.search-card.all.click&vd_source=ba12eadeae8ac6f765e8935570bdbfa3',
            tag: '拓展'
          },
          {
            title: '解码数学',
            description: '帮助孩子理解数学在现实世界中的作用。',
            url: 'https://www.bilibili.com/video/BV1rW411M7j9/?spm_id_from=333.337.search-card.all.click&vd_source=ba12eadeae8ac6f765e8935570bdbfa3',
            tag: '数学文化'
          }
        ]
      },
      {
        id: 'primary-english',
        name: '英语',
        tip: '适合做磨耳朵和兴趣启蒙。',
        resources: [
          {
            title: '新概念英语动画版',
            description: '动画化内容更容易吸引小学生坚持跟读和听力输入。',
            url: 'https://www.bilibili.com/video/BV17qEj6oE1U/?spm_id_from=333.337.search-card.all.click',
            tag: '磨耳朵'
          },
          {
            title: '马泽的故事',
            description: '适合做英文故事输入，训练听感与语感。',
            url: 'https://www.bilibili.com/video/BV1SdET6XECR/?spm_id_from=333.337.search-card.all.click&vd_source=ba12eadeae8ac6f765e8935570bdbfa3',
            tag: '故事'
          }
        ]
      },
      {
        id: 'primary-science',
        name: '科学与人文',
        tip: '适合做跨学科兴趣启蒙，培养科学观察和世界认知。',
        resources: [
          {
            title: '我的牛顿教练',
            description: '适合入门理解基础物理现象，降低科学学习门槛。',
            url: 'https://www.bilibili.com/bangumi/play/ss105376?spm_id_from=333.337.0.0',
            tag: '物理启蒙'
          },
          {
            title: '美丽化学',
            description: '用高质量影像展示化学现象，适合作为科学兴趣激发材料。',
            url: 'https://www.bilibili.com/video/BV1KE411872v/?spm_id_from=333.337.search-card.all.click&vd_source=ba12eadeae8ac6f765e8935570bdbfa3',
            tag: '化学'
          },
          {
            title: '生命的故事',
            description: '适合观察生命世界，帮助建立生物基础认知。',
            url: 'https://www.bilibili.com/bangumi/play/ss20386?spm_id_from=333.337.0.0',
            tag: '生物'
          },
          {
            title: '地球脉动 第一季',
            description: '认识地球生态与自然环境，适合地理启蒙。',
            url: 'https://www.bilibili.com/bangumi/play/ss20302?spm_id_from=333.337.0.0',
            tag: '地理'
          },
          {
            title: '地球脉动 第二季',
            description: '延续自然生态主题，画面优秀，适合陪看。',
            url: 'https://www.bilibili.com/bangumi/play/ss43768?spm_id_from=333.337.0.0',
            tag: '地理'
          },
          {
            title: '地球脉动 第三季',
            description: '进一步拓展全球生态与自然观察视角。',
            url: 'https://www.bilibili.com/bangumi/play/ss46178?spm_id_from=333.337.0.0',
            tag: '地理'
          },
          {
            title: '辉煌中国',
            description: '适合作为社会与国家发展主题的拓展资源。',
            url: 'https://www.bilibili.com/video/BV1YV4y1K7tR/?spm_id_from=333.337.search-card.all.click&vd_source=ba12eadeae8ac6f765e8935570bdbfa3',
            tag: '人文'
          },
          {
            title: '在家玩科学 第一至六季',
            description: '通过家庭实验激发孩子动手兴趣，适合亲子共学。',
            url: 'https://www.bilibili.com/bangumi/play/ep3692483?spm_id_from=333.1387.collection.video_card.click',
            tag: '实验'
          }
        ]
      }
    ]
  },
  {
    id: 'junior',
    name: '初中',
    description: '先提供常见学习方向和 B 站搜索入口，方便后续补充更精确的课程视频。',
    summary: '可继续补充具体课程',
    badgeClass: 'bg-amber-50 text-amber-700',
    subjects: [
      {
        id: 'junior-chinese',
        name: '语文',
        tip: '可优先补充文言文、名著导读、作文提升。',
        resources: [
          {
            title: 'B 站搜索：初中文言文讲解',
            description: '适合后续筛选与教材同步的文言文和古诗文精讲资源。',
            url: 'https://search.bilibili.com/all?keyword=%E5%88%9D%E4%B8%AD%20%E6%96%87%E8%A8%80%E6%96%87%20%E8%AE%B2%E8%A7%A3',
            tag: '搜索入口'
          },
          {
            title: 'B 站搜索：初中作文技巧',
            description: '可筛选记叙文、议论文和中考作文素材类视频。',
            url: 'https://search.bilibili.com/all?keyword=%E5%88%9D%E4%B8%AD%20%E4%BD%9C%E6%96%87%20%E6%8A%80%E5%B7%A7',
            tag: '搜索入口'
          },
          {
            title: '教材同步精讲',
            description: '后续可按七年级、八年级、九年级分别补充。',
            tag: '待补充'
          }
        ]
      },
      {
        id: 'junior-math',
        name: '数学',
        tip: '建议优先补充几何、函数和压轴题思路。',
        resources: [
          {
            title: 'B 站搜索：初中数学动画',
            description: '适合筛选几何变化、函数图像等更直观的视频资源。',
            url: 'https://search.bilibili.com/all?keyword=%E5%88%9D%E4%B8%AD%20%E6%95%B0%E5%AD%A6%20%E5%8A%A8%E7%94%BB',
            tag: '搜索入口'
          },
          {
            title: 'B 站搜索：初中几何专题',
            description: '可进一步挑选辅助线、相似、圆等专题讲解。',
            url: 'https://search.bilibili.com/all?keyword=%E5%88%9D%E4%B8%AD%20%E5%87%A0%E4%BD%95%20%E4%B8%93%E9%A2%98',
            tag: '搜索入口'
          },
          {
            title: '同步基础课程',
            description: '后续可补充与人教版、北师大版对应的课程。',
            tag: '待补充'
          }
        ]
      },
      {
        id: 'junior-english',
        name: '英语',
        tip: '建议围绕单词、语法、听力和阅读训练整理。',
        resources: [
          {
            title: 'B 站搜索：初中英语语法',
            description: '可筛选时态、从句和句型专题视频。',
            url: 'https://search.bilibili.com/all?keyword=%E5%88%9D%E4%B8%AD%20%E8%8B%B1%E8%AF%AD%20%E8%AF%AD%E6%B3%95',
            tag: '搜索入口'
          },
          {
            title: 'B 站搜索：初中英语听力',
            description: '适合补充磨耳朵和情境听力训练。',
            url: 'https://search.bilibili.com/all?keyword=%E5%88%9D%E4%B8%AD%20%E8%8B%B1%E8%AF%AD%20%E5%90%AC%E5%8A%9B',
            tag: '搜索入口'
          },
          {
            title: '教材同步课程',
            description: '后续可按单元或版本进一步细化。',
            tag: '待补充'
          }
        ]
      }
    ]
  },
  {
    id: 'senior',
    name: '高中',
    description: '先保留常用学科检索入口，后续适合继续补充专题课和高考复习视频。',
    summary: '当前以搜索入口为主',
    badgeClass: 'bg-sky-50 text-sky-700',
    subjects: [
      {
        id: 'senior-chinese',
        name: '语文',
        tip: '建议补充古诗文、阅读理解和作文素材。',
        resources: [
          {
            title: 'B 站搜索：高中语文阅读理解',
            description: '可筛选现代文阅读、答题模板和真题讲解。',
            url: 'https://search.bilibili.com/all?keyword=%E9%AB%98%E4%B8%AD%20%E8%AF%AD%E6%96%87%20%E9%98%85%E8%AF%BB%E7%90%86%E8%A7%A3',
            tag: '搜索入口'
          },
          {
            title: 'B 站搜索：高中作文素材',
            description: '适合积累时评素材、审题方法和写作结构。',
            url: 'https://search.bilibili.com/all?keyword=%E9%AB%98%E4%B8%AD%20%E4%BD%9C%E6%96%87%20%E7%B4%A0%E6%9D%90',
            tag: '搜索入口'
          },
          {
            title: '高考一轮复习',
            description: '后续可按专题逐步补齐。',
            tag: '待补充'
          }
        ]
      },
      {
        id: 'senior-math',
        name: '数学',
        tip: '建议优先整理函数、导数、立体几何和数列。',
        resources: [
          {
            title: 'B 站搜索：高中数学函数',
            description: '可筛选基础专题课和高考题型解析。',
            url: 'https://search.bilibili.com/all?keyword=%E9%AB%98%E4%B8%AD%20%E6%95%B0%E5%AD%A6%20%E5%87%BD%E6%95%B0',
            tag: '搜索入口'
          },
          {
            title: 'B 站搜索：高中数学导数',
            description: '适合后续挑选不同难度层级的视频课程。',
            url: 'https://search.bilibili.com/all?keyword=%E9%AB%98%E4%B8%AD%20%E6%95%B0%E5%AD%A6%20%E5%AF%BC%E6%95%B0',
            tag: '搜索入口'
          },
          {
            title: '高考冲刺专题',
            description: '后续可按一轮、二轮、压轴题分别补充。',
            tag: '待补充'
          }
        ]
      },
      {
        id: 'senior-english',
        name: '英语',
        tip: '建议围绕词汇、语法、听力、阅读和写作整理。',
        resources: [
          {
            title: 'B 站搜索：高中英语阅读',
            description: '可筛选阅读技巧、长难句分析和真题拆解视频。',
            url: 'https://search.bilibili.com/all?keyword=%E9%AB%98%E4%B8%AD%20%E8%8B%B1%E8%AF%AD%20%E9%98%85%E8%AF%BB',
            tag: '搜索入口'
          },
          {
            title: 'B 站搜索：高中英语语法',
            description: '适合筛选从句、非谓语和写作句型专题。',
            url: 'https://search.bilibili.com/all?keyword=%E9%AB%98%E4%B8%AD%20%E8%8B%B1%E8%AF%AD%20%E8%AF%AD%E6%B3%95',
            tag: '搜索入口'
          },
          {
            title: '高考英语专项',
            description: '后续可继续补充完形、七选五和写作专题。',
            tag: '待补充'
          }
        ]
      }
    ]
  }
];

const filteredLevels = computed(() => {
  if (selectedLevel.value === 'all') {
    return levelSections;
  }

  return levelSections.filter((level) => level.id === selectedLevel.value);
});
</script>
