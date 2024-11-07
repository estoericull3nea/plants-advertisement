export const formatDate = (date) => {
  if (!date) return ''

  const formattedDate = new Date(date).toLocaleDateString('en-US')
  return formattedDate
}
