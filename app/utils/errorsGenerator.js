module.exports = (error) => {
  if (typeof error === 'string') {
    return {
      message: error
    }
  } else if (typeof error === 'object') {
    return {
      message: error.message,
      details: error.details
    }
  }
}
