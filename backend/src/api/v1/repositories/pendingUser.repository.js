export class PendingUserRepository {
  constructor(model) {
    this.model = model;
  }

  async create(data) {
    const pendingUser = new this.model(data);
    return pendingUser.save();
  }

  async findByEmail(email, tenantId) {
    return this.model.findOne({ email, tenantId, status: 'pending' });
  }

  async findPendingByTenant(tenantId, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      this.model.find({ tenantId, status: 'pending' })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      this.model.countDocuments({ tenantId, status: 'pending' })
    ]);
    return { users, total };
  }

  async findById(id) {
    return this.model.findById(id);
  }

  async updateStatus(id, status, approvedBy = null, rejectionReason = null) {
    const update = { status };
    if (approvedBy) {
      update.approvedBy = approvedBy;
      update.approvedAt = new Date();
    }
    if (rejectionReason) {
      update.rejectionReason = rejectionReason;
    }
    return this.model.findByIdAndUpdate(id, update, { new: true });
  }

  async delete(id) {
    return this.model.findByIdAndDelete(id);
  }
}