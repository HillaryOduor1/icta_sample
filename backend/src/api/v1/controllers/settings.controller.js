import { SettingsService } from '../services/settings.service.js';
import { SettingsTransformer } from '../transformers/settings.transformer.js';
import { asyncHandler } from '../../../shared/utils/asyncHandler.js';
import { successResponse } from '../../../shared/utils/response.util.js';

export const getSettings = asyncHandler(async (req, res) => {
  const settingsService = new SettingsService(req.models.Settings);
  const settings = await settingsService.getSettings(req.tenantId);
  return successResponse(res, 200, 'Settings retrieved', SettingsTransformer.toResponse(settings));
});

export const updateSettings = asyncHandler(async (req, res) => {
  const settingsService = new SettingsService(req.models.Settings);
  const updated = await settingsService.updateSettings(req.tenantId, req.body, req.user.sub);
  return successResponse(res, 200, 'Settings updated', SettingsTransformer.toResponse(updated));
});

export const resetSettings = asyncHandler(async (req, res) => {
  const settingsService = new SettingsService(req.models.Settings);
  const reset = await settingsService.resetSettings(req.tenantId);
  return successResponse(res, 200, 'Settings reset to default', SettingsTransformer.toResponse(reset));
});
