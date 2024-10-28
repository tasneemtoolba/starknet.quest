import {
  ArgentDapp,
  ArgentDappMap,
  ArgentUserDapp,
  ArgentToken,
  ArgentTokenValue,
  ArgentTokenMap,
  ArgentUserToken,
} from "types/backTypes";

const API_BASE = "https://cloud.argent-api.com";
const API_VERSION = "v1";
const API_HEADERS = {
  "argent-client": "portfolio",
  "argent-network": "mainnet",
  "argent-version": "1.4.3",
};

const fetchData = async <T>(endpoint: string): Promise<T> => {
  try {
    const response = await fetch(endpoint, { headers: API_HEADERS });
    if (!response.ok) {
      throw new Error(
        `Error ${response.status}: ${await response.text()}`
      );
    }
    return await response.json();
  } catch (err) {
    console.log("Error fetching data from Argent API", err);
    throw err;
  }
};

export const fetchDapps = async () => {
  const data = await fetchData<ArgentDapp[]>(`${API_BASE}/${API_VERSION}/tokens/dapps?chain=starknet`);
  return Object.fromEntries(data.map((dapp) => [dapp.dappId, dapp])) as ArgentDappMap;
};

export const fetchTokens = async () => {
  const data = await fetchData<{ tokens: ArgentToken[] }>(`${API_BASE}/${API_VERSION}/tokens/info?chain=starknet`);
  return Object.fromEntries(data.tokens.map((token) => [token.address, token])) as ArgentTokenMap;
};

export const fetchUserTokens = async (walletAddress: string) => {
  const data = await fetchData<{ balances: ArgentUserToken[], status: string }>(`${API_BASE}/${API_VERSION}/activity/starknet/mainnet/account/${walletAddress}/balance`);
  return data.balances;
};

export const fetchUserDapps = async (walletAddress: string) => {
  const data = await fetchData<{ dapps: ArgentUserDapp[] }>(`${API_BASE}/${API_VERSION}/tokens/defi/decomposition/${walletAddress}?chain=starknet`);
  return data.dapps;
};

export const calculateTokenPrice = async (
  tokenAddress: string,
  tokenAmount: string,
  currency: "USD" | "EUR" | "GBP" = "USD"
) => {
  const data = await fetchData<ArgentTokenValue>(`${API_BASE}/${API_VERSION}/tokens/prices/${tokenAddress}?chain=starknet&currency=${currency}`);
  try {
    return Number(tokenAmount) * Number(data.ccyValue);
  } catch (err) {
    console.log("Error while calculating token price", err);
    throw err;
  }
};
