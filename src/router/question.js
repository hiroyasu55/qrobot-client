import List from '@/components/questions/List'
// import Detail from '@/components/questions/Detail'

export default [
  {
    path: '/questions',
    name: 'questions.list',
    component: List,
    meta: {
      requiresAuth: true,
      title: 'List',
    },
  },
  /*
  {
    path: '/questions/new',
    name: 'questions.new',
    component: Detail,
    meta: {
      requiresAuth: true,
      title: 'Question',
    },
  },
  {
    path: '/questions/:id(\\d+)',
    name: 'questions.detail',
    component: Detail,
    meta: {
      requiresAuth: true,
      title: 'Question',
    },
    props(route) {
      return {
        id: parseInt(route.params.id),
        mode: 'show',
      }
    },
  },
  */
]
