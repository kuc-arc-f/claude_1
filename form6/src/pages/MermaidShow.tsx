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
//
export default function Page(item: any) { 
console.log(item);
  const mText = item.content;
  //
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
      <>
        <div>
          <a href="/mermaid"> 
            <Button variant="outline" className="mx-2">Back</Button>
          </a>
        </div>        
        <Card className="w-full max-w-4xl mx-auto my-2">
          <CardHeader>
            <CardTitle>{item.title}</CardTitle>
            <CardDescription>
              <span>ID : {item.id}</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <hr className="my-1" />
            <pre className="mermaid text-white">{mText}</pre>
          </CardContent>
          <CardFooter className="flex justify-between">
          </CardFooter>
        </Card> 
      </>
      {(process.env.NODE_ENV !== "production") ? (
        <script type="module" src="/mermaid.js"></script>
      ): (
        <script type="module" src="/public/mermaid.js"></script>
      )}  
    </body>
  </html>
  );
}
/*
*/

