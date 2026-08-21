document.addEventListener('DOMContentLoaded', () => {
  const itemInput = document.querySelector('#get-item')
  const itemFilterInput = document.querySelector('#filter-item')
  const addItemBtn = document.querySelector('#add-item')
  const clearItemInputBtn = document.querySelector('#clear-input')
  const deleteAllBtn = document.querySelector('#delete-all')
  const shoppingList = document.querySelector('#shopping-list')
  const shoppingListStore = []

  addItemBtn.addEventListener('click', handleAddItem)

  clearItemInputBtn.addEventListener('click', handleClearItemInput)

  shoppingList.addEventListener('click', (event) => {
    handleDeleteItem(event)
  })

  deleteAllBtn.addEventListener('click', handleDeleteAllItems)

  function handleAddItem () {
    addItem()
    clearItemInput()
    toggleDisplayItemsFilter()
    toggleDisplayClearAll()
    itemInput.focus()
  }

  function handleDeleteItem (event) {
    if (event.target.tagName === 'SPAN') {
      deleteItem(event.target.parentElement)
      RemoveFromShoppingListStore(event.target.parentElement)
      toggleDisplayItemsFilter()
      toggleDisplayClearAll()
      itemInput.focus()
    }
  }

  function handleDeleteAllItems () {
    deleteAllItems()
    toggleDisplayItemsFilter()
    toggleDisplayClearAll()
    itemInput.focus()
  }

  function handleClearItemInput () {
      clearItemInput()
      itemInput.focus()
  }

  function getItemInput () {
    return itemInput.value
  }

  function clearItemInput () {
    itemInput.value = ''
  }

  function addItem () {
    const input = getItemInput()
    const li = document.createElement('li')
    const span = document.createElement('span')
    const liText = document.createTextNode(input)
    const spanText = document.createTextNode('+')

    if (input.trim()) {
      span.appendChild(spanText)
      li.appendChild(liText)
      li.appendChild(span)
      li.classList.add('item-card')
      shoppingListStore.push(li.innerText.slice(0, -1))
      shoppingList.appendChild(li)
    }
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

  function RemoveFromShoppingListStore (item) {
    const itemContent = item.innerText.slice(0, -1)
    const itemIndex = shoppingListStore.indexOf(itemContent)
    shoppingListStore.splice(itemIndex, 1)
  }
})
