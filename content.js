const HTMLtoString = (html) => html.textContent
const trim = (str) => str.replace(/\s+/g, ' ').trim()
const lowercase = (str) => str.toLowerCase()
const compose = (...fns) => fns.reduce((f, g) => (...args) => f(g(...args)))
const text = compose(lowercase, trim, HTMLtoString)

const filterComments = (comments) => {
  const arr = []

  comments.map((e) => arr.push({
    id: e.id,
    content: text(e)
  }))

  return arr
}

// Inform the background page that 
// this tab should have a page-action
chrome.runtime.sendMessage({
  from: 'content',
  subject: 'showPageAction'
})

const hide = (arr) => {
  arr.map(i => {
    document.getElementById(i).style.display = 'none'
  })
}

const show = (arr) => {
  arr.map(i => {
    document.getElementById(i).style.display = 'initial'
  })
}

const rawComments = Array.from(document.querySelectorAll('.athing.comtr'))
const comments = filterComments(rawComments)

chrome.runtime.onMessage.addListener((req, sender, res) => {
  if (req.type === 'getComments') {
    res(comments)
  }
  if (req.type === 'commentsVisibility') {
    const { commentsToShow, commentsToHide } = req
    
    hide(commentsToHide)
    show(commentsToShow)
  }
})
