function notFoundHandler(req, res, next) {
  res.status(404).json({
    success: false,
    message: 'Resource not found bitch',
  });
}

module.exports = notFoundHandler;
