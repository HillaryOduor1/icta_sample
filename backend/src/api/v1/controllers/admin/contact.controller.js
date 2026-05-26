exports.getMessages = async (req, res) => {
  try {
    const ContactMessage = req.models.ContactMessage;
    const { page = 1, limit = 20, status } = req.query;
    const filter = { tenantId: req.tenant._id };
    if (status) filter.status = status;

    const messages = await ContactMessage.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await ContactMessage.countDocuments(filter);

    res.json({
      messages,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const ContactMessage = req.models.ContactMessage;   // ✅ add this
    const message = await ContactMessage.findOne({ _id: req.params.id, tenantId: req.tenant._id });
    if (!message) return res.status(404).json({ error: 'Not found' });
    message.status = 'read';
    await message.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteMessage = async (req, res) => {
  try {
    const ContactMessage = req.models.ContactMessage;   // ✅ add this
    const result = await ContactMessage.deleteOne({ _id: req.params.id, tenantId: req.tenant._id });
    if (result.deletedCount === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
//const ContactMessage = require('../../models/ContactMessage');
/*
exports.getMessages = async (req, res) => {
  try {
    const ContactMessage = req.models.ContactMessage; 
    const { page = 1, limit = 20, status } = req.query;
    const filter = { tenantId: req.tenant._id };
    if (status) filter.status = status;

    const messages = await ContactMessage.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await ContactMessage.countDocuments(filter);

    res.json({
      messages,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const message = await ContactMessage.findOne({ _id: req.params.id, tenantId: req.tenant._id });
    if (!message) return res.status(404).json({ error: 'Not found' });
    message.status = 'read';
    await message.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteMessage = async (req, res) => {
  try {
    const result = await ContactMessage.deleteOne({ _id: req.params.id, tenantId: req.tenant._id });
    if (result.deletedCount === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};*/