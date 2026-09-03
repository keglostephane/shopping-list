document.addEventListener('DOMContentLoaded', () => {
  const itemInput = document.querySelector('#get-item')
  const itemFilterInput = document.querySelector('#filter-item')
  const addItemBtn = document.querySelector('#add-item')
  const clearItemInputBtn = document.querySelector('#clear-input')
  const updateItemBtn = document.querySelector('#update-item')
  const deleteAllBtn = document.querySelector('#delete-all')
  const clearItemFilterInputBtn = document.querySelector('#clearable-filter')
  const shoppingList = document.querySelector('#shopping-list')
  let selectedItem = null
  let lastItemKey = getLastItemKey()
  const debouncedHandleFilterItems = debounce(handleFilterItems)

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
      localStorage.setItem(++lastItemKey, item.textContent.slice(0, -1))
    }

    if (selectedItem) {
      selectedItem.classList.remove('selected')
    }

    selectedItem = null
    clearItemInput()
    toggleDisplayItemsFilter()
    toggleDisplayClearAll()
    toggleDisplayUpdateItem()
    itemInput.focus()
  }

  function handleUpdateItem () {
    if (!selectedItem) return

    if (getItemInput()) {
      const selectedItemKey = getItemKeyFromContent(
        selectedItem.textContent.slice(0, -1))
      updateItem()
      localStorage.setItem(selectedItemKey, getItemContent(selectedItem))
    }

    selectedItem.classList.remove('selected')
    selectedItem = null
    itemInput.focus()
    clearItemInput()
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
    itemInput.value = selectedItem.textContent.slice(0, -1)
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
    clearItemInput()
    itemInput.focus()
  }

  function handleClearItemFilterInput () {
    clearItemFilterInput()
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

  function clearItemInput () {
    itemInput.value = ''
  }

  function clearItemFilterInput () {
    itemFilterInput.value = ''
  }

  function addItem (content) {
    if (!content) return null

    const li = document.createElement('li')
    const span = document.createElement('span')
    const liText = document.createTextNode(content)
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
      localStorage.removeItem(
        getItemKeyFromContent(item.textContent.slice(0, -1)))
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
      .toggle('hidden', localStorage.length < 1)
  }

  function toggleDisplayClearAll () {
    deleteAllBtn.parentElement.classList
      .toggle('hidden', localStorage.length < 1)
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

  function getLastItemKey () {
    if (localStorage.length) {
      return Math.max(...Object.keys(localStorage)
        .map(Number)
        .filter((k) => { if (k !== NaN) return k }))
    }
    return 0
  }

  function getItemKeyFromContent (content) {
    for (const key of Object.keys(localStorage)) {
      if (localStorage.getItem(key) === content) { return key }
    }
    return null
  }

  function populateList () {
    for (const key of Object.keys(localStorage).toSorted()) {
      addItem(localStorage.getItem(key))
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
})
