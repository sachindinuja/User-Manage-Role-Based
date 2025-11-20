import { fetchData } from "../../services/fetchData";

// new Scheme Rules data fetch
export const fetchRuleDataAndPush = async (ruleKey, url, setActiveData) => {
  try {
    const res = await fetchData(url);
    console.log(`Fetched for ${ruleKey}:`, res);

    setActiveData((prev) => [...prev, { key: ruleKey, data: res }]);
  } catch (err) {
    console.error(`Error fetching data for ${ruleKey}:`, err);
  }
};
