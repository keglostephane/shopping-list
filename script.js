document.addEventListener('DOMContentLoaded', () => {
  const itemInput = document.querySelector('#get-item')
  const itemFilterInput = document.querySelector('#filter-item')
  const addItembtn = document.querySelector('#add-item')
  const clearAllbtn = document.querySelector('#delete-all')
  const shoppingList = document.querySelector('#shopping-list')
  const shoppingListStore = []

  addItembtn.addEventListener('click', addItem)

  shoppingList.addEventListener('click', (event) => {
    if (event.target.tagName === 'SPAN') {
      deleteItem(event.target.parentElement)
    }
  })

  clearAllbtn.addEventListener('click', deleteAllItems)

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

    clearItemInput()
    toggleDisplayItemsFilter()
    toggleDisplayClearAll()
    itemInput.focus()
  }

  function deleteItem (item) {
    item.remove()
    RemoveFromShoppingListStore(item)
    toggleDisplayItemsFilter()
    toggleDisplayClearAll()
    itemInput.focus()
  }

  function deleteAllItems () {
    while (shoppingList.lastElementChild) {
      shoppingList.lastElementChild.remove()
      shoppingListStore.pop()
    }
    toggleDisplayItemsFilter()
    toggleDisplayClearAll()
    itemInput.focus()
  }

  function toggleDisplayItemsFilter () {
    itemFilterInput.parentElement.classList
      .toggle('hidden', shoppingListStore.length < 1)
  }

  function toggleDisplayClearAll () {
    clearAllbtn.parentElement.classList
      .toggle('hidden', shoppingListStore.length < 1)
  }

  function RemoveFromShoppingListStore (item) {
    const itemContent = item.innerText.slice(0, -1)
    const itemIndex = shoppingListStore.indexOf(itemContent)
    shoppingListStore.splice(itemIndex, 1)
  }
})
