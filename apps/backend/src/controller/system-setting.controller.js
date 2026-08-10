import { SystemSettingService } from "../service/system-setting.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export class SystemSettingController {
  create = async (req, res) => {
    const result = await SystemSettingService.create(req.user.id, req.body);

    return res
      .status(201)
      .json(
        ApiResponse.success(result, "System settings created successfully")
      );
  };

  get = async (req, res) => {
    const result = await SystemSettingService.get(req.user.id);

    return res.json(
      ApiResponse.success(result, "System settings fetched successfully")
    );
  };

  update = async (req, res) => {
    const result = await SystemSettingService.update(req.user.id, req.body);

    return res.json(
      ApiResponse.success(result, "System settings updated successfully")
    );
  };
}
