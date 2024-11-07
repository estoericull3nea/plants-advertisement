export const dateTimeBodyTemplate = (rowData) => {
  return new Date(rowData.createdAt).toLocaleString()
}
