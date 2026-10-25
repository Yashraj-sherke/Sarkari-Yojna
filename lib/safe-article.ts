import sanitizeHtml from 'sanitize-html';
export function safeArticleHref(value:string):string|null{
 try {const url=new URL(value,'https://www.sarkariyojanasetu.com');if(!['http:','https:'].includes(url.protocol))return null;
  return value.startsWith('/')&&!value.startsWith('//')||value.startsWith('#')?value:url.href;
 }catch{return null;}
}
export function safeArticleHtml(value:string){return sanitizeHtml(value,{
 allowedTags:['p','h2','h3','h4','strong','b','em','i','u','ul','ol','li','a','br','blockquote','table','thead','tbody','tr','th','td','div','span'],
 allowedAttributes:{a:['href','title','target','rel'],div:['class'],span:['class'],table:['class']},
 allowedSchemes:['https','http'],allowProtocolRelative:false,
 transformTags:{a:sanitizeHtml.simpleTransform('a',{rel:'noopener noreferrer'})},
});}
