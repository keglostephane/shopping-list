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
      const data = getStorage()
      data[String(++lastItemKey)] = getItemContent(item)
      localStorage.setItem(APP, JSON.stringify(data))
    }

    if (selectedItem) {
      selectedItem.classList.remove('selected')
    }

    selectedItem = null
    clearInput(itemInput)
    toggleDisplayItemsFilter()
    toggleDisplayClearAll()
    toggleDisplayUpdateItem()
    itemInput.focus()
  }

  function handleUpdateItem () {
    if (!selectedItem) return

    if (getItemInput()) {
      const selectedItemKey = getItemKey(selectedItem)
      updateItem()
      const data = getStorage()
      data[selectedItemKey] = getItemContent(selectedItem)
      localStorage.setItem(APP, JSON.stringify(data))
    }

    selectedItem.classList.remove('selected')
    selectedItem = null
    itemInput.focus()
    clearInput(itemInput)
    toggleDisplayUpdateItem()
  }

  function handleModifyItem (event) {
    if (event.target.tagName === 'SPAN') {
      handleDeleteItem(event)
    } else if (event.target.tagName === 'LI') {
      handleSelectItemToUpdate(event)
      itemInput.focus()
    }
  }

  function handleSelectItemToUpdate (event) {
    if (selectedItem) {
      selectedItem.classList.remove('selected')
    }

    selectedItem = event.target
    selectedItem.classList.add('selected')
    itemInput.value = getItemContent(selectedItem)
    toggleDisplayUpdateItem()
  }

  function handleDeleteItem (event) {
    if (selectedItem) {
      selectedItem.classList.remove('selected')
    }

    selectedItem = null
    deleteItem(event.target.parentElement)
    toggleDisplayItemsFilter()
    toggleDisplayClearAll()
    toggleDisplayUpdateItem()
    itemInput.focus()
  }

  function handleDeleteAllItems () {
    selectedItem = null
    deleteAllItems()
    itemInput.focus()
    toggleDisplayItemsFilter()
    toggleDisplayClearAll()
    toggleDisplayUpdateItem()
  }

  function handleFilterItems () {
    toggleDisplayClearItemFilter()
    revertDisplayItems()
    filterItems()
  }

  function handleClearItemInput () {
    clearInput(itemInput)
    itemInput.focus()
  }

  function handleClearItemFilterInput () {
    clearInput(itemFilterInput)
    toggleDisplayClearItemFilter()
    itemFilterInput.focus()
    revertDisplayItems()
  }

  function getItemInput () {
    return itemInput.value.trim()
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
    const span = document.createElement('span')
    const liText = document.createTextNode(itemContent)
    const spanText = document.createTextNode('+')
    span.appendChild(spanText)
    li.appendChild(liText)
    li.appendChild(span)
    li.classList.add('item-card')
    shoppingList.appendChild(li)
    return li
  }

  function updateItem () {
    const span = document.createElement('span')
    const spanText = document.createTextNode('+')
    const liText = document.createTextNode(getItemInput())
    span.appendChild(spanText)
    selectedItem.textContent = ''
    selectedItem.appendChild(liText)
    selectedItem.appendChild(span)
  }

  function deleteItem (item) {
    if (item) {
      const data = getStorage()
      delete data[getItemKey(item)]
      localStorage.setItem(APP, JSON.stringify(data))
      item.remove()
    }
  }

  function deleteAllItems () {
    while (shoppingList.lastElementChild) {
      deleteItem(shoppingList.lastElementChild)
    }
  }

  function filterItems () {
    const query = getItemFilterInput()
    shoppingList.querySelectorAll('li').forEach((item) => {
      if (!item.textContent.toLowerCase().includes(query)) {
        item.classList.add('hidden')
      }
    })
  }

  function revertDisplayItems () {
    shoppingList.querySelectorAll('li').forEach((item) => {
      if (item.classList.contains('hidden')) {
        item.classList.remove('hidden')
      }
    })
  }

  function toggleDisplayItemsFilter () {
    itemFilterInput.parentElement.classList
      .toggle('hidden', Object.keys(getStorage()).length < 1)
  }

  function toggleDisplayClearAll () {
    deleteAllBtn.parentElement.classList
      .toggle('hidden', Object.keys(getStorage()).length < 1)
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
    const data = getStorage()
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

  function getStorage () {
    const storage = localStorage.getItem(APP) ?? {}

    if (Object.keys(storage).length) {
      const data = JSON.parse(storage)
      return data
    }

    return storage
  }

  function getLastItemKey () {
    if (Object.keys(getStorage()).length) {
      return Math.max(...Object.keys(getStorage())
        .map(Number)
        .filter((k) => { if (k !== NaN) return k }))
    }
    return 0
  }

  function getItemKey (item) {
    const data = getStorage()
    const itemContent = getItemContent(item)
    for (const key of Object.keys(data)) {
      if (data[key] === itemContent) { return key }
    }
    return null
  }
})
