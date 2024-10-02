"use client";

import { DataTable } from "@/components/data-table";
import Heading from "@/components/heading";
import { Separator } from "@/components/ui/separator";
import { useGetUsers } from "@/features/admin/api/use-get-users";
import React from "react";
import { columns } from "./columns";
import { useBulkDeleteAccounts } from "@/features/admin/api/use-bulk-delete-accounts";

const UsersListPage = () => {
  const accountsQuery = useGetUsers();
  const accounts = accountsQuery.data || [];
  const deleteAccounts = useBulkDeleteAccounts();

  const isDisabled = accountsQuery.isLoading || deleteAccounts.isPending;

  return (
    <div>
      <Heading
        title="Users List"
        description="You can modify the user(s) information in this page."
      />
      <Separator className="my-6" />

      <DataTable
        columns={columns}
        data={accounts}
        filterKey="name"
        onDelete={(row) => {
          const ids = row.map((r) => r.original.id);
          deleteAccounts.mutate({ ids });
        }}
        disabled={isDisabled}
      />
    </div>
  );
};

export default UsersListPage;
