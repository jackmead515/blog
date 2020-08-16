function staticFile(path) {
  return (req, res) => {
    return res.sendFile(path);
  }
}

module.exports = {
  staticFile
}