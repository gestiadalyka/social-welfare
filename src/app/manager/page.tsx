"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  MoreVertical,
  Plus,
  FileText,
  ClipboardList,
  Filter,
} from "lucide-react";
import { useGetAssessments } from "@/features/manager/api/use-get-assessments";
import { AssessmentStat } from "@prisma/client";
import { useRouter } from "next/navigation";

interface Assessment {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  // status: "Published" | "Draft" | "Archived";
  status: AssessmentStat;
}

export default function AdminAssessmentList() {
  // const [assessments, setAssessments] = useState<Assessment[]>(mockAssessments);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    Assessment["status"] | "All"
  >("All");

  const router = useRouter();

  const assessmentsQuery = useGetAssessments();
  const assessmentsData = assessmentsQuery.data || [];

  const filteredAssessments = assessmentsData.filter(
    (assessment) =>
      (assessment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assessment?.description
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase())) &&
      (statusFilter === "All" || assessment?.status === statusFilter)
  );

  const getStatusColor = (status: Assessment["status"]) => {
    switch (status) {
      case "PUBLISHED":
        return "bg-green-500";
      case "DRAFT":
        return "bg-yellow-500";
      case "ARCHIVED":
        return "bg-gray-500";
      default:
        return "bg-blue-500";
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Assessment Management</h1>
        <Button onClick={() => router.push("/manager/add-assessment")}>
          <Plus className="mr-2 h-4 w-4" /> Create New Assessment
        </Button>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <div className="relative flex-grow">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search assessments"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(value: Assessment["status"] | "All") =>
            setStatusFilter(value)
          }
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Statuses</SelectItem>
            <SelectItem value="Published">Published</SelectItem>
            <SelectItem value="Draft">Draft</SelectItem>
            <SelectItem value="Archived">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {filteredAssessments.length > 0 ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[400px]">Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAssessments.map((assessment) => (
                <TableRow key={assessment.id}>
                  <TableCell className="font-medium">
                    {assessment.title}
                  </TableCell>
                  <TableCell>{assessment.description}</TableCell>
                  <TableCell>
                    {new Date(assessment.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`${getStatusColor(
                        assessment.status
                      )} text-white`}
                    >
                      {assessment.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <FileText className="mr-2 h-4 w-4" />
                          <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <ClipboardList className="mr-2 h-4 w-4" />
                          <span>View Responses</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Plus className="mr-2 h-4 w-4" />
                          <span>Duplicate</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-500 mb-4">
            <FileText className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-semibold mb-2">No Assessments Found</h2>
          <p className="text-gray-500 mb-4">
            Get started by creating your first assessment.
          </p>
          <Button onClick={() => router.push("/manager/add-assessment")}>
            <Plus className="mr-2 h-4 w-4" /> Create New Assessment
          </Button>
        </div>
      )}
    </div>
  );
}
