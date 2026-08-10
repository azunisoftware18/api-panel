import LedgerEntryService from "../service/ledger-entry.service.js";

class LedgerEntryController {
  static async getAll(req, res) {
    const data = await LedgerEntryService.getAll(req.user, req.query);

    return res.success(data, "Ledger entries fetched");
  }

  static async getById(req, res) {
    const data = await LedgerEntryService.getById(req.params.id);

    return res.success(data, "Ledger entry fetched");
  }
}

export default LedgerEntryController;
