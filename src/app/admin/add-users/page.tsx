"use client";

import Heading from "@/components/heading";
import { Separator } from "@/components/ui/separator";
import { useCallback, useEffect, useState } from "react";
import { FileRejection, FileWithPath, useDropzone } from "react-dropzone";
import Papa from "papaparse";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table";
import { columns } from "./columns";
import { useCreateAccounts } from "@/features/admin/api/use-create-accounts";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Users() {
  const [file, setFile] = useState<File[] | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [open, setOpen] = useState(false);

  const mutation = useCreateAccounts();
  const loading = mutation.isPending;

  const csv = file?.[0];
  useEffect(() => {
    if (csv) {
      Papa.parse(csv, {
        download: true,
        header: true,
        complete: function (results) {
          setUsers(results.data);
        },
      });
    }
  }, [csv]);

  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[], rejectedFiles: FileRejection[]) => {
      // Do something with the files
      setFile(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );

      if (rejectedFiles.length > 0) {
        rejectedFiles.forEach(({ errors }) => {
          errors[0]?.message && toast.error(errors[0].message);
        });
        setFile(null);
      }
    },
    []
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      csv: [".csv"],
    },
    onDrop,
    maxFiles: 1,
  });

  const onSubmit = async () => {
    // console.log(users);
    mutation.mutate(users, {
      onSuccess: () => {
        setUsers([]);
      },
    });
  };

  return (
    <div className="w-full">
      <Heading title="Add users" description="Add users here with csv file" />
      <Separator className="my-6" />
      {users.length > 0 ? (
        <div className="flex flex-col gap-y-3">
          <div className="flex items-center justify-end gap-x-3">
            <Button onClick={onSubmit} disabled={loading}>
              Add users
            </Button>
            <Button
              disabled={loading}
              variant="outline"
              onClick={() => setUsers([])}
            >
              Clear
            </Button>
          </div>
          <DataTable data={users} columns={columns} filterKey="name" />
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={cn(
            "group relative mt-8 grid h-48 w-full cursor-pointer place-items-center rounded-lg border-2 border-dashed border-muted-foreground/25 px-5 py-2.5 text-center transition hover:bg-muted/25",
            "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            isDragActive && "border-muted-foreground/50"
          )}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the file here ...</p>
          ) : (
            <p>
              Drag &apos;n&apos; drop the csv file here, or click to select file
            </p>
          )}
        </div>
      )}
    </div>
  );
}
