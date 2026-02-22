import { Metadata } from "next";
import { getFunds } from "@/actions/ziswaf/funds";
import { FundsClient } from "./FundsClient";

export const metadata: Metadata = {
  title: "Master Dana Administrasi",
  description: "Kelola Master Kantong Dana ZISWAF",
};

export default async function FundsAdminPage() {
  const funds = await getFunds();

  return <FundsClient initialFunds={funds} />;
}
