class ClipboardService {
  constructor() {
    this.textArea = document.createElement('textarea')
    // Place in top-left corner of screen regardless of scroll position.
    this.textArea.style.position = 'fixed'
    this.textArea.style.top = 0
    this.textArea.style.left = 0

    // Ensure it has a small width and height. Setting to 1px / 1em
    // doesn't work as this gives a negative w/h on some browsers.
    this.textArea.style.width = '2em'
    this.textArea.style.height = '2em'

    // We don't need padding, reducing the size if it does flash render.
    this.textArea.style.padding = 0

    // Clean up any borders.
    this.textArea.style.border = 'none'
    this.textArea.style.outline = 'none'
    this.textArea.style.boxShadow = 'none'

    // Avoid flash of white box if rendered for any reason.
    this.textArea.style.background = 'transparent'
  }

  copy(text) {
    document.body.appendChild(this.textArea)
    this.textArea.value = text
    this.textArea.focus()
    this.textArea.select()
    document.execCommand('copy')
    document.body.removeChild(this.textArea)
  }

  supportsCopy() {
    return document.queryCommandSupported('copy') ? true : false
  }
}

const Clipboard = new ClipboardService()

export default Clipboard
