document.addEventListener('DOMContentLoaded', () => {
  const itemInput = document.querySelector('#get-item')
  const addItembtn = document.querySelector('#add-item')
  const shoppingList = document.querySelector('#shopping-list')
  const shoppingListStore = []

  addItembtn.addEventListener('click', addItem)

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

    if (input) {
      span.appendChild(spanText)
      li.appendChild(liText)
      li.appendChild(span)
      li.classList.add('item-card')
      shoppingListStore.push(li.innerText.slice(0, -1))
      shoppingList.appendChild(li)
    }

    clearItemInput()
  }
})
