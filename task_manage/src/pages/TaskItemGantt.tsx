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
import { format } from 'date-fns';

import Layout from './Layout';
import Head from '../components/Head'
//
const getTaskString = function (items: any, projectCreatedAt: string): string
{
  try{
    let ret = "";
    //@ts-ignore
    items.forEach((element, index) => {
      let start = "2023-12-12";
      let end = "2023-12-12";
      if(element.task_end) {
        end = element.task_end;
      }
      if(element.task_start) {
        start = element.task_start;
      }
      let row  = "    section Task" + "\n";
      row += "        "+ element.title + ` :${start}, ${end}` + "\n";
      ret += row;
      //console.log(element);
    });
    return ret;
  } catch (e) {
    console.error(e);
    throw new Error('Error , getTaskString');
  }
}

//
export default function Page(props: any) { 
console.log(props.id);
  const dateSpan = getTaskString(props.item, "");
  
  const testTitle = "test-Gantt";
  const ganttText = `
gantt
    title Gantt Diagram
    dateFormat YYYY-MM-DD
${dateSpan}
`;
console.log(ganttText);
//return "1";
  const mText = ganttText;
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
          <a href={`/task_item?id=${props.id}`}> 
            <Button variant="outline" className="mx-2 mt-2">Back</Button>
          </a>
        </div>      
        <Card className="w-full max-w-4xl mx-auto my-2">
          <CardHeader>
            <CardTitle></CardTitle>
            <CardDescription>
              {/* <span>ID : {item.id}</span> */} 
            </CardDescription>
          </CardHeader>
          <CardContent>
            <hr className="my-1" />
            <pre className="mermaid">{mText}</pre>
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

