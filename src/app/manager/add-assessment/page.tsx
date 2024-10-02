"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircle, Trash2 } from "lucide-react";
import { useCreateAssessment } from "@/features/manager/api/use-create-assessment";

interface Question {
  id: number;
  text: string;
  type: "MULTIPLE_CHOICE" | "TEXT";
  options?: string[];
}

export default function AssessmentCreator() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [newQuestion, setNewQuestion] = useState<Question>({
    id: 0,
    text: "",
    type: "TEXT",
    options: ["", ""],
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [responses, setResponses] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(false);

  const mutation = useCreateAssessment();

  const addQuestion = () => {
    if (
      newQuestion.text.trim() &&
      (newQuestion.type === "TEXT" ||
        (newQuestion.type === "MULTIPLE_CHOICE" &&
          newQuestion.options &&
          newQuestion.options.filter((opt) => opt.trim()).length >= 2))
    ) {
      setQuestions([...questions, { ...newQuestion, id: Date.now() }]);
      setNewQuestion({
        id: 0,
        text: "",
        type: "TEXT",
        options: ["", ""],
      });
      setIsDialogOpen(false);
    }
  };

  const updateNewQuestionOption = (index: number, value: string) => {
    if (newQuestion.options) {
      const updatedOptions = [...newQuestion.options];
      updatedOptions[index] = value;
      setNewQuestion({ ...newQuestion, options: updatedOptions });
    }
  };

  const addNewQuestionOption = () => {
    if (newQuestion.options) {
      setNewQuestion({ ...newQuestion, options: [...newQuestion.options, ""] });
    }
  };

  const removeNewQuestionOption = (index: number) => {
    if (newQuestion.options && newQuestion.options.length > 2) {
      const updatedOptions = newQuestion.options.filter((_, i) => i !== index);
      setNewQuestion({ ...newQuestion, options: updatedOptions });
    }
  };

  const handleResponseChange = (questionId: number, value: string) => {
    setResponses({ ...responses, [questionId]: value });
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const assessmentData = {
      title,
      description,
      questions: questions.map((question) => ({
        questionText: question.text,
        questionType: question.type,
        options: question.options,
      })),
    };

    mutation.mutate(assessmentData, {
      onSuccess: () => {
        setQuestions([]);
        setTitle("");
        setDescription("");
        setLoading(false);
      },
      onError: () => {
        setLoading(false);
      },
    });

    console.log(assessmentData);
  };

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <h1 className="text-2xl font-bold mb-4">Create Assessment</h1>

      <div className="mb-4">
        <Label htmlFor="title" className="block text-sm font-medium mb-1">
          Assessment Title
        </Label>
        <Input
          disabled={loading}
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter assessment title"
          className="w-full"
        />
      </div>
      <div className="mb-4">
        <Label htmlFor="description" className="block text-sm font-medium mb-1">
          Assessment Description
        </Label>
        <Textarea
          disabled={loading}
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter assessment description"
          className="w-full"
        />
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button disabled={loading} className="mb-4">
            <PlusCircle className="h-4 w-4 mr-2" /> Add Question
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Question</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="question-type">Question Type</Label>
              <Select
                onValueChange={(value: "MULTIPLE_CHOICE" | "TEXT") =>
                  setNewQuestion({
                    ...newQuestion,
                    type: value,
                    options: value === "MULTIPLE_CHOICE" ? ["", ""] : undefined,
                  })
                }
                value={newQuestion.type}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select question type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MULTIPLE_CHOICE">
                    Multiple Choice
                  </SelectItem>
                  <SelectItem value="TEXT">Text Input</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="question-text">Question</Label>
              <Textarea
                id="question-text"
                value={newQuestion.text}
                onChange={(e) =>
                  setNewQuestion({ ...newQuestion, text: e.target.value })
                }
                placeholder="Enter question text"
              />
            </div>
            {newQuestion.type === "MULTIPLE_CHOICE" && newQuestion.options && (
              <>
                {newQuestion.options.map((option, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={option}
                      onChange={(e) =>
                        updateNewQuestionOption(index, e.target.value)
                      }
                      placeholder={`Option ${index + 1}`}
                    />
                    {(newQuestion?.options?.length ?? 0) > 2 && (
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => removeNewQuestionOption(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button variant="outline" onClick={addNewQuestionOption}>
                  <PlusCircle className="h-4 w-4 mr-2" /> Add Option
                </Button>
              </>
            )}
          </div>
          <Button onClick={addQuestion}>Add Question</Button>
        </DialogContent>
      </Dialog>

      {questions.length > 0 && (
        <form onSubmit={onSubmit} className="space-y-6">
          {questions.map((question, qIndex) => (
            <div key={question.id} className="p-4 border rounded-lg">
              <h2 className="text-lg font-semibold mb-2">
                Question {qIndex + 1}
              </h2>
              <p className="mb-2">{question.text}</p>
              {question.type === "MULTIPLE_CHOICE" && question.options ? (
                <RadioGroup
                  onValueChange={(value) =>
                    handleResponseChange(question.id, value)
                  }
                  value={responses[question.id] || ""}
                >
                  {question.options.map((option, oIndex) => (
                    <div key={oIndex} className="flex items-center space-x-2">
                      <RadioGroupItem
                        value={option}
                        id={`q${question.id}-o${oIndex}`}
                      />
                      <Label htmlFor={`q${question.id}-o${oIndex}`}>
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              ) : (
                <Textarea
                  value={responses[question.id] || ""}
                  onChange={(e) =>
                    handleResponseChange(question.id, e.target.value)
                  }
                  placeholder="Enter your answer"
                  className="w-full mt-2"
                />
              )}
            </div>
          ))}
          <Button disabled={loading} type="submit" className="w-full">
            Save Assessment
          </Button>
        </form>
      )}
    </div>
  );
}
