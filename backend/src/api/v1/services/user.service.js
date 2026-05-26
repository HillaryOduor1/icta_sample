import { UserRepository } from '../repositories/user.repository.js';
import { PendingUserRepository } from '../repositories/pendingUser.repository.js';
import { ActivityRepository } from '../repositories/activity.repository.js';
import { CreateUserDTO } from '../dtos/request/createUser.dto.js';
import { UpdateUserDTO } from '../dtos/request/updateUser.dto.js';
import { RegisterRequestDTO } from '../dtos/request/register.dto.js';
import { AppError } from '../../../shared/errors/AppError.js';
import bcrypt from 'bcrypt';

export class UserService {
  constructor(userModel, pendingUserModel, activityModel = null) {
    if (!userModel) throw new Error('UserModel is required');
    this.userRepo = new UserRepository(userModel);
    this.pendingUserRepo = new PendingUserRepository(pendingUserModel);
    // Only create ActivityRepository if activityModel is provided
    this.activityRepo = activityModel ? new ActivityRepository(activityModel) : null;
  }

  async getUsers(tenantId, pagination) {
    const { page, limit, sort, filter } = pagination;
    return this.userRepo.findAllWithPagination(tenantId, { page, limit, sort, filter });
  }

  async getUserById(id, tenantId) {
    const user = await this.userRepo.findById(id, tenantId);
    if (!user) throw new AppError('User not found', 404);
    return user;
  }

  // Public registration - creates pending approval
  async register(data, tenantId, requestInfo = {}) {
    const dto = new RegisterRequestDTO(data);
    dto.validate();

    // Check if user already exists and is active
    const existingUser = await this.userRepo.findByEmail(dto.email, tenantId);
    if (existingUser) {
      throw new AppError('User with this email already exists', 409);
    }

    // Check if there's already a pending request
    const pendingRequest = await this.pendingUserRepo.findByEmail(dto.email, tenantId);
    if (pendingRequest) {
      throw new AppError('Registration request already pending approval', 409);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(dto.password, 12);
    console.log('Original password:', dto.password);
    console.log('Hashed password length:', hashedPassword.length);
    console.log('Hashed password preview:', hashedPassword.substring(0, 20));

    // Create pending user
    /*const pendingUser = await this.pendingUserRepo.create({
      username: dto.username,
      email: dto.email,
      password: hashedPassword,
      role: dto.role,
      tenantId: tenantId,
      requestedBy: requestInfo.ip || 'unknown',
      status: 'pending'
    });*/
      const pendingUser = await this.pendingUserRepo.create({
        username: dto.username,
        email: dto.email,
        password: hashedPassword,
        role: dto.role,
        tenantId: tenantId,
        requestedBy: requestInfo.ip || 'unknown',
        status: 'pending'
      });

    // Log activity if activityRepo is available
    if (this.activityRepo) {
      await this.activityRepo.log(tenantId, 'user_registration', 
        `Registration request submitted for ${dto.username} (${dto.email})`, 
        null, 
        'system'
      );
    }

    return {
      message: 'Registration request submitted. Please wait for admin approval.',
      requestId: pendingUser._id
    };
  }

  // Admin only - approve pending user
  async approveUser(pendingUserId, tenantId, adminUserId) {
    const pendingUser = await this.pendingUserRepo.findById(pendingUserId);
    console.log('Pending user password hash length:', pendingUser.password?.length);

    if (!pendingUser) {
      throw new AppError('Registration request not found', 404);
    }
    
    if (pendingUser.tenantId !== tenantId) {
      throw new AppError('Unauthorized to approve this user', 403);
    }
    
    if (pendingUser.status !== 'pending') {
      throw new AppError(`This request has already been ${pendingUser.status}`, 400);
    }

    // Create the actual user
    const newUser = await this.userRepo.create({
      username: pendingUser.username,
      email: pendingUser.email,
      password: pendingUser.password, // This should already be hashed from registration
      role: pendingUser.role,
      tenantId: tenantId,
      active: true,
      authProvider: 'local'
    });
    console.log('Created user has password?', !!newUser.password);
    /*const newUser = await this.userRepo.create({
      username: pendingUser.username,
      email: pendingUser.email,
      password: pendingUser.password, // Already hashed
      role: pendingUser.role,
      tenantId: tenantId,
      active: true,
      authProvider: 'local'
    });*/

    // Update pending user status
    await this.pendingUserRepo.updateStatus(pendingUserId, 'approved', adminUserId);

    // Log activity if activityRepo is available
    if (this.activityRepo) {
      await this.activityRepo.log(tenantId, 'user_approved', 
        `User ${pendingUser.username} (${pendingUser.email}) approved by admin`, 
        adminUserId, 
        'admin'
      );
    }

    return {
      message: 'User approved successfully',
      user: newUser
    };
  }

  // Admin only - reject pending user
  async rejectUser(pendingUserId, tenantId, adminUserId, reason) {
    const pendingUser = await this.pendingUserRepo.findById(pendingUserId);
    
    if (!pendingUser) {
      throw new AppError('Registration request not found', 404);
    }
    
    if (pendingUser.tenantId !== tenantId) {
      throw new AppError('Unauthorized to reject this user', 403);
    }
    
    if (pendingUser.status !== 'pending') {
      throw new AppError(`This request has already been ${pendingUser.status}`, 400);
    }

    await this.pendingUserRepo.updateStatus(pendingUserId, 'rejected', adminUserId, reason);

    // Log activity if activityRepo is available
    if (this.activityRepo) {
      await this.activityRepo.log(tenantId, 'user_rejected', 
        `User ${pendingUser.email} rejected by admin. Reason: ${reason}`, 
        adminUserId, 
        'admin'
      );
    }

    return {
      message: 'User registration rejected'
    };
  }

  // Admin only - get pending registrations
  async getPendingRegistrations(tenantId, page = 1, limit = 20) {
    return this.pendingUserRepo.findPendingByTenant(tenantId, page, limit);
  }

  async createUser(data) {
    const dto = new CreateUserDTO(data);
    dto.validate();

    const existing = await this.userRepo.findByEmail(dto.email, dto.tenantId);
    if (existing) throw new AppError('User with this email already exists', 409);

    const hashedPassword = dto.password ? await bcrypt.hash(dto.password, 12) : undefined;
    const userData = { ...dto, password: hashedPassword };
    const user = await this.userRepo.create(userData);

    if (this.activityRepo) {
      await this.activityRepo.log(dto.tenantId, 'user_create', `Created user ${user.username}`, user._id, user.username);
    }
    return user;
  }

  async updateUser(id, tenantId, updates) {
    const dto = new UpdateUserDTO(updates);
    dto.validate();

    const user = await this.userRepo.findById(id, tenantId);
    if (!user) throw new AppError('User not found', 404);

    if (dto.password) dto.password = await bcrypt.hash(dto.password, 12);
    const updated = await this.userRepo.update(id, tenantId, dto);

    if (this.activityRepo) {
      await this.activityRepo.log(tenantId, 'user_update', `Updated user ${user.username}`, user._id, user.username);
    }
    return updated;
  }

  async deleteUser(id, tenantId) {
    const user = await this.userRepo.findById(id, tenantId);
    if (!user) throw new AppError('User not found', 404);
    await this.userRepo.delete(id, tenantId);
    if (this.activityRepo) {
      await this.activityRepo.log(tenantId, 'user_delete', `Deleted user ${user.username}`, null, 'system');
    }
  }

  async toggleStatus(id, tenantId) {
    const user = await this.userRepo.findById(id, tenantId);
    if (!user) throw new AppError('User not found', 404);
    const updated = await this.userRepo.update(id, tenantId, { active: !user.active });
    if (this.activityRepo) {
      await this.activityRepo.log(tenantId, 'user_toggle_status', `${updated.active ? 'Enabled' : 'Disabled'} user ${user.username}`, user._id, user.username);
    }
    return updated;
  }
}
/*import { UserRepository } from '../repositories/user.repository.js';
import { PendingUserRepository } from '../repositories/pendingUser.repository.js';
import { ActivityRepository } from '../repositories/activity.repository.js';
import { CreateUserDTO } from '../dtos/request/createUser.dto.js';
import { UpdateUserDTO } from '../dtos/request/updateUser.dto.js';
import { RegisterRequestDTO } from '../dtos/request/register.dto.js';
import { AppError } from '../../../shared/errors/AppError.js';
import bcrypt from 'bcrypt';

export class UserService {
  constructor(userModel, pendingUserModel, activityModel) {
    if (!userModel) throw new Error('UserModel is required');
    if (!pendingUserModel) throw new Error('PendingUserModel is required');
    
    this.userRepo = new UserRepository(userModel);
    this.pendingUserRepo = new PendingUserRepository(pendingUserModel);
    // Only initialize ActivityRepository if activityModel is provided
    this.activityRepo = activityModel ? new ActivityRepository(activityModel) : null;
  }

  async getUsers(tenantId, pagination) {
    const { page, limit, sort, filter } = pagination;
    return this.userRepo.findAllWithPagination(tenantId, { page, limit, sort, filter });
  }

  async getUserById(id, tenantId) {
    const user = await this.userRepo.findById(id, tenantId);
    if (!user) throw new AppError('User not found', 404);
    return user;
  }

  // Public registration - creates pending approval
  async register(data, tenantId, requestInfo = {}) {
    const dto = new RegisterRequestDTO(data);
    dto.validate();

    // Check if user already exists and is active
    const existingUser = await this.userRepo.findByEmail(dto.email, tenantId);
    if (existingUser) {
      throw new AppError('User with this email already exists', 409);
    }

    // Check if there's already a pending request
    const pendingRequest = await this.pendingUserRepo.findByEmail(dto.email, tenantId);
    if (pendingRequest) {
      throw new AppError('Registration request already pending approval', 409);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(dto.password, 12);

    // Create pending user
    const pendingUser = await this.pendingUserRepo.create({
      username: dto.username,
      email: dto.email,
      password: hashedPassword,
      role: dto.role,
      tenantId: tenantId,
      requestedBy: requestInfo.ip || 'unknown',
      status: 'pending'
    });

    // Log activity if activityRepo is available
    if (this.activityRepo) {
      await this.activityRepo.log(tenantId, 'user_registration', 
        `Registration request submitted for ${dto.username} (${dto.email})`, 
        null, 
        'system'
      );
    }

    return {
      message: 'Registration request submitted. Please wait for admin approval.',
      requestId: pendingUser._id
    };
  }

  // Admin only - approve pending user
  async approveUser(pendingUserId, tenantId, adminUserId) {
    const pendingUser = await this.pendingUserRepo.findById(pendingUserId);
    
    if (!pendingUser) {
      throw new AppError('Registration request not found', 404);
    }
    
    if (pendingUser.tenantId !== tenantId) {
      throw new AppError('Unauthorized to approve this user', 403);
    }
    
    if (pendingUser.status !== 'pending') {
      throw new AppError(`This request has already been ${pendingUser.status}`, 400);
    }

    // Create the actual user
    const newUser = await this.userRepo.create({
      username: pendingUser.username,
      email: pendingUser.email,
      password: pendingUser.password, // Already hashed
      role: pendingUser.role,
      tenantId: tenantId,
      active: true,
      authProvider: 'local'
    });

    // Update pending user status
    await this.pendingUserRepo.updateStatus(pendingUserId, 'approved', adminUserId);

    if (this.activityRepo) {
      await this.activityRepo.log(tenantId, 'user_approved', 
        `User ${pendingUser.username} (${pendingUser.email}) approved by admin`, 
        adminUserId, 
        'admin'
      );
    }

    return {
      message: 'User approved successfully',
      user: newUser
    };
  }

  // Admin only - reject pending user
  async rejectUser(pendingUserId, tenantId, adminUserId, reason) {
    const pendingUser = await this.pendingUserRepo.findById(pendingUserId);
    
    if (!pendingUser) {
      throw new AppError('Registration request not found', 404);
    }
    
    if (pendingUser.tenantId !== tenantId) {
      throw new AppError('Unauthorized to reject this user', 403);
    }
    
    if (pendingUser.status !== 'pending') {
      throw new AppError(`This request has already been ${pendingUser.status}`, 400);
    }

    await this.pendingUserRepo.updateStatus(pendingUserId, 'rejected', adminUserId, reason);

    if (this.activityRepo) {
      await this.activityRepo.log(tenantId, 'user_rejected', 
        `User ${pendingUser.email} rejected by admin. Reason: ${reason}`, 
        adminUserId, 
        'admin'
      );
    }

    return {
      message: 'User registration rejected'
    };
  }

  // Admin only - get pending registrations
  async getPendingRegistrations(tenantId, page = 1, limit = 20) {
    return this.pendingUserRepo.findPendingByTenant(tenantId, page, limit);
  }

  async createUser(data) {
    const dto = new CreateUserDTO(data);
    dto.validate();

    const existing = await this.userRepo.findByEmail(dto.email, dto.tenantId);
    if (existing) throw new AppError('User with this email already exists', 409);

    const hashedPassword = dto.password ? await bcrypt.hash(dto.password, 12) : undefined;
    const userData = { ...dto, password: hashedPassword };
    const user = await this.userRepo.create(userData);

    if (this.activityRepo) {
      await this.activityRepo.log(dto.tenantId, 'user_create', `Created user ${user.username}`, user._id, user.username);
    }
    return user;
  }

  async updateUser(id, tenantId, updates) {
    const dto = new UpdateUserDTO(updates);
    dto.validate();

    const user = await this.userRepo.findById(id, tenantId);
    if (!user) throw new AppError('User not found', 404);

    if (dto.password) dto.password = await bcrypt.hash(dto.password, 12);
    const updated = await this.userRepo.update(id, tenantId, dto);

    if (this.activityRepo) {
      await this.activityRepo.log(tenantId, 'user_update', `Updated user ${user.username}`, user._id, user.username);
    }
    return updated;
  }

  async deleteUser(id, tenantId) {
    const user = await this.userRepo.findById(id, tenantId);
    if (!user) throw new AppError('User not found', 404);
    await this.userRepo.delete(id, tenantId);
    
    if (this.activityRepo) {
      await this.activityRepo.log(tenantId, 'user_delete', `Deleted user ${user.username}`, null, 'system');
    }
  }

  async toggleStatus(id, tenantId) {
    const user = await this.userRepo.findById(id, tenantId);
    if (!user) throw new AppError('User not found', 404);
    const updated = await this.userRepo.update(id, tenantId, { active: !user.active });
    
    if (this.activityRepo) {
      await this.activityRepo.log(tenantId, 'user_toggle_status', `${updated.active ? 'Enabled' : 'Disabled'} user ${user.username}`, user._id, user.username);
    }
    return updated;
  }
}*/
/*import { UserRepository } from '../repositories/user.repository.js';
import { PendingUserRepository } from '../repositories/pendingUser.repository.js';
import { ActivityRepository } from '../repositories/activity.repository.js';
import { CreateUserDTO } from '../dtos/request/createUser.dto.js';
import { UpdateUserDTO } from '../dtos/request/updateUser.dto.js';
import { RegisterRequestDTO } from '../dtos/request/register.dto.js';
import { AppError } from '../../../shared/errors/AppError.js';
import bcrypt from 'bcrypt';

export class UserService {
  constructor(userModel, pendingUserModel) {
    if (!userModel) throw new Error('UserModel is required');
    this.userRepo = new UserRepository(userModel);
    this.pendingUserRepo = new PendingUserRepository(pendingUserModel);
    this.activityRepo = new ActivityRepository();
  }

  async getUsers(tenantId, pagination) {
    const { page, limit, sort, filter } = pagination;
    return this.userRepo.findAllWithPagination(tenantId, { page, limit, sort, filter });
  }

  async getUserById(id, tenantId) {
    const user = await this.userRepo.findById(id, tenantId);
    if (!user) throw new AppError('User not found', 404);
    return user;
  }

  // Public registration - creates pending approval
  async register(data, tenantId, requestInfo = {}) {
    const dto = new RegisterRequestDTO(data);
    dto.validate();

    // Check if user already exists and is active
    const existingUser = await this.userRepo.findByEmail(dto.email, tenantId);
    if (existingUser) {
      throw new AppError('User with this email already exists', 409);
    }

    // Check if there's already a pending request
    const pendingRequest = await this.pendingUserRepo.findByEmail(dto.email, tenantId);
    if (pendingRequest) {
      throw new AppError('Registration request already pending approval', 409);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(dto.password, 12);

    // Create pending user
    const pendingUser = await this.pendingUserRepo.create({
      username: dto.username,
      email: dto.email,
      password: hashedPassword,
      role: dto.role,
      tenantId: tenantId,
      requestedBy: requestInfo.ip || 'unknown',
      status: 'pending'
    });

    await this.activityRepo.log(tenantId, 'user_registration', 
      `Registration request submitted for ${dto.username} (${dto.email})`, 
      null, 
      'system'
    );

    return {
      message: 'Registration request submitted. Please wait for admin approval.',
      requestId: pendingUser._id
    };
  }

  // Admin only - approve pending user
  async approveUser(pendingUserId, tenantId, adminUserId) {
    const pendingUser = await this.pendingUserRepo.findById(pendingUserId);
    
    if (!pendingUser) {
      throw new AppError('Registration request not found', 404);
    }
    
    if (pendingUser.tenantId !== tenantId) {
      throw new AppError('Unauthorized to approve this user', 403);
    }
    
    if (pendingUser.status !== 'pending') {
      throw new AppError(`This request has already been ${pendingUser.status}`, 400);
    }

    // Create the actual user
    const newUser = await this.userRepo.create({
      username: pendingUser.username,
      email: pendingUser.email,
      password: pendingUser.password, // Already hashed
      role: pendingUser.role,
      tenantId: tenantId,
      active: true,
      authProvider: 'local'
    });

    // Update pending user status
    await this.pendingUserRepo.updateStatus(pendingUserId, 'approved', adminUserId);

    await this.activityRepo.log(tenantId, 'user_approved', 
      `User ${pendingUser.username} (${pendingUser.email}) approved by admin`, 
      adminUserId, 
      'admin'
    );

    return {
      message: 'User approved successfully',
      user: newUser
    };
  }

  // Admin only - reject pending user
  async rejectUser(pendingUserId, tenantId, adminUserId, reason) {
    const pendingUser = await this.pendingUserRepo.findById(pendingUserId);
    
    if (!pendingUser) {
      throw new AppError('Registration request not found', 404);
    }
    
    if (pendingUser.tenantId !== tenantId) {
      throw new AppError('Unauthorized to reject this user', 403);
    }
    
    if (pendingUser.status !== 'pending') {
      throw new AppError(`This request has already been ${pendingUser.status}`, 400);
    }

    await this.pendingUserRepo.updateStatus(pendingUserId, 'rejected', adminUserId, reason);

    await this.activityRepo.log(tenantId, 'user_rejected', 
      `User ${pendingUser.email} rejected by admin. Reason: ${reason}`, 
      adminUserId, 
      'admin'
    );

    return {
      message: 'User registration rejected'
    };
  }

  // Admin only - get pending registrations
  async getPendingRegistrations(tenantId, page = 1, limit = 20) {
    return this.pendingUserRepo.findPendingByTenant(tenantId, page, limit);
  }

  async createUser(data) {
    const dto = new CreateUserDTO(data);
    dto.validate();

    const existing = await this.userRepo.findByEmail(dto.email, dto.tenantId);
    if (existing) throw new AppError('User with this email already exists', 409);

    const hashedPassword = dto.password ? await bcrypt.hash(dto.password, 12) : undefined;
    const userData = { ...dto, password: hashedPassword };
    const user = await this.userRepo.create(userData);

    await this.activityRepo.log(dto.tenantId, 'user_create', `Created user ${user.username}`, user._id, user.username);
    return user;
  }

  async updateUser(id, tenantId, updates) {
    const dto = new UpdateUserDTO(updates);
    dto.validate();

    const user = await this.userRepo.findById(id, tenantId);
    if (!user) throw new AppError('User not found', 404);

    if (dto.password) dto.password = await bcrypt.hash(dto.password, 12);
    const updated = await this.userRepo.update(id, tenantId, dto);

    await this.activityRepo.log(tenantId, 'user_update', `Updated user ${user.username}`, user._id, user.username);
    return updated;
  }

  async deleteUser(id, tenantId) {
    const user = await this.userRepo.findById(id, tenantId);
    if (!user) throw new AppError('User not found', 404);
    await this.userRepo.delete(id, tenantId);
    await this.activityRepo.log(tenantId, 'user_delete', `Deleted user ${user.username}`, null, 'system');
  }

  async toggleStatus(id, tenantId) {
    const user = await this.userRepo.findById(id, tenantId);
    if (!user) throw new AppError('User not found', 404);
    const updated = await this.userRepo.update(id, tenantId, { active: !user.active });
    await this.activityRepo.log(tenantId, 'user_toggle_status', `${updated.active ? 'Enabled' : 'Disabled'} user ${user.username}`, user._id, user.username);
    return updated;
  }
}*/
/*import { UserRepository } from '../repositories/user.repository.js';
import { ActivityRepository } from '../repositories/activity.repository.js';
import { CreateUserDTO } from '../dtos/request/createUser.dto.js';
import { UpdateUserDTO } from '../dtos/request/updateUser.dto.js';
import { AppError } from '../../../shared/errors/AppError.js';
import bcrypt from 'bcrypt';

export class UserService {
  constructor(userModel) {
    if (!userModel) throw new Error('UserModel is required');
    this.userRepo = new UserRepository(userModel);
    this.activityRepo = new ActivityRepository(); // adjust if ActivityRepo needs tenant model
  }

  async getUsers(tenantId, pagination) {
    const { page, limit, sort, filter } = pagination;
    return this.userRepo.findAllWithPagination(tenantId, { page, limit, sort, filter });
  }

  async getUserById(id, tenantId) {
    const user = await this.userRepo.findById(id, tenantId);
    if (!user) throw new AppError('User not found', 404);
    return user;
  }

  async createUser(data) {
    const dto = new CreateUserDTO(data);
    dto.validate();

    const existing = await this.userRepo.findByEmail(dto.email, dto.tenantId);
    if (existing) throw new AppError('User with this email already exists', 409);

    const hashedPassword = dto.password ? await bcrypt.hash(dto.password, 12) : undefined;
    const userData = { ...dto, password: hashedPassword };
    const user = await this.userRepo.create(userData);

    await this.activityRepo.log(dto.tenantId, 'user_create', `Created user ${user.username}`, user._id, user.username);
    return user;
  }

  async updateUser(id, tenantId, updates) {
    const dto = new UpdateUserDTO(updates);
    dto.validate();

    const user = await this.userRepo.findById(id, tenantId);
    if (!user) throw new AppError('User not found', 404);

    if (dto.password) dto.password = await bcrypt.hash(dto.password, 12);
    const updated = await this.userRepo.update(id, tenantId, dto);

    await this.activityRepo.log(tenantId, 'user_update', `Updated user ${user.username}`, user._id, user.username);
    return updated;
  }

  async deleteUser(id, tenantId) {
    const user = await this.userRepo.findById(id, tenantId);
    if (!user) throw new AppError('User not found', 404);
    await this.userRepo.delete(id, tenantId);
    await this.activityRepo.log(tenantId, 'user_delete', `Deleted user ${user.username}`, null, 'system');
  }

  async toggleStatus(id, tenantId) {
    const user = await this.userRepo.findById(id, tenantId);
    if (!user) throw new AppError('User not found', 404);
    const updated = await this.userRepo.update(id, tenantId, { active: !user.active });
    await this.activityRepo.log(tenantId, 'user_toggle_status', `${updated.active ? 'Enabled' : 'Disabled'} user ${user.username}`, user._id, user.username);
    return updated;
  }
}*/
/*import { UserRepository } from '../repositories/user.repository.js';
import { ActivityRepository } from '../repositories/activity.repository.js';
import { CreateUserDTO } from '../dtos/request/createUser.dto.js';
import { UpdateUserDTO } from '../dtos/request/updateUser.dto.js';
import { AppError } from '../../../shared/errors/AppError.js';

const userRepo = new UserRepository();
const activityRepo = new ActivityRepository();

export class UserService {
  async getUsers(tenantId, pagination) {
    const { page, limit, sort, filter } = pagination;
    return userRepo.findAllWithPagination(tenantId, { page, limit, sort, filter });
  }

  async getUserById(id, tenantId) {
    const user = await userRepo.findById(id, tenantId);
    if (!user) throw new AppError('User not found', 404);
    return user;
  }

  async createUser(data) {
    const dto = new CreateUserDTO(data);
    dto.validate();

    const existing = await userRepo.findByEmail(dto.email, dto.tenantId);
    if (existing) throw new AppError('User with this email already exists', 409);

    const hashedPassword = dto.password ? await bcrypt.hash(dto.password, 12) : undefined;
    const userData = { ...dto, password: hashedPassword };
    const user = await userRepo.create(userData);

    await activityRepo.log(dto.tenantId, 'user_create', `Created user ${user.username}`, user._id, user.username);
    return user;
  }

  async updateUser(id, tenantId, updates) {
    const dto = new UpdateUserDTO(updates);
    dto.validate();

    const user = await userRepo.findById(id, tenantId);
    if (!user) throw new AppError('User not found', 404);

    if (dto.password) dto.password = await bcrypt.hash(dto.password, 12);
    const updated = await userRepo.update(id, tenantId, dto);

    await activityRepo.log(tenantId, 'user_update', `Updated user ${user.username}`, user._id, user.username);
    return updated;
  }

  async deleteUser(id, tenantId) {
    const user = await userRepo.findById(id, tenantId);
    if (!user) throw new AppError('User not found', 404);
    await userRepo.delete(id, tenantId);
    await activityRepo.log(tenantId, 'user_delete', `Deleted user ${user.username}`, null, 'system');
  }

  async toggleStatus(id, tenantId) {
    const user = await userRepo.findById(id, tenantId);
    if (!user) throw new AppError('User not found', 404);
    const updated = await userRepo.update(id, tenantId, { active: !user.active });
    await activityRepo.log(tenantId, 'user_toggle_status', `${updated.active ? 'Enabled' : 'Disabled'} user ${user.username}`, user._id, user.username);
    return updated;
  }
}*/