import { serve } from "https://deno.land/std@0.222.1/http/server.ts";
import { configure, renderFile } from "https://deno.land/x/eta@v2.2.0/mod.ts";
import * as chatService from "./services/chatService.js";
  
configure({
  views: `${Deno.cwd()}/views/`,
});

const responseDetails = {
  headers: { "Content-Type": "text/html;charset=UTF-8" },
};

const redirectTo = (path) => {
  return new Response(`Redirecting to ${path}.`, {
    status: 303,
    headers: {
      "Location": path,
    },
  });
};

const mainPage = "/";

const saveMessage = async (request) => {
    const formData = await request.formData();
    await chatService.saveMessage(formData.get("sender"), formData.get("message"));
};

const handleRequest = async (request) => {
    const url = new URL(request.url);
    if (url.pathname === "/") {
        if (request.method === "GET") {
            const data = {
                postings: await chatService.getFiveRecentMessages(),
            };
            return new Response(await renderFile("index.eta", data), responseDetails);
        } else if (request.method === "POST") {
            await saveMessage(request);
            return redirectTo(mainPage);
        }
    }
    return redirectTo(mainPage);
};

serve(handleRequest, { port: 7777 });
