document.addEventListener('DOMContentLoaded', () => {
  const itemInput = document.querySelector('#get-item')
  const itemFilterInput = document.querySelector('#filter-item')
  const addItemBtn = document.querySelector('#add-item')
  const clearItemInputBtn = document.querySelector('#clear-input')
  const updateItemBtn = document.querySelector('#update-item')
  const deleteAllBtn = document.querySelector('#delete-all')
  const shoppingList = document.querySelector('#shopping-list')
  let selectedItem = null
  const shoppingListStore = []

  addItemBtn.addEventListener('click', handleAddItem)
  clearItemInputBtn.addEventListener('click', handleClearItemInput)
  updateItemBtn.addEventListener('click', handleUpdateItem)
  shoppingList.addEventListener('click', handleModifyItem)
  deleteAllBtn.addEventListener('click', handleDeleteAllItems)

  function handleAddItem () {
    selectedItem = null
    addItem()
    clearItemInput()
    toggleDisplayItemsFilter()
    toggleDisplayClearAll()
    toggleDisplayUpdateItem()
    itemInput.focus()
  }

  function handleUpdateItem () {
    if (!selectedItem) return

    if (getItemInput()) { updateItem() }

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
    selectedItem = event.target
    itemInput.value = selectedItem.textContent.slice(0, -1)
    toggleDisplayUpdateItem()
  }

  function handleDeleteItem (event) {
    selectedItem = null
    deleteItem(event.target.parentElement)
    RemoveFromShoppingListStore(event.target.parentElement)
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

  function handleClearItemInput () {
    clearItemInput()
    itemInput.focus()
  }

  function getItemInput () {
    return itemInput.value.trim()
  }

  function clearItemInput () {
    itemInput.value = ''
  }

  function addItem () {
    const input = getItemInput()

    if (!input) return

    const li = document.createElement('li')
    const span = document.createElement('span')
    const liText = document.createTextNode(input)
    const spanText = document.createTextNode('+')
    span.appendChild(spanText)
    li.appendChild(liText)
    li.appendChild(span)
    li.classList.add('item-card')
    shoppingListStore.push(li.textContent.slice(0, -1))
    shoppingList.appendChild(li)
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
    item.remove()
  }

  function deleteAllItems () {
    while (shoppingList.lastElementChild) {
      shoppingList.lastElementChild.remove()
      shoppingListStore.pop()
    }
  }

  function toggleDisplayItemsFilter () {
    itemFilterInput.parentElement.classList
      .toggle('hidden', shoppingListStore.length < 1)
  }

  function toggleDisplayClearAll () {
    deleteAllBtn.parentElement.classList
      .toggle('hidden', shoppingListStore.length < 1)
  }

  function toggleDisplayUpdateItem () {
    updateItemBtn.classList
      .toggle('hidden', selectedItem === null)
  }

  function RemoveFromShoppingListStore (item) {
    const itemContent = item.innerText.slice(0, -1)
    const itemIndex = shoppingListStore.indexOf(itemContent)
    shoppingListStore.splice(itemIndex, 1)
  }
})
