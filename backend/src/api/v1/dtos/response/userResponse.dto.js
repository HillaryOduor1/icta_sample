export class UserResponseDTO {
  constructor(user) {
    this.id = user._id.toString();
    this.username = user.username;
    this.email = user.email;
    this.role = user.role;
    this.active = user.active;
    this.createdAt = user.createdAt?.toISOString();
    this.updatedAt = user.updatedAt?.toISOString();
  }
}