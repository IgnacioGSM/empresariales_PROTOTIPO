export function getData(key: string) {

  const data =
    localStorage.getItem(key)

  return data
    ? JSON.parse(data)
    : []
}

export function saveData(
  key: string,
  data: any
) {

  localStorage.setItem(
    key,
    JSON.stringify(data)
  )
}

export function clearStorage() {

  localStorage.clear()
}