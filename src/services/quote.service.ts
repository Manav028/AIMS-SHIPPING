export async function getQuote() {
  return {
    QuoteItems: [
      {
        ServiceName: "FedEx Prepaid",
        ServiceCode: "FEDEX_PREPAID",
        ServiceId: "FEDEX-001",
        Cost: 0,
        Tax: 0,
        TotalCost: 0,
        Currency: "GBP",
      },
    ],
  };
}