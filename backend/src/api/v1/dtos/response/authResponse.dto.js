export class AuthResponseDTO {
  constructor(accessToken, refreshToken, user) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.tokenType = 'Bearer';
    this.expiresIn = 900; // 15 minutes
    this.user = user;
  }
}