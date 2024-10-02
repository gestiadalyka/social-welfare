"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useArchiveAccount } from "@/features/admin/api/use-archive-account";
// import { useDeleteAccount } from "@/features/accounts/api/use-delete-account";
// import { useOpenAccount } from "@/features/accounts/hooks/use-open-account";
import { useConfirm } from "@/hooks/use-confirm";
import { Archive, Edit, MoreHorizontal } from "lucide-react";

type Props = {
  id: string;
};

export const Actions = ({ id }: Props) => {
  //   const { onOpen } = useOpenAccount();
  const deleteMutation = useArchiveAccount(id);

  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about to archive this account."
  );

  const onArchive = async () => {
    const ok = await confirm();

    if (ok) {
      deleteMutation.mutate();
    }
  };

  return (
    <>
      <ConfirmDialog />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            disabled={deleteMutation.isPending}
            onClick={() => {}}
          >
            <Edit className="mr-2 h-4 w-4" /> Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-rose-500"
            disabled={false}
            onClick={onArchive}
          >
            <Archive className="mr-2 h-4 w-4" /> Archive
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
