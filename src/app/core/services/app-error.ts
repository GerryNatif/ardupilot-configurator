/**
 * Application-level error that carries an i18n translation key and optional
 * interpolation parameters instead of a hard-coded human-readable message.
 *
 * Usage:
 *   throw new AppError('errors.transport.no_port_selected');
 *   throw new AppError('errors.http.request_failed', { status: 404, url: 'https://…' });
 */
export class AppError extends Error {
  constructor(
    public readonly key: string,
    public readonly params?: Record<string, unknown>,
  ) {
    super(key);
    this.name = 'AppError';
  }
}
