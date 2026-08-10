import dashboardService from "../service/dashboard.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";

class DashboardController {
  static getDashboard = async (req, res) => {
    const dashboard = await dashboardService.getDashboard(req.user);
    return res
      .status(201)
      .json(ApiResponse.success(dashboard, "Dashboard fetched successfully"));
  };
}

export default DashboardController;
