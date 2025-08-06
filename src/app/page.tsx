import Login from "@/components/Login";
import { getCountriesCallingCodes } from "./action";

export default async function Home() {
  const { data, error, status } = await getCountriesCallingCodes();

  if (error) {
    return <div>Error: {error}</div>;
  }
  return <Login data={data} />;
}
