"use client";

import { ColumnDef } from "@tanstack/react-table";
import { InferResponseType } from "hono";

export type UsersColumnType = {
  householdNumber: string;
  name: string;
};
export const columns: ColumnDef<UsersColumnType>[] = [
  {
    accessorKey: "householdNumber",
    header: "Houseshold Number",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
];
