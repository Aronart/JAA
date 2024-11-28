import Airtable from "airtable";

const airtableBase = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID!
);

export const getAirtableRecord = async (recordId: string) => {
  try {
    const record = await airtableBase(process.env.AIRTABLE_TABLE_NAME!).find(recordId);
    return record.fields.result || null;
  } catch (error) {
    console.error(`Error fetching record ${recordId}:`, error);
    throw new Error("Result not found");
  }
};