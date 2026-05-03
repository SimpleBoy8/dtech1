import db from "../config/db.js";

export const saveMessage = async (req, res) => {
  try {
    const { sender_id, receiver_id, message, message_type, file_url, voice_url } = req.body;

    await db.query(
      `INSERT INTO messages (sender_id, receiver_id, message, message_type, file_url, voice_url)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [sender_id, receiver_id, message || null, message_type, file_url || null, voice_url || null]
    );

    res.status(201).json({ message: "Message saved" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { userId, adminId } = req.params;

    const [rows] = await db.query(
      `SELECT * FROM messages
       WHERE (sender_id = ? AND receiver_id = ?)
          OR (sender_id = ? AND receiver_id = ?)
       ORDER BY created_at ASC`,
      [userId, adminId, adminId, userId]
    );

    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};