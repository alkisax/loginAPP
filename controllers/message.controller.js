/**
 * @swagger
 * /api/message:
 *   get:
 *     summary: Get a welcome message from the server
 *     description: Returns a simple "Hello from the server" message
 *     responses:
 *       200:
 *         description: A welcome message
 *       500:
 *         description: Internal server error
 *     tags:
 *       - Message
 */

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