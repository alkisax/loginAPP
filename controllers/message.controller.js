

exports.message = (req, res) => {
  try {
    res.status(200).json({
      status: true,
      message: "Hello from the server!!"
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      error: "Internal server error"
    });
  }
}