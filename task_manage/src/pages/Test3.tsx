import * as React from 'react';
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import Layout from './Layout';
import Head from '../components/Head'

console.log("env=", process.env.NODE_ENV)
//
export default function Page() { 
  const mText = `erDiagram
  Post ||--|{ BookPost: "1 - 1 over"
  Book ||--|{ BookPost: "1 - 1 over"
  Post {
    integer id
    string title
    string content
    integer userId
    integer categoryId
    string createdAt
    string updatedAt
  }
  Book {
    integer id
    string title
    string content
    integer userId
    integer userId
    string createdAt
    string updatedAt
  }
  BookPost {
    integer id
    integer postId
    integer bookId
    integer userId
    string createdAt
    string updatedAt
  }
  Users {
    integer id
    string name
    string email
    string password
    string createdAt
    string updatedAt    
  }
    `;
  return (
    <html>
    <head>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>welcome</title>
      {(process.env.NODE_ENV !== "production") ? (
          <link href="/static/style.css" rel="stylesheet" />
      ): (
        <link href="/public/static/style.css" rel="stylesheet" />
      )} 
    </head>
    <body>
      <main>
      <h1>Test3</h1>
      <h1 className="text-4xl font-bold">Button!</h1>
      <hr className="my-2" />
      <Button>Click me</Button>
      <hr className="my-2" />
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Create Card Item</CardTitle>
          <CardDescription>information , title</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Name 123" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="framework">SelectItems</Label>
                <Select>
                  <SelectTrigger id="framework">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="item_1">item_1</SelectItem>
                    <SelectItem value="item_2">item_2</SelectItem>
                    <SelectItem value="item_3">item_3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Cancel</Button>
          <Button>Deploy</Button>
        </CardFooter>
      </Card> 
      <hr className="my-2" />
      <pre className="mermaid">{mText}</pre>
      </main>
      <script type="module" src="/mermaid.js"></script>
    </body>
  </html>
  );
}
/*
*/

