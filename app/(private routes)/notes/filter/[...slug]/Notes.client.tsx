type GetNotesParams = {
  search?: string
  tag?: 'Work' | 'Personal' | 'Meeting' | 'Shopping' | 'Todo' | 'all'
  page?: number
  perPage?: number
  sortBy?: 'created' | 'updated'
}
