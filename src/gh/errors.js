export class GhError extends Error {
  constructor(code, status = 500, detail = '') {
    super(code);
    this.code = code;
    this.status = status;
    this.detail = detail;
  }
}
export const errCode = (e) => (e && e.code) || (e && e.message) || 'error';
