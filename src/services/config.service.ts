import pool from "../db/postgres";
import { log } from "../utils/logger";

export async function getUserConfig(accountId: number) {
  const { rows } = await pool.query(
    `SELECT config_status, config_data
     FROM user_configs
     WHERE account_id = $1`,
    [accountId]
  );

  if (!rows.length) {
    return {
      IsConfigActive: false,
      ConfigStatus: "INITIAL",
      ConfigStage: buildConfigStage(),
    };
  }

  return {
    IsConfigActive: true,
    ConfigStatus: rows[0].config_status,
    ConfigStage: buildConfigStage(rows[0].config_data),
  };
}

export async function updateConfig(
  accountId: number,
  configItems: { ConfigItemId: string; SelectedValue: string }[]
) {
  if (!Array.isArray(configItems)) {
    throw new Error("Invalid ConfigItems");
  }

  await pool.query(
    `INSERT INTO user_configs (account_id, config_status, config_data)
     VALUES ($1, 'ACTIVE', $2)
     ON CONFLICT (account_id)
     DO UPDATE SET
       config_data = EXCLUDED.config_data,
       config_status = 'ACTIVE'`,
    [accountId, JSON.stringify(configItems)]
  );

  log("INFO", "Config updated", { accountId });
}

function buildConfigStage(saved?: any[]) {
  return {
    WizardStepTitle: "FedEx Configuration",
    WizardStepDescription: "Configure FedEx prepaid labels",
    ConfigItems: [
      {
        ConfigItemId: "FEDEX_ACCOUNT",
        Name: "FedEx Account Number",
        Description: "Your FedEx billing account",
        GroupName: "FedEx",
        SortOrder: 1,
        SelectedValue:
          saved?.find(i => i.ConfigItemId === "FEDEX_ACCOUNT")
            ?.SelectedValue || "",
        MustBeSpecified: true,
        ReadOnly: false,
        ListValues: null,
        ValueType: 1,
      },
    ],
  };
}
