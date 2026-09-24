document.addEventListener('DOMContentLoaded', () => {
  const APP = 'SHOPPING_APP'
  const itemInput = document.querySelector('#get-item')
  const itemFilterInput = document.querySelector('#filter-item')
  const addItemBtn = document.querySelector('#add-item')
  const clearItemInputBtn = document.querySelector('#clear-input')
  const updateItemBtn = document.querySelector('#update-item')
  const deleteAllBtn = document.querySelector('#delete-all')
  const clearItemFilterInputBtn = document.querySelector('#clearable-filter')
  const shoppingList = document.querySelector('#shopping-list')
  const debouncedHandleFilterItems = debounce(handleFilterItems)
  let selectedItem = null
  let lastItemKey = getLastItemKey()

  populateList()

  if (getItemFilterInput()) {
    handleFilterItems()
  }

  addItemBtn.addEventListener('click', handleAddItem)
  clearItemInputBtn.addEventListener('click', handleClearItemInput)
  updateItemBtn.addEventListener('click', handleUpdateItem)
  shoppingList.addEventListener('click', handleModifyItem)
  deleteAllBtn.addEventListener('click', handleDeleteAllItems)
  itemFilterInput.addEventListener('input', debouncedHandleFilterItems)
  clearItemFilterInputBtn.addEventListener('click', handleClearItemFilterInput)

  function handleAddItem () {
    const item = addItem(getItemInput())

    if (item) {
      const data = readStorage()
      data[String(++lastItemKey)] = getItemContent(item)
      writeStorage(data)
    }

    if (selectedItem) {
      selectedItem.classList.remove('selected')
    }

    selectedItem = null
    clearInput(itemInput)
    toggleDisplayItemsFilter()
    toggleDisplayClearAll()
    toggleDisplayUpdateItem()
    handleFilterItems()
  }

  function handleUpdateItem () {
    if (!selectedItem) return

    if (getItemInput()) {
      const selectedItemKey = getItemKey(selectedItem)
      updateItem()
      const data = readStorage()
      data[selectedItemKey] = getItemContent(selectedItem)
      writeStorage(data)
    }

    selectedItem.classList.remove('selected')
    selectedItem = null
    clearInput(itemInput)
    toggleDisplayUpdateItem()
    handleFilterItems()
  }

  function handleModifyItem (event) {
    if (event.target.tagName === 'SPAN' &&
          confirm('Do you really want to delete this item ?')) {
      handleDeleteItem(event)
    } else if (event.target.tagName === 'P' ||
               event.target.tagName === 'LI' ||
              event.target.tagName === 'MARK') {
      handleSelectItemToUpdate(event)
      itemInput.focus()
    } else if (selectedItem) {
      itemInput.focus()
    }
  }

  function handleSelectItemToUpdate (event) {
    if (selectedItem) {
      selectedItem.classList.remove('selected')
    }

    selectedItem = (event.target.tagName === 'LI')
      ? event.target
      : (event.target.tagName === 'P')
          ? event.target.parentElement
          : event.target.parentElement.parentElement
    selectedItem.classList.add('selected')
    itemInput.value = getItemContent(selectedItem)
    toggleDisplayUpdateItem()
  }

  function handleDeleteItem (event) {
    if (selectedItem) {
      selectedItem.classList.remove('selected')
    }

    selectedItem = null
    const data = deleteItem(event.target.parentElement)
    writeStorage(data)
    clearInput(itemInput)
    toggleDisplayItemsFilter()
    toggleDisplayClearAll()
    toggleDisplayUpdateItem()
  }

  function handleDeleteAllItems () {
    if (confirm('You are about to delete all items. Are you sure ?')) {
      selectedItem = null
      deleteAllItems()
      writeStorage({})
      clearInput(itemInput)
      clearInput(itemFilterInput)
      toggleDisplayItemsFilter()
      toggleDisplayClearAll()
      toggleDisplayUpdateItem()
    }

    if (selectedItem) {
      itemInput.focus()
    }
  }

  function handleFilterItems () {
    toggleDisplayClearItemFilter()
    revertDisplayItems()

    if (getItemFilterInput()) {
      filterItems()
      highlightMatches()
    }

    if (selectedItem) {
      selectedItem.classList.remove('selected')
    }
  }

  function handleClearItemInput () {
    clearInput(itemInput)
    itemInput.focus()
  }

  function handleClearItemFilterInput () {
    clearInput(itemFilterInput)
    toggleDisplayClearItemFilter()
    revertDisplayItems()
  }

  function getItemInput () {
    return itemInput.value.trim().replace(/\s+/g, ' ')
  }

  function getItemFilterInput () {
    return itemFilterInput.value.trim().toLowerCase()
  }

  function clearInput (elem) {
    elem.value = ''
  }

  function addItem (itemContent) {
    if (!itemContent) return null

    const li = document.createElement('li')
    const p = document.createElement('p')
    const pText = document.createTextNode(itemContent)
    const span = document.createElement('span')
    const spanText = document.createTextNode('+')
    p.appendChild(pText)
    span.appendChild(spanText)
    li.appendChild(p)
    li.appendChild(span)
    li.classList.add('item-card')
    shoppingList.appendChild(li)
    return li
  }

  function updateItem () {
    const p = document.createElement('p')
    const pText = document.createTextNode(getItemInput())
    const span = document.createElement('span')
    const spanText = document.createTextNode('+')
    p.appendChild(pText)
    span.appendChild(spanText)
    selectedItem.textContent = ''
    selectedItem.appendChild(p)
    selectedItem.appendChild(span)
  }

  function deleteItem (item) {
    if (item) {
      const data = readStorage()
      delete data[getItemKey(item)]
      item.remove()
      return data
    }
  }

  function deleteAllItems () {
    while (shoppingList.lastElementChild) {
      shoppingList.lastElementChild.remove()
    }
  }

  function filterItems () {
    const query = getItemFilterInput()
    shoppingList.querySelectorAll('li').forEach((item) => {
      if (!normalizeText(item.textContent
        .slice(0, -1))
        .includes(normalizeText(query))) {
        item.classList.add('hidden')
      }
    })
  }

  function revertDisplayItems () {
    const pattern = /<\/?mark>/
    shoppingList.querySelectorAll('li').forEach((item) => {
      if (item.classList.contains('hidden')) {
        item.classList.remove('hidden')
      }
      item.innerHTML = item.innerHTML.replace(pattern, '')
    })
  }

  function normalizeText (text) {
    return text
      .trim()
      .toLowerCase()
      .normalize('NFKD')
    // Remove diacritic marks (accents)
      .replace(/[\u0300-\u036F]/g, '')
    // Collapse unnecessary multiple spaces
      .replace(/\s+/g, ' ')
  }

  function highlightMatches () {
    const toMatch = normalizeText(getItemFilterInput())
    const pattern = new RegExp(`(${toMatch})`)
    const li = shoppingList.querySelector('li')
    const offset = li.innerHTML.search(li.textContent)
    shoppingList.querySelectorAll('li').forEach((item) => {
      if (!item.classList.contains('hidden')) {
        const matchIndex = normalizeText(item.textContent).search(pattern)
        const matched = item.innerHTML
          .substring(matchIndex + offset, matchIndex + offset + toMatch.length)
        const toHighlight = '<mark>' + matched + '</mark>'
        item.innerHTML = item.innerHTML
          .slice(0, matchIndex + offset) + toHighlight + item.innerHTML
          .slice(matchIndex + offset + toMatch.length)
      }
    })
  }

  function toggleDisplayItemsFilter () {
    itemFilterInput.parentElement.classList
      .toggle('hidden', Object.keys(readStorage()).length < 1)
  }

  function toggleDisplayClearAll () {
    deleteAllBtn.parentElement.classList
      .toggle('hidden', Object.keys(readStorage()).length < 1)
  }

  function toggleDisplayUpdateItem () {
    updateItemBtn.classList
      .toggle('hidden', selectedItem === null)
  }

  function toggleDisplayClearItemFilter () {
    clearItemFilterInputBtn.classList
      .toggle('hidden', itemFilterInput.value.length < 1)
  }

  function getItemContent (item) {
    if (item) { return item.textContent.slice(0, -1) }
  }

  function populateList () {
    const data = readStorage()
    for (const key of Object.keys(data).toSorted()) {
      addItem(data[key])
    }

    toggleDisplayItemsFilter()
    toggleDisplayClearAll()
  }

  function debounce (func, delay = 250) {
    let timeoutID = null

    return (...args) => {
      if (timeoutID) {
        clearTimeout(timeoutID)
      }
      timeoutID = setTimeout(() => {
        func.apply(this, args)
      }, delay)
    }
  }

  function readStorage () {
    const storage = localStorage.getItem(APP) ?? {}

    if (Object.keys(storage).length) {
      const data = JSON.parse(storage)
      return data
    }

    return storage
  }

  function writeStorage (data) {
    localStorage.setItem(APP, JSON.stringify(data))
  }

  function getLastItemKey () {
    if (Object.keys(readStorage()).length) {
      return Math.max(...Object.keys(readStorage())
        .map(Number)
        .filter((k) => { if (k !== NaN) return k }))
    }
    return 0
  }

  function getItemKey (item) {
    const data = readStorage()
    const itemContent = getItemContent(item)
    for (const key of Object.keys(data)) {
      if (data[key] === itemContent) { return key }
    }
    return null
  }
})
