
"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChangeEvent, useEffect, useRef, useState } from "react";
import React from "react";
import { FileBoxIcon, Loader } from "lucide-react";
import { generateQuizz, InitialStateType } from "@/actions/action.quizz";
import { useFormState, useFormStatus } from "react-dom";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";


export const dynamic = 'force-dynamic';


const initialState: InitialStateType = {
  status: undefined,
  message: ""
}

export default function GeneratePage() {

  const [state, formAction] = useFormState(generateQuizz, initialState)
  const [file, setFile] = useState<File | null>(null)


  const fileInputRef = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  const { toast } = useToast()
  const { isLoaded, user } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (!isLoaded) return;
    if (!user) router.push("/sign-up");
  }, [isLoaded, user, router]);

  if (!isLoaded || !user) return null;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files?.[0].type === "application/pdf") {
      setFile(e?.target?.files?.[0])
    } else {
      toast({ description: "Please upload PDF file" })
    }
  }

  const handleFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }

  return (
    <div className="border-2 h-full w-full flex flex-col items-center justify-center p-10">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Upload a PDF file</CardTitle>
          <CardDescription>Drag and drop a file here or click the button to select a file.</CardDescription>
        </CardHeader>
        <form ref={formRef} action={formAction}>
          <CardContent className="grid gap-4">
            <div className="relative grid gap-2 items-center justify-center p-8 border-2 border-dashed rounded-md border-muted hover:border-primary transition-colors">
              <InputField
                onChange={handleChange}
                ref={fileInputRef}
              />

              <CloudUploadIcon className="w-10 h-10 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Drag and drop a file here</p>
            </div>
            <div className="flex justify-center">
              <Button type="button" variant="outline"
                onClick={handleFileSelect}
              >
                <FilePlusIcon className="mr-2 h-4 w-4" />
                {file ? "Select another file" : "Select a file"}
              </Button>
            </div>
            {file && (
              <FileInfo file={file} />
            )}
          </CardContent>
          {file && (
            <CardFooter className="flex justify-end">
              <BtnUpload />
            </CardFooter>
          )}
        </form>
      </Card>
      {state?.status === "REJECTED" && (
        <div className="rounded-md p-2 bg-red-50 text-red-500 mt-5 text-balance">
          {state.message}
        </div>
      )}
    </div>
  )
}


const InputField = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>((props, ref) => (
  <input type="file" name="file" ref={ref} className="absolute w-full h-full opacity-0 cursor-pointer" {...props} />
));

InputField.displayName = "InputField";

function FileInfo({ file }: { file: File }) {
  return (
    <div className="grid gap-2">
      <div className="flex items-center gap-4">
        <FileBoxIcon />
        <div className="flex-1 grid leading-4">
          <div className="text-[13.5px] font-medium">{file.name}</div>
          <div className="text-[13px] text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
        </div>
      </div>
    </div>
  )
}

function BtnUpload() {
  const { pending } = useFormStatus()
  return (
    <>
      {pending ? (
        <div className="w-full">
          <Button size="icon" className="w-full" disabled>
            <Loader className="animate-spin" />
          </Button>
        </div>
      ) : (
        <Button type="submit">Submit</Button >
      )}
    </>
  )
}

function CloudUploadIcon({ ...props }) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
      <path d="M12 12v9" />
      <path d="m16 16-4-4-4 4" />
    </svg>
  )
}

function FilePlusIcon({ ...props }) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M9 15h6" />
      <path d="M12 18v-6" />
    </svg>
  )
}