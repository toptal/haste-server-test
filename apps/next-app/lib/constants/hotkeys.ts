interface HotKeysType {
  label: string
  description: string
  isShortcut: (e: KeyboardEvent) => boolean
}

const hotKeys: { [name: string]: HotKeysType } = {
  newText: {
    label: 'Start a New Text',
    description: 'CTRL + ALT + N',
    isShortcut: (e: KeyboardEvent): boolean => {
      return e.ctrlKey && e.altKey && e.keyCode === 78
    }
  },
  save: {
    label: 'Save',
    description: 'CTRL + S',
    isShortcut: (e: KeyboardEvent): boolean => {
      return e.ctrlKey && e.keyCode === 83
    }
  },
  duplicate: {
    label: 'Duplicate Text',
    description: 'CTRL + D',
    isShortcut: (e: KeyboardEvent): boolean => {
      return e.ctrlKey && e.keyCode === 68
    }
  },
  downloadRaw: {
    label: 'Download RAW File',
    description: 'CTRL + SHIFT + R',
    isShortcut: (e: KeyboardEvent): boolean => {
      return e.ctrlKey && e.shiftKey && e.keyCode === 82
    }
  },
  copyUrl: {
    label: 'Copy Shareable URL',
    description: 'CTRL + U',
    isShortcut: (e: KeyboardEvent): boolean => {
      return e.ctrlKey && e.keyCode === 85
    }
  }
}

export function getKey(e: KeyboardEvent): HotKeysType | undefined {
  return Object.values(hotKeys).find(key => key.isShortcut(e))
}

export default hotKeys
