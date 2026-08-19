document.addEventListener('DOMContentLoaded', () => {
  const itemInput = document.querySelector('#get-item')
  const addItembtn = document.querySelector('#add-item')
  const itemFilterInput = document.querySelector('#filter-item')
  const shoppingList = document.querySelector('#shopping-list')
  const shoppingListStore = []

  addItembtn.addEventListener('click', addItem)

  shoppingList.addEventListener('click', (event) => {
    if (event.target.tagName === 'SPAN') {
      deleteItem(event.target.parentElement)
      RemoveFromShoppingListStore(event.target.parentElement)
      toggleDisplayItemsFilter()
    }
  })

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
  }

  function toggleDisplayItemsFilter () {
    itemFilterInput.parentElement.classList
      .toggle('hidden', shoppingListStore.length < 1)
  }

  function deleteItem (item) {
    item.remove()
  }

  function RemoveFromShoppingListStore (item) {
    const itemContent = item.innerText.slice(0, -1)
    const itemIndex = shoppingListStore.indexOf(itemContent)
    shoppingListStore.splice(itemIndex, 1)
  }
})
