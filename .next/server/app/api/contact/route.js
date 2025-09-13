"use strict";(()=>{var e={};e.id=386,e.ids=[386],e.modules={8013:e=>{e.exports=require("mongodb")},399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},1282:e=>{e.exports=require("child_process")},4770:e=>{e.exports=require("crypto")},665:e=>{e.exports=require("dns")},7702:e=>{e.exports=require("events")},2048:e=>{e.exports=require("fs")},2615:e=>{e.exports=require("http")},8791:e=>{e.exports=require("https")},8216:e=>{e.exports=require("net")},9801:e=>{e.exports=require("os")},5315:e=>{e.exports=require("path")},6162:e=>{e.exports=require("stream")},2452:e=>{e.exports=require("tls")},7360:e=>{e.exports=require("url")},1764:e=>{e.exports=require("util")},1568:e=>{e.exports=require("zlib")},696:(e,t,r)=>{r.r(t),r.d(t,{originalPathname:()=>w,patchFetch:()=>I,requestAsyncStorage:()=>y,routeModule:()=>x,serverHooks:()=>b,staticGenerationAsyncStorage:()=>E});var s={};r.r(s),r.d(s,{GET:()=>f,POST:()=>g});var a=r(9303),o=r(8716),i=r(3131),n=r(7070),d=r(5245),c=r(4184),l=r(5637),u=r(5355),p=r(2456);let m=()=>{let e=process.env.EMAIL_PASSWORD||process.env.EMAIL_PASS;if(!process.env.EMAIL_USER||!e)throw Error("Email configuration missing. Please set EMAIL_USER and EMAIL_PASSWORD environment variables.");return d.createTransport({host:process.env.SMTP_HOST||"smtp.gmail.com",port:parseInt(process.env.SMTP_PORT||"587"),secure:!1,auth:{user:process.env.EMAIL_USER,pass:e}})},h=e=>`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>New Inquiry from WELL-LI Website</title>
      <style>
        /* 【重点】邮件样式 - 确保在各种邮件客户端中正常显示 */
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1f2937; color: white; padding: 20px; text-align: center; }
        .content { background: #f9fafb; padding: 20px; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #374151; }
        .value { margin-top: 5px; padding: 10px; background: white; border-left: 4px solid #3b82f6; }
        .message { background: white; padding: 15px; border-radius: 5px; margin-top: 10px; }
        .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- 【重点】邮件头部 - 显示公司信息和通知类型 -->
        <div class="header">
          <h1>New Customer Inquiry</h1>
          <p>WELL-LI Cases Website</p>
        </div>
        
        <!-- 【重点】邮件内容 - 显示客户提交的所有信息 -->
        <div class="content">
          <!-- 客户姓名 -->
          <div class="field">
            <div class="label">Customer Name:</div>
            <div class="value">${e.name}</div>
          </div>
          
          <!-- 客户邮箱 -->
          <div class="field">
            <div class="label">Email Address:</div>
            <div class="value">${e.email}</div>
          </div>
          
          <!-- 客户电话（如果提供） -->
          ${e.phone?`
          <div class="field">
            <div class="label">Phone Number:</div>
            <div class="value">${e.phone}</div>
          </div>
          `:""}
          
          <!-- 客户国家 -->
          <div class="field">
            <div class="label">Country:</div>
            <div class="value">${e.country}</div>
          </div>
          
          <!-- 客户公司（如果提供） -->
          ${e.company?`
          <div class="field">
            <div class="label">Company:</div>
            <div class="value">${e.company}</div>
          </div>
          `:""}
          
          <!-- 感兴趣的产品（如果选择） -->
          ${e.productInterest?`
          <div class="field">
            <div class="label">Product of Interest:</div>
            <div class="value">${e.productInterest}</div>
          </div>
          `:""}
          
          <!-- 客户咨询消息 -->
          <div class="field">
            <div class="label">Message:</div>
            <div class="message">${e.message.replace(/\n/g,"<br>")}</div>
          </div>
        </div>
        
        <!-- 【重点】邮件底部 - 提醒管理员及时回复 -->
        <div class="footer">
          <p>This inquiry was submitted through the WELL-LI Cases website contact form.</p>
          <p>Please respond to the customer within 24 hours.</p>
        </div>
      </div>
    </body>
    </html>
  `,v=e=>`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Thank you for your inquiry - WELL-LI Cases</title>
      <style>
        /* 【重点】客户邮件样式 - 专业友好的确认邮件样式 */
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1f2937; color: white; padding: 20px; text-align: center; }
        .content { background: #f9fafb; padding: 20px; }
        .highlight { background: #dbeafe; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .contact-info { background: white; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- 【重点】感谢标题 - 表达对客户咨询的感谢 -->
        <div class="header">
          <h1>Thank You for Your Inquiry!</h1>
          <p>WELL-LI Plastic Products Co., Ltd.</p>
        </div>
        
        <!-- 【重点】邮件主体内容 - 详细说明后续处理流程 -->
        <div class="content">
          <p>Dear ${e.name},</p>
          
          <p>Thank you for your interest in WELL-LI Cases. We have received your inquiry and our team will review your requirements carefully.</p>
          
          <!-- 【重点】处理流程说明 - 让客户了解接下来会发生什么 -->
          <div class="highlight">
            <h3>What happens next?</h3>
            <ul>
              <li>Our sales team will review your inquiry within 24 hours</li>
              <li>We'll prepare a customized quote based on your requirements</li>
              <li>You'll receive a detailed response with product specifications and pricing</li>
              <li>Our team will be available to answer any additional questions</li>
            </ul>
          </div>
          
          <!-- 【重点】联系信息 - 提供直接联系方式 -->
          <div class="contact-info">
            <h3>Contact Information</h3>
            <p><strong>Email:</strong> info@well-li.com</p>
            <p><strong>Phone:</strong> +86 20 1234 5678</p>
            <p><strong>Address:</strong> Industrial Zone, Guangzhou, China</p>
            <p><strong>Business Hours:</strong> Mon-Fri 8:00 AM - 6:00 PM (GMT+8)</p>
          </div>
          
          <p>If you have any urgent questions, please don't hesitate to contact us directly.</p>
          
          <p>Best regards,<br>
          The WELL-LI Cases Team</p>
        </div>
        
        <!-- 【重点】邮件底部 - 公司信息和免责声明 -->
        <div class="footer">
          <p>WELL-LI Plastic Products Co., Ltd. | Reliable Protective Cases Manufacturer</p>
          <p>This is an automated confirmation email. Please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;async function g(e){try{(0,p.dk)(p.Lm)(e);let t=await e.json(),r=(0,l.E8)(t);if(!r.isValid)throw new u.p8("Validation failed",r.errors);let s=(0,l.eI)(t),a=m(),o={from:process.env.SMTP_FROM||process.env.EMAIL_USER,to:process.env.SMTP_TO||process.env.ADMIN_EMAIL||process.env.EMAIL_USER,subject:`New Inquiry from ${s.name} - WELL-LI Cases`,html:h(s)},i={from:process.env.SMTP_FROM||process.env.EMAIL_USER,to:s.email,subject:"Thank you for your inquiry - WELL-LI Cases",html:v(s)};await Promise.all([a.sendMail(o),a.sendMail(i)]);try{let t=await (0,c.N8)(),r={...l.Us,name:s.name,email:s.email,phone:s.phone,country:s.country,company:s.company,productInterest:s.productInterest,message:s.message,ipAddress:e.ip||e.headers.get("x-forwarded-for")||"unknown",userAgent:e.headers.get("user-agent")||"unknown",createdAt:new Date,updatedAt:new Date},a=await t.collection(c.Ul.INQUIRIES).insertOne(r);console.log("Inquiry saved to database:",a.insertedId)}catch(e){console.error("Failed to save inquiry to database:",e),(0,u.H)(new u.Eg("Failed to save inquiry"),{context:"contact-form"})}return n.NextResponse.json({message:"Inquiry submitted successfully",success:!0},{status:200,headers:p.S5})}catch(r){let t=(0,u.zG)(r);return(0,u.H)(t,{context:"contact-form",request:e.url}),n.NextResponse.json({error:t.message,code:t.code||"UNKNOWN_ERROR"},{status:t.statusCode||500,headers:p.S5})}}async function f(){return n.NextResponse.json({message:"Contact API endpoint is working",methods:["POST"]},{status:200,headers:p.S5})}let x=new a.AppRouteRouteModule({definition:{kind:o.x.APP_ROUTE,page:"/api/contact/route",pathname:"/api/contact",filename:"route",bundlePath:"app/api/contact/route"},resolvedPagePath:"E:\\nanuk\\src\\app\\api\\contact\\route.ts",nextConfigOutput:"",userland:s}),{requestAsyncStorage:y,staticGenerationAsyncStorage:E,serverHooks:b}=x,w="/api/contact/route";function I(){return(0,i.patchFetch)({serverHooks:b,staticGenerationAsyncStorage:E})}},5355:(e,t,r)=>{r.d(t,{Eg:()=>o,H:()=>d,p8:()=>a,zG:()=>c});class s extends Error{constructor(e,t=500,r){super(e),this.statusCode=t,this.code=r,this.isOperational=!0,Error.captureStackTrace(this,this.constructor)}}class a extends s{constructor(e,t){super(e,400,"VALIDATION_ERROR"),this.name="ValidationError"}}class o extends s{constructor(e="Database operation failed"){super(e,500,"DATABASE_ERROR"),this.name="DatabaseError"}}class i extends s{constructor(e="Network request failed"){super(e,503,"NETWORK_ERROR"),this.name="NetworkError"}}class n extends s{constructor(e="Authentication failed"){super(e,401,"AUTH_ERROR"),this.name="AuthenticationError"}}function d(e,t){return{message:e.message,stack:e.stack,timestamp:new Date,...e instanceof s&&{code:e.code,statusCode:e.statusCode},...!1,...t}}function c(e){if("TypeError"===e.name&&e.message.includes("fetch"))return new i("Failed to connect to server");if(e.response){let t=e.response.status,r=e.response.data?.message||e.message;switch(t){case 400:return new a(r);case 401:return new n(r);case 404:return new s("Resource not found",404,"NOT_FOUND");case 429:return new s("Too many requests",429,"RATE_LIMIT");case 500:return new s("Internal server error",500,"SERVER_ERROR");default:return new s(r,t)}}return"MongoError"===e.name||"MongoServerError"===e.name?new o(`Database error: ${e.message}`):"ValidationError"===e.name?new a(e.message):new s(e.message||"An unexpected error occurred")}}};var t=require("../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),s=t.X(0,[948,972,245,253],()=>r(696));module.exports=s})();