const app = getApp()
Component({
  properties: {
    newsList: {
      type: Array,
      value: []
    },
    loading: {
      type: Boolean,
      value: false
    }
  },
  methods: {
    linkDetail({currentTarget}){
      const url = currentTarget.dataset && currentTarget.dataset.url || ''
      url && app.navigateTo(url)
    }
  }
})