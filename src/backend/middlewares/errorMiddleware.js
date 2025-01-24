export const errorHandler = (err, req, res) => {
  const status = err.status || 500
  const message = err.message || 'Internal server error'
  const dev = process.env.NODE_ENV === 'dev'

  let response = {
    status,
    message
  }

  if (err.errors && err.errors.length > 0) {
    response.errors = err.errors.map((error) => ({
      field: error.path,
      message: error.msg
    }))
  }
  if (dev) {
    console.error(err)
  }

  res.status(status).json(response)
}
